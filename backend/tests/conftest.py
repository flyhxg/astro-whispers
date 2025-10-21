import asyncio
import json as json_module
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import urlsplit

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.datastructures import Headers
from starlette.types import Message, Scope

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.main import app
from app.database import Base, get_db
from app.services.bootstrap import bootstrap_data


@dataclass
class SimpleResponse:
    status_code: int
    headers: Headers
    _body: bytes

    def json(self) -> Any:
        if not self._body:
            return None
        return json_module.loads(self._body.decode('utf-8'))

    def text(self) -> str:
        return self._body.decode('utf-8')


class SimpleTestClient:
    def __init__(self, app):
        self.app = app

    def request(
        self,
        method: str,
        url: str,
        *,
        json: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> SimpleResponse:
        return asyncio.run(self._async_request(method, url, json=json, headers=headers))

    async def _async_request(
        self,
        method: str,
        url: str,
        *,
        json: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> SimpleResponse:
        target = urlsplit(url)
        path = target.path or '/'
        query_string = target.query.encode('utf-8')

        body = b''
        req_headers: Dict[str, str] = {k.lower(): v for k, v in (headers or {}).items()}
        if json is not None:
            body = json_module.dumps(json).encode('utf-8')
            req_headers.setdefault('content-type', 'application/json')
            req_headers['content-length'] = str(len(body))
        else:
            body = b''

        scope: Scope = {
            'type': 'http',
            'http_version': '1.1',
            'method': method.upper(),
            'scheme': target.scheme or 'http',
            'path': path,
            'raw_path': path.encode('utf-8'),
            'query_string': query_string,
            'headers': [(k.encode('latin-1'), v.encode('latin-1')) for k, v in req_headers.items()],
            'client': ('testclient', 50000),
            'server': ('testserver', 80),
        }

        receive_messages: List[Message] = [
            {'type': 'http.request', 'body': body, 'more_body': False}
        ]
        sent_messages: List[Message] = []

        async def receive() -> Message:
            if receive_messages:
                return receive_messages.pop(0)
            return {'type': 'http.disconnect'}

        async def send(message: Message) -> None:
            sent_messages.append(message)

        await self.app(scope, receive, send)

        response_start = next(msg for msg in sent_messages if msg['type'] == 'http.response.start')
        status_code = response_start['status']
        raw_headers = response_start.get('headers', [])

        body_bytes = b''.join(
            msg.get('body', b'')
            for msg in sent_messages
            if msg['type'] == 'http.response.body'
        )

        headers_obj = Headers(raw=raw_headers)
        return SimpleResponse(status_code=status_code, headers=headers_obj, _body=body_bytes)

    def get(self, url: str, **kwargs: Any) -> SimpleResponse:
        return self.request('GET', url, **kwargs)

    def post(self, url: str, **kwargs: Any) -> SimpleResponse:
        return self.request('POST', url, **kwargs)

    def put(self, url: str, **kwargs: Any) -> SimpleResponse:
        return self.request('PUT', url, **kwargs)

    def delete(self, url: str, **kwargs: Any) -> SimpleResponse:
        return self.request('DELETE', url, **kwargs)



@pytest.fixture(scope='function')
def test_client():
    engine = create_engine(
        'sqlite+pysqlite:///:memory:',
        future=True,
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    Base.metadata.create_all(bind=engine)

    with TestingSessionLocal() as session:
        bootstrap_data(session)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    client = SimpleTestClient(app)
    yield client
    app.dependency_overrides.clear()
