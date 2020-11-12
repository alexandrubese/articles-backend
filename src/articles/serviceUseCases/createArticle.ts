import { ArticleInputs, GetArticleResult } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class CreateArticleServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (article: ArticleInputs): Promise<GetArticleResult> => {
      try {
        const result: GetArticleResult = await this.articleRepo.createArticle(article);
      
        return result;
      } catch (e) {
        console.log('Articles Service fn createArticle:', e);
        throw e;
      }
    }
}
