import { GetArticleResult } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class GetArticleServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (articleId: string): Promise<GetArticleResult> => {
      try {
        const result: GetArticleResult = await this.articleRepo.getArticle(articleId);
      
        return result;
      } catch (e) {
        console.log('Article service, getArticle:', e);
        throw e;
      }
    }
}
