import { DeleteArticleResult, GetArticleResult } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class DeleteArticleServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (articleId: string): Promise<GetArticleResult> => {
      try {
        const result: GetArticleResult = await this.articleRepo.getArticle(articleId);
        if (result && result.item) {
          const deleteArticle: DeleteArticleResult = await this.articleRepo.deleteArticle(result.item.entities_sort);
          if (!deleteArticle || !deleteArticle.item) {
            throw new Error(`Article with id: ${articleId} failed to get deleted`);
          }
        }
      
        //Passing the deleted article details to the controller for cleanup (deleting tags and comments)
        return result;
      } catch (e) {
        console.log('Articles Service fn editArticle:', e);
        throw e;
      }
    }
}
