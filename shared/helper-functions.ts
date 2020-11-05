/* eslint-disable indent */
import DynamoDB = require('aws-sdk/clients/dynamodb');

const parseUnmarshal = (subject: DynamoDB.AttributeMap) => {
    return JSON.parse(JSON.stringify(DynamoDB.Converter.unmarshall(subject)));
};

export const unmarshal = (items: DynamoDB.ItemList | DynamoDB.AttributeMap | undefined) => {
    if (Array.isArray(items)) {
        if (!items) {
            return [];
        }
        return items.map(item => parseUnmarshal(item));
    }
    if (!items) {
        return {};
    }
    return parseUnmarshal(items);
};