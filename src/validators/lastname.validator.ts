/**
 * Last name validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Validator, ValidatorType, ValidationError, ValidationRule } from './index';

/**
 * Represents a last name validator.
 */
export default class LastnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.LAST_NAME;
    /**
     * Validates the content of a last name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.lastname.test(value))
            throw new ValidationError(`invalid string content '${value}'`, 'Last name');
    }
}
