import { GetArticlesResult } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class GetArticlesServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (): Promise<GetArticlesResult> => {
      try {
        const result: GetArticlesResult = await this.articleRepo.getArticles();
    
        return result;
      } catch (e) {
        console.log('Article service, getArticles:', e);
        throw e;
      }
    }
}
