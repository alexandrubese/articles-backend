import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { diffArray } from '../../shared/helper-functions';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { CommentsService } from '../comments/comments.service';
import { TagArticleInputs } from '../tags/tags.interfaces';
import { TagsService } from '../tags/tags.service';
import {
  ArticleInputs,
  DeleteArticleResult,
  EditArticleInputs,
  GetArticleResult,
  GetArticlesResult
} from './articles.interfaces';
import { ArticlesService } from './articles.service';

export class ArticlesController {
  private readonly service: ArticlesService;
  private readonly tagsService: TagsService;
  private readonly commentsService: CommentsService;

  constructor(service: ArticlesService, tagsService: TagsService, commentsService: CommentsService) {
    this.service = service;
    this.tagsService = tagsService;
    this.commentsService = commentsService;
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
        { field: 'tags', type: 'array' },
      ];

      const article = JSON.parse(event.body) as ArticleInputs;

      const errors = validate(article, articleFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetArticleResult = await this.service.createArticle(article);

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

      return ResponseBuilder.ok<GetArticleResult>(result, callback);

    } catch (e) {
      return handleError(e, callback);
    }
  }

  public getRelatedArticlesByTags: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.articleId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
      }
      const { articleId } = event.pathParameters;

      const result: GetArticlesResult = await this.service.getRelatedArticlesByTags(articleId);

      return ResponseBuilder.ok<GetArticlesResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }

  public editArticle: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.articleId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
      }

      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for editArticle!', callback);
      }
      const { articleId } = event.pathParameters;

      const articleFields: SubjectType[] = [
        { field: 'title', type: 'string' },
        { field: 'body', type: 'string' },
        { field: 'tags', type: 'array' },
        { field: 'articleDate', type: 'string' }
      ];

      const editArticleInputs = JSON.parse(event.body) as EditArticleInputs;

      const errors = validate(editArticleInputs, articleFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetArticleResult = await this.service.editArticle(editArticleInputs);

      let tagsToBeAdded: string[] = [];
      const tagsToBeDeleted: string[] = [];

      if (result && result.item) {
        const newTags = editArticleInputs.tags;

        // If the article didn't had any tags object before update (deleted before) all tags need to be added
        // check articleRepo.editArticle function
        if (!result.item.tags) {
          tagsToBeAdded = [...newTags];
        } else {
          const oldTags = result.item.tags;
          const tagsDifference = diffArray(newTags, oldTags);

          if (tagsDifference.length) {
            tagsDifference.forEach(tag => {
              if (newTags.includes(tag)) {
                tagsToBeAdded.push(tag);
              } else {
                tagsToBeDeleted.push(tag);
              }
            });
          } else {
            console.log('No tag relations need to be changed!');
          }
        }
      }

      this.tagsService.updateArticleRelations(articleId, editArticleInputs.articleDate, tagsToBeAdded, tagsToBeDeleted);

      return ResponseBuilder.ok<GetArticleResult>(result, callback);

    } catch (e) {
      return handleError(e, callback);
    }
  }

  public deleteArticle: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.articleId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
      }
      const { articleId } = event.pathParameters;
      const deletedArticle: GetArticleResult = await this.service.deleteArticle(articleId);

      if (!deletedArticle || !deletedArticle.item) {
        throw new Error(`Article with id:${articleId} did not get deleted`);
      }
      // Removing TagRelations for the deleted article
      const articleDate = deletedArticle.item.entities_sort;
      const articleTags = deletedArticle.item.tags;
      const articleComments = deletedArticle.item.comments;
      await this.tagsService.updateArticleRelations(articleId, articleDate, [], articleTags);

      const deleteArticleCommentsPromises = articleComments.map(comment => {
        const commentId = comment.entities_sort;
        return this.commentsService.deleteComment(commentId);
      });

      // Removing Comments for the deleted article
      // Used Promise.all to delete each comment individually instead of BatchWrite 
      // Since we might have more than 25 comments for an article
      // And we want to avoid the BatchWrite limitation
      await Promise.all(deleteArticleCommentsPromises);

      const result: DeleteArticleResult = { item: `Article ${articleId} deleted successfully !` };
      return ResponseBuilder.ok<DeleteArticleResult>(result, callback);

    } catch (e) {
      return handleError(e, callback);
    }
  }

}
