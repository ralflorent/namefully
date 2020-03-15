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

/**
 * Represents a validator to help the array string parser
 * @class
 * @classdesc
 */
export default class ArrayStringValidator implements Validator<string[]> {
    readonly type: ValidatorType = ValidatorType.ARR_STRING;
    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(values: string[]): void {

        if (values.length <= 1 && values.length > 5)
            throw new ValidationError('must be an array of 2 - 5 elements', 'Array of names')

        const pf = new PrefixValidator();
        const sf = new SuffixValidator();
        const fn = new FirstnameValidator();
        const ln = new LastnameValidator();
        const mn = new MiddlenameValidator();

        switch(values.length) {
            case 2: // first name + last name
                fn.validate(values[0]);
                ln.validate(values[1]);
                break;
            case 3: // first name + middle name + last name
                fn.validate(values[0]);
                mn.validate(values[1]);
                ln.validate(values[2]);
                break;
            case 4: // prefix + first name + middle name + last name
                pf.validate(values[0])
                fn.validate(values[1]);
                mn.validate(values[2]);
                ln.validate(values[3]);
                break;
            case 5: // prefix + first name + middle name + last name + suffix
                pf.validate(values[0])
                fn.validate(values[1]);
                mn.validate(values[2]);
                ln.validate(values[3]);
                sf.validate(values[4])
                break;
        }
    }
}