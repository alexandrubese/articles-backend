import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { TagArticleInputs } from '../../tags/tags.interfaces';
import { TagsService } from '../../tags/tags.service';
import { ArticleInputs, GetArticleResult } from '../articles.interfaces';
import { ArticlesService } from '../articles.service';

export class CreateArticleController {
    private readonly articleService: ArticlesService;
    private readonly tagsService: TagsService;
  
    constructor(articleService: ArticlesService, tagsService: TagsService) {
      this.articleService = articleService;
      this.tagsService = tagsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        if (!event.body) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'No body supplied for createArticle!', callback);
        }
      
        const articleFields: SubjectType[] = [
          { field: 'title', type: 'string' },
          { field: 'body', type: 'string' },
          { field: 'tags', type: 'array' }
        ];
      
        const article = JSON.parse(event.body) as ArticleInputs;
      
        const errors = validate(article, articleFields);
        if (errors.length) {
          return ResponseBuilder.badRequest(
            ErrorCode.InvalidInput, 'The object supplied has some errors', callback, errors);
        }
      
        const result: GetArticleResult = await this.articleService.createArticle(article);
      
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
}
