/* eslint-disable indent */
import DynamoDB = require('aws-sdk/clients/dynamodb');

export const unmarshal = (items: DynamoDB.ItemList | undefined) => {
    if (!items) {
        return [];
    }
    return items.map(item => DynamoDB.Converter.unmarshall(item));
};