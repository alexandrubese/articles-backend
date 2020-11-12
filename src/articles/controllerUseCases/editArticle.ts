import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { diffArray } from '../../shared/helper-functions';
import { ResponseBuilder } from '../../shared/response-builder';
import { SubjectType } from '../../shared/validators/error.interface';
import { validate } from '../../shared/validators/validator';
import { TagsService } from '../../tags/tags.service';
import { EditArticleInputs, GetArticleResult } from '../articles.interfaces';
import { ArticlesService } from '../articles.service';

export class EditArticleController {
    private readonly articleService: ArticlesService;
    private readonly tagsService: TagsService;
  
    constructor(articleService: ArticlesService, tagsService: TagsService) {
      this.articleService = articleService;
      this.tagsService = tagsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
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
      
        const result: GetArticleResult = await this.articleService.editArticle(editArticleInputs);
      
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
      
        this.tagsService.updateArticleRelations(
          articleId, 
          editArticleInputs.articleDate, 
          tagsToBeAdded, 
          tagsToBeDeleted
        );
      
        return ResponseBuilder.ok<GetArticleResult>(result, callback);
      
      } catch (e) {
        return handleError(e, callback);
      }
    }
}
