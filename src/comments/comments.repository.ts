import {  
  CommentInputs, 
  DeleteCommentResult, 
  PutCommentResult 
} from './comments.interfaces';
import { CreateCommentUseCase } from './useCases/createComment';
import { DeleteCommentUseCase } from './useCases/deleteComment';

export class CommentsRepository {
  public readonly createComment: (articleId: string, comment: CommentInputs) => Promise<PutCommentResult>;
  public readonly deleteComment: (commentId: string) => Promise<DeleteCommentResult>;

  constructor() {
    this.createComment = new CreateCommentUseCase().execute;
    this.deleteComment = new DeleteCommentUseCase().execute;
  }
}
