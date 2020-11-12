import { CommentInputs, DeleteCommentResult, PutCommentResult } from './comments.interfaces';
import { CommentsRepository } from './comments.repository';
import { CreateCommentServiceUseCase } from './serviceUseCases/createComment';
import { DeleteCommentServiceUseCase } from './serviceUseCases/deleteComment';

export class CommentsService {
  private readonly repo: CommentsRepository;
  
  public readonly putComment: (articleId: string, comment: CommentInputs) => Promise<PutCommentResult>;
  public readonly deleteComment: (commentId: string) => Promise<DeleteCommentResult>;

  constructor(repo: CommentsRepository) {
    this.repo = repo;

    this.putComment = new CreateCommentServiceUseCase(this.repo).execute;
    this.deleteComment = new DeleteCommentServiceUseCase(this.repo).execute;
  }
}
