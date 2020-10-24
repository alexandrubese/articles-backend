import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
// import { ErrorCode } from '../../shared/error-codes';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetArticlesResult } from './articles.interfaces';
import { ArticlesService } from './articles.service';

export class ArticlesController {
  private readonly service: ArticlesService;

  constructor(service: ArticlesService) {
    this.service = service;
  }

  public getArticles: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      const result: GetArticlesResult = await this.service.getArticles();

      return ResponseBuilder.ok<GetArticlesResult>(result, callback);
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
