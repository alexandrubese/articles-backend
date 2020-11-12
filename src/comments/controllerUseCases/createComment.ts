import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { CommentInputs, PutCommentResult } from '../comments.interfaces';
import { CommentsService } from '../comments.service';

export class CreateCommentController {
    private readonly commentsService: CommentsService;
  
    constructor(commentsService: CommentsService) {
      this.commentsService = commentsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        if (!event || !event.pathParameters || !event.pathParameters.articleId) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
        }
        if (!event.body) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for comment!', callback);
        }
      
        const { articleId } = event.pathParameters;
        const comment = JSON.parse(event.body) as CommentInputs;
      
        const commentFields: SubjectType[] = [
          { field: 'author', type: 'string' },
          { field: 'body', type: 'string' }
        ];
      
        const errors = validate(comment, commentFields);
        if (errors.length) {
          return ResponseBuilder.badRequest(
            ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
        }
      
        const result: PutCommentResult = await this.commentsService.putComment(articleId, comment);
      
        return ResponseBuilder.ok<PutCommentResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
