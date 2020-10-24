/* eslint-disable indent */
import { DynamoDB } from 'aws-sdk';

export class DynamoService {
    static instance: DynamoDB.DocumentClient;

    constructor() {
        if (!DynamoService.instance) {
            DynamoService.instance = new DynamoDB.DocumentClient({
                accessKeyId: 'fakeaccesskey', // Needed to connect to localdb
                endpoint: 'http://localhost:8002',
                region: 'localhost',
                secretAccessKey: 'fakesecretkey', // Needed to connect to localdb
            });
        }
    }

    getInstance() {
        return DynamoService.instance;
    }
}
