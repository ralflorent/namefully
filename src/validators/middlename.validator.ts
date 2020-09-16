/**
 * Middle name validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Validator, ValidatorType, ValidationError, ValidationRule, NamonValidator } from './index';

/**
 * Represents a middle name validator.
 */
export default class MiddlenameValidator implements Validator<string | string[]> {
    readonly type: ValidatorType = ValidatorType.MIDDLE_NAME;
    /**
     * Validates the content of a list of middle names
     * @param {string | string[]} values to validate
     */
    validate(values: string | string[]): void {
        if (typeof values === 'string') {
            if (!ValidationRule.middlename.test(values))
                throw new ValidationError(`invalid string content '${values}'`, 'Middle name');
        } else if (values instanceof Array) {
            const namonValidator = new NamonValidator();
            (values as string[]).forEach(v => namonValidator.validate(v));
        } else {
            throw new Error('Expecting string or Array<string> type');
        }
    }
}