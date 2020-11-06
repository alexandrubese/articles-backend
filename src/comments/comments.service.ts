import { CommentInputs, DeleteCommentResult, PutCommentResult } from './comments.interfaces';
import { CommentsRepository } from './comments.repository';

export class CommentsService {
  private readonly repo: CommentsRepository;
  // eslint-disable-next-line no-undef
  constructor(repo: CommentsRepository) {
    this.repo = repo;
  }
  public async putComment(articleId: string, comment: CommentInputs): Promise<PutCommentResult> {
    try {
      const result: PutCommentResult = await this.repo.putComment(articleId, comment);

      return result;
    } catch (e) {
      console.log('Comments Service fn putComment:', e);
      throw e;
    }
  }

  public async deleteComment(commentId: string): Promise<DeleteCommentResult> {
    try {
      const result: DeleteCommentResult = await this.repo.deleteComment(commentId);

      return result;
    } catch (e) {
      console.log('Comments Service fn putComment:', e);
      throw e;
    }
  }
}
