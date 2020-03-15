/**
 * `Fullname` validator
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Fullname, Firstname, Lastname } from '@models/index';
import { Validator, ValidatorType, ValidationError, PrefixValidator } from './index';

/**
 * Represents a `Fullname` (JSON signature) validator for provided custom parser
 * @class
 * @implements {Validator}
 */
export default class FullnameValidator implements Validator<Fullname> {
    readonly type: ValidatorType = ValidatorType.FULL_NAME;
    /**
     * Validates that the `Fullname` contract is met
     * @param {Fullname} value data to validate
     */
    validate(v: Fullname): void {
        if (!v.firstname || !(v.firstname instanceof Firstname))
            throw new ValidationError('first name is corrupted', 'Fullname');
        if (!v.lastname || !(v.lastname instanceof Lastname))
            throw new ValidationError('last name is corrupted', 'Fullname');
        if (v.middlename && !(v.middlename instanceof Array))
            throw new ValidationError('middle name is corrupted', 'Fullname');
        if (v.prefix)
            new PrefixValidator().validate(v.prefix)
    }
}