import { unmarshal } from '../../shared/helper-functions';
import { Article, GetArticleResult, GetArticlesResult, RelatedArticle } from '../articles.interfaces';
import { ArticlesRepository } from '../articles.repository';

export class GetRelatedArticlesByTagsServiceUseCase {
    private readonly articleRepo: ArticlesRepository;
  
    constructor(artileRepo: ArticlesRepository) {
      this.articleRepo = artileRepo;
    }

    public execute = async (articleId: string): Promise<GetArticlesResult> => {
      try {
        const articleDetails = await this.articleRepo.getArticlePreview(articleId);
      
        if (!articleDetails || !articleDetails.item) {
          throw new Error(`Failed to get Article details for articleId: ${articleId}`);
        }
        const getTagArticlesResponse = await this.articleRepo.getRelatedArticlesByTags(articleDetails.item.tags);
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
              previewedArticles.map(previewArticle => this.articleRepo.getArticlePreview(previewArticle.articleId));
      
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
}
