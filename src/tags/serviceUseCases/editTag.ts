import { GetTagResult, TagInputs } from '../tags.interfaces';
import { TagsRepository } from '../tags.repository';

export class EditTagServiceUseCase {
    private readonly tagsRepo: TagsRepository;
  
    constructor(tagsRepo: TagsRepository) {
      this.tagsRepo = tagsRepo;
    }

    public execute = async (tagId: string, tag: TagInputs): Promise<GetTagResult> => {
      try {
        const result: GetTagResult = await this.tagsRepo.editTag(tagId, tag);
  
        return result;
      } catch (e) {
        console.log('Tags Service fn editTag:', e);
        throw e;
      }
    }
}
