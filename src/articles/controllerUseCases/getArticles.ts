import { ApiCallback, ApiContext, ApiEvent } from '../../../shared/api.interfaces';
import { handleError } from '../../../shared/error-handler';
import { ResponseBuilder } from '../../../shared/response-builder';
import { GetArticlesResult } from '../articles.interfaces';
import { ArticlesService } from '../articles.service';

export class GetArticlesController {
    private readonly articleService: ArticlesService;
  
    constructor(articleService: ArticlesService) {
      this.articleService = articleService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        const result: GetArticlesResult = await this.articleService.getArticles();
    
        return ResponseBuilder.ok<GetArticlesResult>(result, callback);
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
