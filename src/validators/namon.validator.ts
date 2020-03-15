/**
 * Namon validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Validator, ValidatorType, ValidationError, ValidationRule } from './index';

/**
 * Represents a namon validator to help to parse single pieces of string
 * @class
 * @implements {Validator}
 */
export default class NamonValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.NAMON;
    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.namon.test(value))
            throw new ValidationError(`invalid string content '${value}'`, 'Name');
    }
}