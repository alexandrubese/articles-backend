import { ApiCallback, ApiContext, ApiEvent } from '../../../shared/api.interfaces';
import { ErrorCode } from '../../../shared/error-codes';
import { handleError } from '../../../shared/error-handler';
import { ResponseBuilder } from '../../../shared/response-builder';
import { DeleteTagResult } from '../tags.interfaces';
import { TagsService } from '../tags.service';

export class DeleteTagController {
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
      
        const { tagId } = event.pathParameters;
      
        const result: DeleteTagResult = await this.tagsService.deleteTag(tagId);
      
        return ResponseBuilder.ok<DeleteTagResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
