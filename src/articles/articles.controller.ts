import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetArticleResult, GetArticlesResult } from './articles.interfaces';
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

  public getArticle: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.articleId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
      }
      const { articleId } = event.pathParameters;

      const result: GetArticleResult = await this.service.getArticle(articleId);

      return ResponseBuilder.ok<GetArticleResult>(result, callback);

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

  public getArticlesByTag: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.tagId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the tag ID!', callback);
      }
      const { tagId } = event.pathParameters;
      const result: GetArticlesResult = await this.service.getArticlesByTag(tagId);

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
