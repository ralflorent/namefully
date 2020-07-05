/**
 * Nama validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Nama, Namon } from '../models';
import { MIN_NUMBER_NAME_PART, MAX_NUMBER_NAME_PART } from '../core/constants';
import {
    Validator,
    ValidatorType,
    ValidationError ,
    PrefixValidator,
    FirstnameValidator,
    LastnameValidator,
    MiddlenameValidator,
    SuffixValidator
} from './index';

/**
 * Represents a `Nama` validator to help the nama parser
 * @class
 * @implements {Validator}
 */
export default class NamaValidator implements Validator<Nama> {
    readonly type: ValidatorType = ValidatorType.NAMA;
    /**
     * Validates the content of a JSON-formatted names
     * @param {string} value data to validate
     */
    validate(value: Nama): void {

        const entries = Object.entries(value);
        if (entries.length < MIN_NUMBER_NAME_PART && entries.length > MAX_NUMBER_NAME_PART)
            throw new ValidationError('incomplete JSON object', 'Nama')

        const validators = {
            [Namon.PREFIX]: new PrefixValidator(),
            [Namon.FIRST_NAME]: new FirstnameValidator(),
            [Namon.MIDDLE_NAME]: new MiddlenameValidator(),
            [Namon.LAST_NAME]: new LastnameValidator(),
            [Namon.SUFFIX]: new SuffixValidator(),
        };
        for (const entry of entries) {
            const k = entry[0] as keyof Nama;
            const v = entry[1] as string;
            validators[k].validate(v);
        }
    }
}
