/**
 * Validation rules
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Represents a set of validation rules (regex)
 * @class
 * @static fields only
 * @implements {Validator}
 */
export class ValidationRule {
    static namon: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
    static fullname: RegExp = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g

    static firtname: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
    static middlename: RegExp = /^[a-zA-Z]+(([' -][a-zA-Z])?[a-zA-Z]*)*$/g
    static lastname: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
}