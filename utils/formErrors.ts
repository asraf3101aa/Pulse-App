import { FieldValues, UseFormSetError, Path } from 'react-hook-form';
import { ApiError } from '../api/client';
import { ApiResponseStatus } from '../api/types';


export const handleApiFormError = <T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    defaultRootMessage: string = 'Something went wrong'
) => {
    if (!(error instanceof ApiError)) return;

    if (error.status === ApiResponseStatus.FAIL && error.errors) {
        Object.entries(error.errors).forEach(([key, messages]) => {
            const fieldErrorTypes = (messages).reduce((acc, msg, index) => {
                acc[`${key}ServerError${index}`] = msg;
                return acc;
            }, {} as Record<string, string>);

            setError(key as Path<T>, {
                type: 'server',
                message: messages[0],
                types: fieldErrorTypes
            });
        });
    } else {
        setError('root', {
            type: 'server',
            message: error.message || defaultRootMessage,
        });
    }
};
