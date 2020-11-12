import { ApiCallback, ApiContext, ApiEvent } from '../../../shared/api.interfaces';
import { ErrorCode } from '../../../shared/error-codes';
import { handleError } from '../../../shared/error-handler';
import { ResponseBuilder } from '../../../shared/response-builder';
import { SubjectType } from '../../../shared/validators/error.interface';
import { validate } from '../../../shared/validators/validator';
import { GetTagResult, TagInputs } from '../tags.interfaces';
import { TagsService } from '../tags.service';

export class EditTagController {
    private readonly tagsService: TagsService;
  
    constructor(tagsService: TagsService) {
      this.tagsService = tagsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
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
      
        const result: GetTagResult = await this.tagsService.editTag(tagId, tag);
      
        return ResponseBuilder.ok<GetTagResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
