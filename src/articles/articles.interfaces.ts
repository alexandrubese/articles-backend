export interface Article {
  entities: string;
  entities_sort: string;
  link_pk: string;
  title: string;
  body: string;
}

export interface GetArticlesResult {
  articles: Article[] | undefined;
}
