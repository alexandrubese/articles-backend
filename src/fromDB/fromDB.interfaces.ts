import { DynamoDB } from 'aws-sdk';

export interface FromDBResult {
    result: DynamoDB.ScanOutput;
}
