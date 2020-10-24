import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
  ApiCallback, ApiContext, ApiEvent, ApiHandler,
} from '../../shared/api.interfaces';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';


export class FromDBController {
  public getFromDB: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback):
    Promise<void> => {
    try {
      const docClient: DynamoDB = new DynamoDB({
        accessKeyId: 'fakeaccesskey', // Needed to connect to localdb
        endpoint: 'http://localhost:8002',
        region: 'localhost',
        secretAccessKey: 'fakesecretkey', // Needed to connect to localdb
      });
      const params: DynamoDB.ScanInput = {
        TableName: 'test_table',
      };
      const result: PromiseResult<DynamoDB.ScanOutput, AWSError> = await docClient.scan(params).promise();

      return ResponseBuilder.ok<PromiseResult<DynamoDB.ScanOutput, AWSError>>(result, callback);
    } catch (e) {
      const error: ErrorResult = e;
      if (error instanceof NotFoundResult) {
        return ResponseBuilder.notFound(
          error.code,
          error.description,
          callback,
        );
      }

      if (error instanceof ForbiddenResult) {
        return ResponseBuilder.forbidden(
          error.code,
          error.description,
          callback,
        );
      }

      return ResponseBuilder.internalServerError(
        error,
        callback,
      );
    }
  }
}
