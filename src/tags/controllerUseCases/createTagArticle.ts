import { ApiCallback, ApiContext, ApiEvent } from '../../../shared/api.interfaces';
import { ErrorCode } from '../../../shared/error-codes';
import { handleError } from '../../../shared/error-handler';
import { ResponseBuilder } from '../../../shared/response-builder';
import { SubjectType } from '../../../shared/validators/error.interface';
import { validate } from '../../../shared/validators/validator';
import { GetTagArticleResult, TagArticleInputs } from '../tags.interfaces';
import { TagsService } from '../tags.service';

export class CreateTagArticleController {
    private readonly tagsService: TagsService;
  
    constructor(tagsService: TagsService) {
      this.tagsService = tagsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
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
      
        const result: GetTagArticleResult = await this.tagsService.createTagArticle(tagArticle);
      
        return ResponseBuilder.ok<GetTagArticleResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
