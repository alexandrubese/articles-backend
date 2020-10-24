import { GetArticlesResult } from './articles.interfaces';
import { ArticlesRepository } from './articles.repository';

export class ArticlesService {
  private readonly repo: ArticlesRepository;
  // eslint-disable-next-line no-undef
  constructor(repo: ArticlesRepository) {
    this.repo = repo;
  }
  public async getArticles(): Promise<GetArticlesResult> {
    try {
      const result: GetArticlesResult = await this.repo.getArticles();

      return result;
    } catch (e) {
      return e;
    }
  }
}
