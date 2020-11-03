import { ArticleInputs, GetArticleResult, GetArticlesResult } from './articles.interfaces';
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
      console.log('Article service, getArticles:', e);
      throw e;
    }
  }

  public async getArticle(articleId: string): Promise<GetArticleResult> {
    try {
      const result: GetArticleResult = await this.repo.getArticle(articleId);

      return result;
    } catch (e) {
      console.log('Article service, getArticle:', e);
      throw e;
    }
  }

  public async getRelatedArticlesByTags(articleId: string, tags: string[]): Promise<GetArticlesResult> {
    try {
      const result: GetArticlesResult = await this.repo.getRelatedArticlesByTags(articleId, tags);

      return result;
    } catch (e) {
      console.log('Article service, getRelatedArticlesByTags:', e);
      throw e;
    }
  }

  public async createArticle(article: ArticleInputs): Promise<GetArticleResult> {
    try {
      const result: GetArticleResult = await this.repo.createArticle(article);

      return result;
    } catch (e) {
      console.log('Articles Service fn createArticle:', e);
      throw e;
    }
  }
}
