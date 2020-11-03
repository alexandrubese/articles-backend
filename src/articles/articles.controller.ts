import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { TagArticleInputs } from '../tags/tags.interfaces';
import { TagsService } from '../tags/tags.service';
import { ArticleInputs, GetArticleResult, GetArticlesResult } from './articles.interfaces';
import { ArticlesService } from './articles.service';

export class ArticlesController {
  private readonly service: ArticlesService;
  private readonly tagsService: TagsService;

  constructor(service: ArticlesService, tagsService: TagsService) {
    this.service = service;
    this.tagsService = tagsService;
  }

  public getArticles: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      const result: GetArticlesResult = await this.service.getArticles();

      return ResponseBuilder.ok<GetArticlesResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
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
      return handleError(e, callback);
    }
  }

  public createArticle: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for createArticle!', callback);
      }

      const articleFields: SubjectType[] = [
        { field: 'title', type: 'string' },
        { field: 'body', type: 'string' },
        //   { field: 'tags', type: 'object' },
      ];

      const article = JSON.parse(event.body) as ArticleInputs;

      const errors = validate(article, articleFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetArticleResult = await this.service.createArticle(article);
      /*
      // Creating tagArticle relation
      if (result.item && result.item.tags) {
        const article = result.item;
        const createdArticleTags = article.tags;

        const createTagArticlePromises = createdArticleTags.map(tag => {
          const tagArticle: TagArticleInputs = {
            article_id: article.article_link_pk,
            article_date: article.entities_sort,
            tag_id: tag
          };
          return this.tagsService.createTagArticle(tagArticle);
        });

        const createTagArticleResult = await Promise.all(createTagArticlePromises);
        if (!createTagArticleResult) {
          throw new Error(`Failed to create tagArticle relations for Article: ${article.article_link_pk}`);
        }
      }
*/
      return ResponseBuilder.ok<GetArticleResult>(result, callback);

    } catch (e) {
      return handleError(e, callback);
    }
  }

  public getRelatedArticlesByTags: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for getArticlesByTag!', callback);
      }

      const payload = JSON.parse(event.body);
      if (!payload.tags) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Supply {tags :[]} for getArticlesByTag!', callback);
      }
      if (!payload.articleId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Supply {articleId} for getArticlesByTag!', callback);
      }

      const result: GetArticlesResult = await this.service.getRelatedArticlesByTags(payload.articleId, payload.tags);

      return ResponseBuilder.ok<GetArticlesResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }

}
