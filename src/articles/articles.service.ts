import { unmarshal } from '../../shared/helper-functions';
import { Comment } from '../comments/comments.interfaces';
import {
  Article,
  ArticleInputs,
  DeleteArticleResult,
  EditArticleInputs,
  GetArticleResult,
  GetArticlesResult,
  RelatedArticle
} from './articles.interfaces';
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
      const articlesResponse = await this.repo.getArticle(articleId);

      const articleItems = unmarshal(articlesResponse.Items) as any[];
      const articleDetails = articleItems.find((item: Article) => item.article_link_sk === 'D');

      if (!articleDetails) {
        return { item: undefined };
      }

      const articleComments = articleItems.filter((item: Comment) =>
        item.article_link_sk !== 'D' && item.article_link_sk !== '#') as Comment[];

      const article: Article = {
        ...articleDetails,
        comments: articleComments
      };

      const result: GetArticleResult = { item: article };

      return result;
    } catch (e) {
      console.log('Article service, getArticle:', e);
      throw e;
    }
  }

  public async getRelatedArticlesByTags(articleId: string): Promise<GetArticlesResult> {
    try {
      const articleDetails = await this.repo.getArticlePreview(articleId);

      if (!articleDetails || !articleDetails.item) {
        throw new Error(`Failed to get Article details for articleId: ${articleId}`);
      }
      const getTagArticlesResponse = await this.repo.getRelatedArticlesByTags(articleDetails.item.tags);
      const relatedArticles: RelatedArticle[] = [];

      // Going through all tags(and the articles assigned to them), counting each article id ocurence in the tags
      // We want to return the related articles as the articles most occured in the tags of the current article 
      getTagArticlesResponse.forEach(response => {
        const tagArticles = unmarshal(response.Items) as Article[];

        if (tagArticles) {
          tagArticles.forEach(article => {
            const relatedArticle = relatedArticles.find(el => el.articleId === article.article_link_pk);

            if (relatedArticle) {
              relatedArticle.count += 1;
            } else {
              // Do not add the article for which we get the related articles
              if (article.article_link_pk !== articleId) {
                const newRelatedArticle: RelatedArticle = {
                  articleId: article.article_link_pk,
                  count: 1,
                  date: article.entities_sort
                };

                relatedArticles.push(newRelatedArticle);
              }
            }
          });
        }
      });

      //Sorting by count, then by date
      relatedArticles.sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        } else if (a.count < b.count) {
          return 1;
        }
        const date1 = new Date(a.date);
        const date2 = new Date(a.date);

        if (date1.getTime() > date2.getTime()) {
          return -1;
        } else if (date1.getTime() < date2.getTime()) {
          return 1;
        }
        return 0;
      });

      const previewedArticles: RelatedArticle[] = relatedArticles.slice(0, 3); //getting only the first 3 elements 
      const articlePreviewPromises: Promise<GetArticleResult>[] =
        previewedArticles.map(previewArticle => this.repo.getArticlePreview(previewArticle.articleId));

      const articles: GetArticlesResult = { items: [] };
      if (!articlePreviewPromises) {
        return articles;
      }
      const articlePreviews = await Promise.all(articlePreviewPromises);
      if (!articlePreviews) {
        return articles;
      }

      articlePreviews.forEach(articlePreview => {
        if (articlePreview.item) {
          articles.items?.push(articlePreview.item);
        }
      });

      const result: GetArticlesResult = articles;

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

  public async editArticle(editArticleInputs: EditArticleInputs): Promise<GetArticleResult> {
    try {
      const result: GetArticleResult = await this.repo.editArticle(editArticleInputs);

      return result;
    } catch (e) {
      console.log('Articles Service fn editArticle:', e);
      throw e;
    }
  }

  public async deleteArticle(articleId: string): Promise<GetArticleResult> {
    try {
      const result: GetArticleResult = await this.repo.getArticle(articleId);
      if (result && result.item) {
        const deleteArticle: DeleteArticleResult = await this.repo.deleteArticle(result.item.entities_sort);
        if (!deleteArticle || !deleteArticle.item) {
          throw new Error(`Article with id: ${articleId} failed to get deleted`);
        }
      }

      //Passing the deleted article details to the controller for cleanup (deleting tags and comments)
      return result;
    } catch (e) {
      console.log('Articles Service fn editArticle:', e);
      throw e;
    }
  }


}
