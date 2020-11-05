/* eslint-disable indent */
import DynamoDB = require('aws-sdk/clients/dynamodb');

export const unmarshal = (items: DynamoDB.ItemList | DynamoDB.AttributeMap | undefined) => {
    if (!items) {
        return [];
    }
    if (Array.isArray(items)) {
        return items.map(item => JSON.parse(JSON.stringify(DynamoDB.Converter.unmarshall(item))));
    }
    return JSON.parse(JSON.stringify(DynamoDB.Converter.unmarshall(items)));

};