export interface CommentInputs {
  author: string;
  body: string;
}

export interface Comment extends CommentInputs {
  article_link_sk: string;
  article_link_pk: string;
  entities_sort: string;
  entities: string;
}


export interface GetCommentsResult {
  items: Comment[] | undefined;
}

export interface PutCommentResult {
  item: Comment | undefined;
}