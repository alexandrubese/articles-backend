import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { GetTagResult, TagInputs } from '../tags.interfaces';
import { TagsService } from '../tags.service';

export class CreateTagController {
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
      
        const tag = JSON.parse(event.body) as TagInputs;
      
        const tagFields: SubjectType[] = [
          { field: 'title', type: 'string' }
        ];
      
        const errors = validate(tag, tagFields);
        if (errors.length) {
          return ResponseBuilder.badRequest(
            ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
        }
      
        const result: GetTagResult = await this.tagsService.createTag(tag);
      
        return ResponseBuilder.ok<GetTagResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
