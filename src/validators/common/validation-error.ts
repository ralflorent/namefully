/**
 * Validation error
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Represents a validation error
 * @class
 * @extends Error
 */
export class ValidationError extends Error {
    /**
     * Create a validation `Error`
     * @param message of error to display
     * @param type categorizes the error
     */
    constructor(message?: string, type?: string) {
        super(`${ type ? type + ' :: ' + message : message }`);
        this.name = 'ValidationError';
    }
}