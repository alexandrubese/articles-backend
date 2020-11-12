import { ApiCallback, ApiContext, ApiEvent } from '../../../shared/api.interfaces';
import { ErrorCode } from '../../../shared/error-codes';
import { handleError } from '../../../shared/error-handler';
import { ResponseBuilder } from '../../../shared/response-builder';
import { GetArticlesResult } from '../articles.interfaces';
import { ArticlesService } from '../articles.service';

export class GetRelatedArticlesByTagsController {
    private readonly articleService: ArticlesService;
  
    constructor(articleService: ArticlesService) {
      this.articleService = articleService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        if (!event || !event.pathParameters || !event.pathParameters.articleId) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
        }
        const { articleId } = event.pathParameters;
      
        const result: GetArticlesResult = await this.articleService.getRelatedArticlesByTags(articleId);
      
        return ResponseBuilder.ok<GetArticlesResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
