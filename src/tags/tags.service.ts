import { GetTagArticleResult, GetTagResult, TagArticleInputs, TagInputs } from './tags.interfaces';
import { TagsRepository } from './tags.repository';

export class TagsService {
  private readonly repo: TagsRepository;
  // eslint-disable-next-line no-undef
  constructor(repo: TagsRepository) {
    this.repo = repo;
  }
  public async createTag(tag: TagInputs): Promise<GetTagResult> {
    try {
      const result: GetTagResult = await this.repo.createTag(tag);

      return result;
    } catch (e) {
      console.log('Comments Service fn putComment:', e);
      throw e;
    }
  }

  public async createTagArticle(tagArticle: TagArticleInputs): Promise<GetTagArticleResult> {
    try {
      const result: GetTagArticleResult = await this.repo.createTagArticle(tagArticle);

      return result;
    } catch (e) {
      console.log('Comments Service fn putComment:', e);
      throw e;
    }
  }
}
