/**
 * Prefix validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Prefix } from '../models/index';
import { Validator, ValidatorType, ValidationError } from './index';

/**
 * Represents a prefix validator
 * @class
 * @implements {Validator}
 */
export default class PrefixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.PREFIX;
    /**
     * Validates the content of a prefix name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        const prefixes: string[] = Object.entries(Prefix).map(e => e[1].toLowerCase()); // values
        if (prefixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError(`unknown value '${value}'`, 'Prefix');
    }
}