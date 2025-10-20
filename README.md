# AstroWhispers

星辰秘语（AstroWhispers）是一个深度个性化的玄学探索平台，集成星座报告、生肖命理与高质量玄学内容。项目采用 React + TypeScript + Tailwind CSS 与 FastAPI + PostgreSQL 技术栈。

## 目录结构

```
astro-whispers/
  docs/             # PRD、UI 指南
  frontend/         # React + TS + Tailwind 前端工程
  backend/          # FastAPI 后端工程
  docker-compose.yml
```

## 本地开发

### 后端
```bash
cd astro-whispers/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
export DATABASE_URL=sqlite+pysqlite:///./astro.db  # Windows 可用 set
uvicorn app.main:app --reload --port 8001
```

### 前端
```bash
cd astro-whispers/frontend
npm install
npm run dev -- --port 5174
```

打开 http://localhost:5174 体验界面。

## Docker 一键启动
```bash
cd astro-whispers
docker-compose up -d --build
```

- 前端： http://localhost:4173
- 后端： http://localhost:8001
- 数据库：Postgres（映射到本机 5433）

## 测试
```bash
cd astro-whispers/backend
pytest
```

## API 概览
- `POST /api/auth/register` 注册
- `POST /api/auth/login` 登录（返回 JWT）
- `GET /api/users/me` 获取个人信息
- `POST /api/reports/astrology` 生成星座报告
- `POST /api/reports/zodiac` 生成生肖报告
- `GET /api/articles/` 列表（已发布）
- `POST /api/articles/` 创建（需 Authorization）

## Tailwind 主题要点
- 深色神秘渐变背景、玻璃风卡片、发光按钮。
- 详见 `docs/UI_GUIDE.md`。

