import { GetTagResult, TagInputs } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class CreateTagServiceUseCase {
    private readonly tagsRepo: TagsRepository;
  
    constructor(tagsRepo: TagsRepository) {
      this.tagsRepo = tagsRepo;
    }

    public execute = async (tag: TagInputs): Promise<GetTagResult> => {
      try {
        const result: GetTagResult = await this.tagsRepo.createTag(tag);
      
        return result;
      } catch (e) {
        console.log('Tags Service fn createTag:', e);
        throw e;
      }
    }
}
