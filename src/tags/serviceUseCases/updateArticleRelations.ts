import { DeleteTagResult } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class UpdateArticleRelationServiceUseCase {
    private readonly tagsRepo: TagsRepository;
  
    constructor(tagsRepo: TagsRepository) {
      this.tagsRepo = tagsRepo;
    }

    public execute = async (
      articleId: string,
      articleDate: string,
      tagsToAdd: string[],
      tagsToRemove: string[]
    ): Promise<DeleteTagResult> => {
      try {
        const result: DeleteTagResult = await this.tagsRepo.updateArticleRelations(
          articleId,
          articleDate,
          tagsToAdd,
          tagsToRemove
        );
  
        return result;
      } catch (e) {
        console.log('Tags Service fn deleteTagRelation:', e);
        throw e;
      }
    }
}
