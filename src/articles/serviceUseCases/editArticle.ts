import { EditArticleInputs, GetArticleResult } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class EditArticleServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (editArticleInputs: EditArticleInputs): Promise<GetArticleResult> => {
      try {
        const result: GetArticleResult = await this.articleRepo.editArticle(editArticleInputs);
      
        return result;
      } catch (e) {
        console.log('Articles Service fn editArticle:', e);
        throw e;
      }
    }
}
