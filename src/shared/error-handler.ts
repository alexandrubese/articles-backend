/* eslint-disable indent */
import { ApiCallback } from './api.interfaces';
import { ForbiddenResult, NotFoundResult } from './errors';
import { ResponseBuilder } from './response-builder';

export const handleError = (e: Error, callback: ApiCallback) => {
    const error = e;
    if (error instanceof NotFoundResult) {
        return ResponseBuilder.notFound(error.code, error.description, callback);
    }

    if (error instanceof ForbiddenResult) {
        return ResponseBuilder.forbidden(error.code, error.description, callback);
    }

    return ResponseBuilder.internalServerError(error, callback);
};