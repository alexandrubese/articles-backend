import { ApiHandler } from '../../shared/api.interfaces';
import { FromDBController } from './fromDB.controller';

const controller: FromDBController = new FromDBController();

export const getCity: ApiHandler = controller.getFromDB;
