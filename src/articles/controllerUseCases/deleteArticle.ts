import { ApiCallback, ApiContext, ApiEvent } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { handleError } from '../../shared/error-handler';
import { ResponseBuilder } from '../../shared/response-builder';
import { CommentsService } from '../../comments/comments.service';
import { TagsService } from '../../tags/tags.service';
import {  DeleteArticleResult, GetArticleResult } from '../articles.interfaces';
import { ArticlesService } from '../articles.service';

export class DeleteArticleController {
    private readonly articleService: ArticlesService;
    private readonly tagsService: TagsService;
    private readonly commentsService: CommentsService;
  
    constructor(articleService: ArticlesService, tagsService: TagsService, commentsService: CommentsService) {
      this.articleService = articleService;
      this.tagsService = tagsService;
      this.commentsService = commentsService;
    }

    public execute = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
      try {
        if (!event || !event.pathParameters || !event.pathParameters.articleId) {
          return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the article ID!', callback);
        }
        const { articleId } = event.pathParameters;
        const deletedArticle: GetArticleResult = await this.articleService.deleteArticle(articleId);
      
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
