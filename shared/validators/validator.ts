/* eslint-disable indent */
import { CustomValidationError, SubjectType } from './error.interface';

function validateField(article: object, field: string, validationType: string): string | undefined {
    const msgTemplate = `${field} must be declared and of type ${validationType}`;
    if (!(article && article[field])) {
        return msgTemplate;
    }

    switch (validationType) {
        case 'string':
        case 'number':
            if (typeof (article[field]) != validationType) {
                return msgTemplate;
            }
            break;
        case 'array':
            if (!Array.isArray(article[field])) {
                return msgTemplate;
            }
            return '';
        default:
            throw new Error('Unknown validation type.');
    }
    return undefined;
}

export const validate = (subject: object, fields: SubjectType[]): CustomValidationError[] => {
    const validationErrors: CustomValidationError[] = [];

    fields.forEach(item => {
        const msg = validateField(subject, item.field, item.type);
        if (msg)
            validationErrors.push({ msg });
    });

    return validationErrors;
};