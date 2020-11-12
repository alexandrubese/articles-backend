import { DeleteTagResult } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class DeleteTagRelationServiceUseCase {
    private readonly tagsRepo: TagsRepository;
  
    constructor(tagsRepo: TagsRepository) {
      this.tagsRepo = tagsRepo;
    }

    public execute = async (tagId: string, articleDate: string): Promise<DeleteTagResult> => {
      try {
        const result: DeleteTagResult = await this.tagsRepo.deleteTagRelation(tagId, articleDate);
      
        return result;
      } catch (e) {
        console.log('Tags Service fn deleteTagRelation:', e);
        throw e;
      }
    }
}
