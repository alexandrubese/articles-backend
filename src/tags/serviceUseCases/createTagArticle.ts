import { GetTagArticleResult, TagArticleInputs } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class CreateTagArticleServiceUseCase {
    private readonly tagsRepo: TagsRepository;
  
    constructor(tagsRepo: TagsRepository) {
      this.tagsRepo = tagsRepo;
    }

    public execute = async (tagArticle: TagArticleInputs): Promise<GetTagArticleResult> => {
      try {
        const result: GetTagArticleResult = await this.tagsRepo.createTagArticle(tagArticle);
      
        return result;
      } catch (e) {
        console.log('Tags Service fn createTagArticle:', e);
        throw e;
      }
    }
}
