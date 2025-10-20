from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from slugify import slugify

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix='/api/articles', tags=['articles'])


@router.post('/', response_model=schemas.ArticleResponse)
def create_article(article_in: schemas.ArticleCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    slug = slugify(article_in.title)
    if db.query(models.Article).filter(models.Article.slug == slug).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Article slug already exists')
    article = models.Article(
        title=article_in.title,
        slug=slug,
        summary=article_in.summary,
        cover_url=article_in.cover_url,
        tags=article_in.tags,
        content=article_in.content,
        status=article_in.status,
        author_id=current_user.id
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.get('/', response_model=list[schemas.ArticleResponse])
def list_articles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    articles = (
        db.query(models.Article)
        .filter(models.Article.status == 'published')
        .order_by(models.Article.published_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return articles


@router.get('/{slug}', response_model=schemas.ArticleResponse)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(models.Article).filter(models.Article.slug == slug).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Article not found')
    return article


@router.put('/{article_id}', response_model=schemas.ArticleResponse)
def update_article(article_id: int, article_in: schemas.ArticleCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    article = db.get(models.Article, article_id)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Article not found')
    article.title = article_in.title
    article.summary = article_in.summary
    article.cover_url = article_in.cover_url
    article.tags = article_in.tags
    article.content = article_in.content
    article.status = article_in.status
    db.commit()
    db.refresh(article)
    return article


@router.delete('/{article_id}')
def delete_article(article_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    article = db.get(models.Article, article_id)
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Article not found')
    db.delete(article)
    db.commit()
    return {'status': 'deleted'}

