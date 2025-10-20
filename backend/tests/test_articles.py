from datetime import date


def auth_header(client):
    payload = {
        'email': 'author@example.com',
        'password': 'password123',
        'name': 'Author',
        'birth_date': date(1992, 6, 21).isoformat(),
        'birth_time': '09:00:00',
        'birth_place': 'Guangzhou'
    }
    client.post('/api/auth/register', json=payload)
    token = client.post('/api/auth/login', json={'email': payload['email'], 'password': payload['password']}).json()['access_token']
    return {'Authorization': f'Bearer {token}'}


def test_article_crud(test_client):
    headers = auth_header(test_client)
    create_payload = {
        'title': '星光下的自愈仪式',
        'summary': '用五行与星象结合的方式疗愈自我。',
        'cover_url': 'https://example.com/cover.jpg',
        'tags': ['仪式', '疗愈'],
        'content': '## 星光指引\n这是一段示例内容。',
        'status': 'published'
    }
    create_resp = test_client.post('/api/articles/', json=create_payload, headers=headers)
    assert create_resp.status_code == 200
    data = create_resp.json()
    article_id = data['id']

    list_resp = test_client.get('/api/articles/')
    assert list_resp.status_code == 200

    detail_resp = test_client.get(f"/api/articles/{data['slug']}")
    assert detail_resp.status_code == 200

    update_resp = test_client.put(f'/api/articles/{article_id}', json={**create_payload, 'summary': 'updated'}, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()['summary'] == 'updated'

    delete_resp = test_client.delete(f'/api/articles/{article_id}', headers=headers)
    assert delete_resp.status_code == 200
