import { ApiHandler } from '../../shared/api.interfaces';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';

const repo: ArticlesRepository = new ArticlesRepository();
const service: ArticlesService = new ArticlesService(repo);
const controller: ArticlesController = new ArticlesController(service);

export const getArticles: ApiHandler = controller.getArticles;
