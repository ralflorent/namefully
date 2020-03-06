/**
 * Validation types
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Enum for the validation types
 * @enum
 */
export enum ValidatorType {
    NONE,
    //----------
    NAMON,
    NAMA,
    ARR_NAMES, // array of `Name`s
    ARR_STRING, // array of string
    FULL_NAME,
    //----------
    PREFIX,
    FIRST_NAME,
    MIDDLE_NAME,
    LAST_NAME,
    SUFFIX,
    //----------
    CUSTOM, // user-defined
}