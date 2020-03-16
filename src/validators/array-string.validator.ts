/**
 * Array of string validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import {
    Validator, ValidatorType, ValidationError , PrefixValidator, FirstnameValidator,
    LastnameValidator, MiddlenameValidator, SuffixValidator
} from './index';
import { NameIndex } from '@models/index';

/**
 * Represents a validator to help the array string parser
 * @class
 * @classdesc
 * This validator validates an array of string name following a specific order
 * based on the count of elements. It is expected that the array has to be between
 * two and five elements. Also, the order of appearance set in the configuration
 * influences how this validation is carried out.
 *
 * Ordered by first name, the validator validates the following:
 * - 2 elements: firstname lastname
 * - 3 elements: firstname middlename lastname
 * - 4 elements: prefix firstname middlename lastname
 * - 5 elements: prefix firstname middlename lastname suffix
 *
 * Ordered by last name, the validator validates the following:
 * - 2 elements: lastname firstname
 * - 3 elements: lastname firstname middlename
 * - 4 elements: prefix lastname firstname middlename
 * - 5 elements: prefix lastname firstname middlename suffix
 */
export default class ArrayStringValidator implements Validator<string[]> {
    readonly type: ValidatorType = ValidatorType.ARR_STRING;

    /**
     * Creates an instance of the validator
     * @param indexing how to index the name parts
     */
    constructor(public indexing: NameIndex) {}

    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(values: string[]): void {

        if (values.length <= 1 || values.length > 5)
            throw new ValidationError('must be an array of 2 - 5 elements', 'Array of names')

        const pf = new PrefixValidator();
        const sf = new SuffixValidator();
        const fn = new FirstnameValidator();
        const ln = new LastnameValidator();
        const mn = new MiddlenameValidator();

        const index = this.indexing;

        switch(values.length) {
            case 2:
                fn.validate(values[index.firstname]);
                ln.validate(values[index.lastname]);
                break;
            case 3:
                fn.validate(values[index.firstname]);
                mn.validate(values[index.middlename]);
                ln.validate(values[index.lastname]);
                break;
            case 4:
                pf.validate(values[index.prefix]);
                fn.validate(values[index.firstname]);
                mn.validate(values[index.middlename]);
                ln.validate(values[index.lastname]);
                break;
            case 5:
                pf.validate(values[index.prefix]);
                fn.validate(values[index.firstname]);
                mn.validate(values[index.middlename]);
                ln.validate(values[index.lastname]);
                sf.validate(values[index.suffix])
                break;
        }
    }
}