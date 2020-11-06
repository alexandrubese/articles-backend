import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler
} from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { DeleteTagResult, GetTagArticleResult, GetTagResult, TagArticleInputs, TagInputs } from './tags.interfaces';
import { TagsService } from './tags.service';

export class TagsController {
  private readonly service: TagsService;

  constructor(service: TagsService) {
    this.service = service;
  }

  public createTag: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for comment!', callback);
      }

      const tag = JSON.parse(event.body) as TagInputs;

      const tagFields: SubjectType[] = [
        { field: 'title', type: 'string' }
      ];

      const errors = validate(tag, tagFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetTagResult = await this.service.createTag(tag);

      return ResponseBuilder.ok<GetTagResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }

  public editTag: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.tagId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the tag ID!', callback);
      }

      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for editTag action!', callback);
      }

      const { tagId } = event.pathParameters;
      const tag = JSON.parse(event.body) as TagInputs;

      const tagFields: SubjectType[] = [
        { field: 'title', type: 'string' }
      ];

      const errors = validate(tag, tagFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetTagResult = await this.service.editTag(tagId, tag);

      return ResponseBuilder.ok<GetTagResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }

  public createTagArticle: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event.body) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for comment!', callback);
      }

      const tagArticle = JSON.parse(event.body) as TagArticleInputs;

      const tagArticleFields: SubjectType[] = [
        { field: 'article_id', type: 'string' },
        { field: 'tag_id', type: 'string' },
        { field: 'article_date', type: 'string' }
      ];

      const errors = validate(tagArticle, tagArticleFields);
      if (errors.length) {
        return ResponseBuilder.badRequest(
          ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
      }

      const result: GetTagArticleResult = await this.service.createTagArticle(tagArticle);

      return ResponseBuilder.ok<GetTagArticleResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }

  public deleteTag: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      if (!event || !event.pathParameters || !event.pathParameters.tagId) {
        return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the tag ID!', callback);
      }

      const { tagId } = event.pathParameters;

      const result: DeleteTagResult = await this.service.deleteTag(tagId);

      return ResponseBuilder.ok<DeleteTagResult>(result, callback);
    } catch (e) {
      return handleError(e, callback);
    }
  }
}
