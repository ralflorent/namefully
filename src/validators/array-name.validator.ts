/**
 * Array of `Name` validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon } from '@models/index';
import {
    Validator, ValidatorType, ValidationError , PrefixValidator, FirstnameValidator,
    LastnameValidator, MiddlenameValidator, SuffixValidator
} from './index';

/**
 * Represents a validator to help the array `Name` parser
 * @class
 * @classdesc
 * This validator validates a array of `Name` objects following a specific order
 * based on the count of elements. It is expected that the array has to be
 * between two and five elements.
 *
 */
export default class ArrayNameValidator implements Validator<Name[]> {
    readonly type: ValidatorType = ValidatorType.ARR_NAMES;
    /**
     * Validates the content of a set of custom `Name`s
     * @param {Array<Name>} value data to validate
     */
    validate(values: Array<Name>): void {
        if (values.length <= 1 || values.length > 5) {
            throw new ValidationError(`must be an array of 2 - 5 'Name's`, 'Array of Names');
        }
        const validators = {
            [Namon.PREFIX]: new PrefixValidator(),
            [Namon.FIRST_NAME]: new FirstnameValidator(),
            [Namon.MIDDLE_NAME]: new MiddlenameValidator(),
            [Namon.LAST_NAME]: new LastnameValidator(),
            [Namon.SUFFIX]: new SuffixValidator(),
        };

        switch(values.length) {
            case 2: // first name + last name
                values.forEach(n => {
                    if ( ![Namon.FIRST_NAME, Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('Both first and last names are required')
                    validators[n.type].validate(n.namon)
                });
                break;
            case 3: // first name + middle name + last name
                values.forEach(n => {
                    if ( ![Namon.FIRST_NAME, Namon.MIDDLE_NAME, Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('First, middle and last names are required')
                    validators[n.type].validate(n.namon)
                });
                break;
            case 4: // first name + middle name + last name
                values.forEach(n => {
                    if ( ![Namon.PREFIX, Namon.FIRST_NAME, Namon.MIDDLE_NAME,
                        Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('More fields are required')
                    validators[n.type].validate(n.namon)
                });
                break;
            case 5: // first name + middle name + last name
                values.forEach(n => {
                    if ( ![Namon.PREFIX, Namon.FIRST_NAME, Namon.MIDDLE_NAME, Namon.LAST_NAME,
                        Namon.SUFFIX].includes(n.type) )
                        throw new ValidationError('More fields are required')
                    validators[n.type].validate(n.namon)
                });
                break;
        }
    }
}