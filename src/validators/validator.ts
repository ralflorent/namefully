/**
 * Validators
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Name, Prefix, Suffix } from '../namefully';


/**
 * Enum for the validation types
 * @enum
 */
enum ValidatorType {
    NONE,
    //----------
    NAMON,
    NAME,
    FULL_NAME,
    NAMES, // array string
    //----------
    PREFIX,
    SUFFIX,
    FIRST_NAME,
    LAST_NAME,
    MIDDLE_NAME,
    //----------
    CUSTOM, // user-defined
}

class ValidationRule {
    static namon: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
    static firtname: RegExp = /^$/g // TODO: define regex
    static lastname: RegExp = /^$/g // TODO: define regex
    static middlename: RegExp = /^[a-zA-Z]+(([' -][a-zA-Z])?[a-zA-Z]*)*$/g
    static fullname: RegExp = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
}

/**
 * Represents a validation error
 * @class
 * @extends Error
 */
class ValidationError extends Error {
    /**
     * Create a validation `Error`
     * @param message of error to display
     * @param type categorizes the error
     */
    constructor(message?: string, type?: string) {
        super(`${ type ? type + ' :: ' + message : message }`);
        this.name = ValidationError.name;
    }
}

interface Validator<T> {
    validate(value: T): void;
}

class FirstnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FIRST_NAME;
    /**
     * Validates the content of a prefix name
     * @param {string} value to validate
     */
    validate(value: string): void {
        throw new ValidationError('Invalid string content', 'First name');
    }
}

class LastnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.LAST_NAME;
    /**
     * Validates the content of a prefix name
     * @param {string} value to validate
     */
    validate(value: string): void {
        throw new ValidationError('Invalid string content', 'Last name');
    }
}

class MiddlenameValidator implements Validator<string | string[]> {
    readonly type: ValidatorType = ValidatorType.MIDDLE_NAME;
    /**
     * Validates the content of a list of middle names
     * @param {string | Array<string>} values to validate
     */
    validate(values: string | string[]): void {

        if (typeof values === 'string') {
            if (!ValidationRule.middlename.test(values))
                throw new ValidationError('Invalid string content', 'Middle name');
        } else if (values instanceof Array) {
            const namonValidator = new NamonValidator();
            (values as Array<string>).forEach(v => namonValidator.validate(v));
        } else {
            throw new Error('Expecting string or Array<string> type');
        }
    }
}

class PrefixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.PREFIX;
    /**
     * Validates the content of a prefix name
     * @param {string} value to validate
     */
    validate(value: string): void {
        const prefixes: Array<string> = Object.entries(Prefix).map(e => e[1].toLowerCase()); // values
        if (prefixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError('unknown value', 'Prefix');
    }
}

class SuffixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.SUFFIX;
    /**
     * Validates the content of a suffix name
     * @param {string} value to validate
     */
    validate(value: string): void {
        const suffixes: Array<string> = Object.entries(Suffix).map(e => e[1].toLowerCase()); // values
        if (suffixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError('unknown value', 'Suffix');
    }
}

class NamonValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.NAMON;
    /**
     * Validates the content of a name
     * @param {string} value a piece of name to validate
     */
    validate(value: string): void {
        if (!ValidationRule.namon.test(value))
            throw new ValidationError('Invalid string content', 'Name');
    }
}

class ArrayStringValidator implements Validator<string[]> {
    readonly type: ValidatorType = ValidatorType.NAMES;
    /**
     * Validates the content of a name
     * @param {string} value a piece of name to validate
     */
    validate(values: string[]): void {

        if (values.length <= 0 && values.length > 5)
            throw new ValidationError('Must be an array of 1 - 5 elements', 'Array of names')

        const pf = new PrefixValidator();
        const sf = new SuffixValidator();
        const fn = new FirstnameValidator();
        const ln = new LastnameValidator();
        const mn = new MiddlenameValidator();

        switch(values.length) {
            case 1: // mononym
                new NamonValidator().validate(values[0]);
                break;
            case 2: // first name + last name
                fn.validate(values[0]);
                ln.validate(values[1]);
                break;
            case 3: // first name + last name + middle name
                fn.validate(values[0]);
                ln.validate(values[1]);
                mn.validate(values[2]);
                break;
            case 4: // prefix + first name + last name + middle name
                pf.validate(values[0])
                fn.validate(values[1]);
                ln.validate(values[2]);
                mn.validate(values[3]);
                break;
            case 5: // prefix + first name + last name + middle name + suffix
                pf.validate(values[0])
                fn.validate(values[1]);
                ln.validate(values[2]);
                mn.validate(values[3]);
                sf.validate(values[4])
                break;
        }
    }
}

class FullnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FULL_NAME;
    /**
     * Validates the content of a name
     * @param {string} value a piece of name to validate
     */
    validate(value: string): void {
        if (!ValidationRule.fullname.test(value))
            throw new ValidationError('Invalid string content', 'Full name');
    }
}

class NameValidator implements Validator<Name> {
    readonly type: ValidatorType = ValidatorType.FULL_NAME;
    /**
     * Validates the content of a custom `Name`
     * @param {Name} value to validate
     */
    validate(value: Name): void {
        if (!ValidationRule.namon.test(value.namon))
            throw new ValidationError('Invalid string content', 'Name');
    }
}


export {
    Validator,
    ValidatorType,
    ValidationRule,
    //------------
    PrefixValidator,
    MiddlenameValidator,
    SuffixValidator,

    ArrayStringValidator,

    NamonValidator,
    NameValidator,
    FullnameValidator,
};
