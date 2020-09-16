/**
 * Suffix validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Suffix } from '../models/index';
import { Validator, ValidatorType, ValidationError } from './index';

/**
 * Represents a suffix validator.
 */
export default class SuffixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.SUFFIX;
    /**
     * Validates the content of a suffix name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        const suffixes: string[] = Object.entries(Suffix).map(e => e[1].toLowerCase()); // values
        if (suffixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError(`unknown value '${value}'`, 'Suffix');
    }
}