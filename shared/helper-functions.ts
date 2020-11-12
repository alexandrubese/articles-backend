/* eslint-disable indent */
import * as DynamoDB from 'aws-sdk/clients/dynamodb' ;

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

export const diffArray = (arr1: any[], arr2: any[]) => arr1.concat(arr2)
    .filter(val => !(arr1.includes(val) && arr2.includes(val)));