/**
 * First name validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Validator, ValidatorType, ValidationError, ValidationRule } from './index';

/**
 * Represents a first name validator
 * @class
 * @implements {Validator}
 */
export default class FirstnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FIRST_NAME;
    /**
     * Validates the content of a first name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.firstname.test(value))
            throw new ValidationError(`invalid string content '${value}'`, 'First name');
    }
}