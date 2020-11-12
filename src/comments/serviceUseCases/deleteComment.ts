import { DeleteCommentResult } from '../comments.interfaces';
import { CommentsRepository } from '../comments.repository';

export class DeleteCommentServiceUseCase {
    private readonly commentRepo: CommentsRepository;
  
    constructor(commentRepo: CommentsRepository) {
      this.commentRepo = commentRepo;
    }

    public execute = async (commentId: string): Promise<DeleteCommentResult> => {
      try {
        const result: DeleteCommentResult = await this.commentRepo.deleteComment(commentId);
      
        return result;
      } catch (e) {
        console.log('Comments Service fn putComment:', e);
        throw e;
      }
    }
}
