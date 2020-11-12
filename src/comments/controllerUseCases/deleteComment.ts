import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import {  DeleteCommentResult } from '../comments.interfaces';
import { CommentsService } from '../comments.service';

export class DeleteCommentController {
    private readonly commentsService: CommentsService;
  
    constructor(commentsService: CommentsService) {
      this.commentsService = commentsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        if (!event || !event.pathParameters || !event.pathParameters.commentId) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the comment ID!', callback);
        }
      
        const { commentId } = event.pathParameters;
      
        const result: DeleteCommentResult = await this.commentsService.deleteComment(commentId);
      
        return ResponseBuilder.ok<DeleteCommentResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
