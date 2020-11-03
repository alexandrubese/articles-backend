export interface TagInputs {
  title: string;
}

export interface Tag extends TagInputs {
  entities_sort: string;
  entities: string;
}

export interface GetTagsResult {
  items: Tag[] | undefined;
}

export interface GetTagResult {
  item: Tag | undefined;
}

export interface TagArticleInputs {
  tag_id: string;
  article_id: string;
  article_date: string;
}

export interface TagArticle {
  entities_sort: string;
  entities: string;
  article_link_pk: string;
  article_link_sk: string;
}

export interface GetTagArticleResult {
  item: TagArticle | undefined;
}
