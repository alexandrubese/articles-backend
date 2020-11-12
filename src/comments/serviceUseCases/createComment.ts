import { CommentInputs, PutCommentResult } from '../comments.interfaces';
import { CommentsRepository } from '../comments.repository';

export class CreateCommentServiceUseCase {
    private readonly commentRepo: CommentsRepository;
  
    constructor(commentRepo: CommentsRepository) {
      this.commentRepo = commentRepo;
    }

    public execute = async (articleId: string, comment: CommentInputs): Promise<PutCommentResult> => {
      try {
        const result: PutCommentResult = await this.commentRepo.createComment(articleId, comment);
      
        return result;
      } catch (e) {
        console.log('Comments Service fn putComment:', e);
        throw e;
      }
    }
}
