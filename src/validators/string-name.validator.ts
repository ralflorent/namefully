/**
 * String of full name validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Validator, ValidatorType, ValidationError, ValidationRule } from './index';

/**
 * Represents a string full name validator
 * @class
 * @implements {Validator}
 */
export default class StringNameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FULL_NAME;
    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.fullname.test(value))
            throw new ValidationError(`invalid string content '${value}'`, 'Full name');
    }
}