/**
 * A `Validator` contract
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import PrefixValidator from './prefix.validator';
import FirstnameValidator from './firstname.validator';
import MiddlenameValidator from './middlename.validator';
import LastnameValidator from './lastname.validator';
import SuffixValidator from './suffix.validator';

/**
 * Interface for a JSON signature that represents a generic validator
 * @interface
 */
export interface Validator<T> {
    validate(value: T): void;
}

/**
 * Group the most relevant validators
 */
export class Validators {
    static prefix = new PrefixValidator();
    static firstname = new FirstnameValidator();
    static middlename = new MiddlenameValidator();
    static lastname = new LastnameValidator();
    static suffix = new SuffixValidator();
}
