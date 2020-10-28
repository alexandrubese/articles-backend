import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { CommentInputs, PutCommentResult } from './comments.interfaces';
import { CommentsService } from './comments.service';

export class CommentsController {
  private readonly service: CommentsService;

  constructor(service: CommentsService) {
    this.service = service;
  }

  public putComments: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
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

      if (!comment.author || !comment.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Incomplete comment information!', callback);
      }

      const result: PutCommentResult = await this.service.putComment(articleId, comment);

      return ResponseBuilder.ok<PutCommentResult>(result, callback);
    } catch (e) {
      const error: ErrorResult = e;
      if (error instanceof NotFoundResult) {
        return ResponseBuilder.notFound(error.code, error.description, callback);
      }

      if (error instanceof ForbiddenResult) {
        return ResponseBuilder.forbidden(error.code, error.description, callback);
      }

      return ResponseBuilder.internalServerError(error, callback);
    }
  }
}
