/**
 * Array of `Name` validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon } from '../models';
import {
    Validator,
    ValidatorType,
    ValidationError,
    Validators,
} from './index';
import {
    MIN_NUMBER_NAME_PART,
    MAX_NUMBER_NAME_PART,
    FIRST_LAST_NAME_INDEX,
    FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX,
} from '../core/constants';

/**
 * Represents a validator to help the array `Name` parser
 * @class
 *
 * This validator validates a array of `Name` objects following a specific order
 * based on the count of elements. It is expected that the array has to be
 * between two and five elements.
 *
 */
export default class ArrayNameValidator implements Validator<Name[]> {
    readonly type: ValidatorType = ValidatorType.ARR_NAMES;
    /**
     * Validates the content of a set of custom `Name`s
     * @param {Name[]} value data to validate
     */
    validate(values: Name[]): void {
        if (values.length < MIN_NUMBER_NAME_PART || values.length > MAX_NUMBER_NAME_PART)
            throw new ValidationError(
                `must be an array of ${MIN_NUMBER_NAME_PART} - ` +
                `${MAX_NUMBER_NAME_PART} 'Name's`, 'Array of Names'
            );

        const validators = {
            [Namon.PREFIX]: Validators.prefix,
            [Namon.FIRST_NAME]: Validators.firstname,
            [Namon.MIDDLE_NAME]: Validators.middlename,
            [Namon.LAST_NAME]: Validators.lastname,
            [Namon.SUFFIX]: Validators.suffix,
        } as const;

        switch(values.length) {
            case FIRST_LAST_NAME_INDEX:
                values.forEach(n => {
                    if ( ![Namon.FIRST_NAME, Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('Both first and last names are required')
                    validators[n.type].validate(n.tostring())
                });
                break;
            case FIRST_MIDDLE_LAST_NAME_INDEX:
                values.forEach(n => {
                    if ( ![Namon.FIRST_NAME, Namon.MIDDLE_NAME, Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('First, middle and last names are required')
                    validators[n.type].validate(n.tostring())
                });
                break;
            case PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX:
                values.forEach(n => {
                    if ( ![Namon.PREFIX, Namon.FIRST_NAME, Namon.MIDDLE_NAME,
                        Namon.LAST_NAME].includes(n.type) )
                        throw new ValidationError('More fields are required')
                    validators[n.type].validate(n.tostring())
                });
                break;
            case PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX:
                values.forEach(n => {
                    if ( ![Namon.PREFIX, Namon.FIRST_NAME, Namon.MIDDLE_NAME, Namon.LAST_NAME,
                        Namon.SUFFIX].includes(n.type) )
                        throw new ValidationError('More fields are required')
                    validators[n.type].validate(n.tostring())
                });
                break;
        }
    }
}