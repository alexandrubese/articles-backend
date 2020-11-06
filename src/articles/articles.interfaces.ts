import { Comment } from '../comments/comments.interfaces';

export interface ArticleInputs {
  title: string;
  body: string;
  tags: string[];
}

export interface EditArticleInputs extends ArticleInputs {
  articleDate: string;
}

export interface ArticleDetails extends ArticleInputs {
  entities: string;
  entities_sort: string;
  article_link_sk: string;
  article_link_pk: string;
}

export interface Article extends ArticleDetails {
  comments: Comment[];
}

export interface RelatedArticle extends RelatedArticleData {
  articleId: string;
}

export interface RelatedArticleData {
  count: number;
  date: string;
}

export interface GetArticlesResult {
  items: Article[] | undefined;
}

export interface GetArticleResult {
  item: Article | undefined;
}

export interface DeleteArticleResult {
  item: string | undefined;
}