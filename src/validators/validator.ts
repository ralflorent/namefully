/**
 * Validators
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Name, Prefix, Suffix, Namon, Nama, Fullname, Firstname, Lastname } from '../namefully';


/**
 * Enum for the validation types
 * @enum
 */
enum ValidatorType {
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

/**
 * Represents a set of validation rules (regex)
 * @class
 * @static fields only
 * @implements {Validator}
 */
class ValidationRule {
    static namon: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
    static fullname: RegExp = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g

    static firtname: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
    static middlename: RegExp = /^[a-zA-Z]+(([' -][a-zA-Z])?[a-zA-Z]*)*$/g
    static lastname: RegExp = /^[a-zA-Z]+((['-][a-zA-Z])?[a-zA-Z]*)*$/g
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

/**
 * Interface for a JSON signature that represents a generic validator
 * @interface
 */
interface Validator<T> {
    validate(value: T): void;
}

/**
 * Represents a `Fullname` (JSON signature) validator
 * @class
 * @implements {Validator}
 */
class FullnameValidator implements Validator<Fullname> {
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

/**
 * Represents a string full name validator
 * @class
 * @implements {Validator}
 */
class StringNameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FULL_NAME;
    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.fullname.test(value))
            throw new ValidationError('invalid string content', 'Full name');
    }
}

/**
 * Represents a prefix validator
 * @class
 * @implements {Validator}
 */
class PrefixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.PREFIX;
    /**
     * Validates the content of a prefix name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        const prefixes: Array<string> = Object.entries(Prefix).map(e => e[1].toLowerCase()); // values
        if (prefixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError('unknown value', 'Prefix');
    }
}

/**
 * Represents a first name validator
 * @class
 * @implements {Validator}
 */
class FirstnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.FIRST_NAME;
    /**
     * Validates the content of a first name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.firtname.test(value))
            throw new ValidationError('invalid string content', 'First name');
    }
}

/**
 * Represents a middle name validator
 * @class
 * @implements {Validator}
 */
class MiddlenameValidator implements Validator<string | string[]> {
    readonly type: ValidatorType = ValidatorType.MIDDLE_NAME;
    /**
     * Validates the content of a list of middle names
     * @param {string | Array<string>} values to validate
     */
    validate(values: string | string[]): void {

        if (typeof values === 'string') {
            if (!ValidationRule.middlename.test(values))
                throw new ValidationError('invalid string content', 'Middle name');
        } else if (values instanceof Array) {
            const namonValidator = new NamonValidator();
            (values as Array<string>).forEach(v => namonValidator.validate(v));
        } else {
            throw new Error('Expecting string or Array<string> type');
        }
    }
}

/**
 * Represents a last name validator
 * @class
 * @implements {Validator}
 */
class LastnameValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.LAST_NAME;
    /**
     * Validates the content of a last name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.lastname.test(value))
            throw new ValidationError('invalid string content', 'Last name');
    }
}

/**
 * Represents a suffix validator
 * @class
 * @implements {Validator}
 */
class SuffixValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.SUFFIX;
    /**
     * Validates the content of a suffix name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        const suffixes: Array<string> = Object.entries(Suffix).map(e => e[1].toLowerCase()); // values
        if (suffixes.indexOf(value.toLowerCase()) === -1)
            throw new ValidationError('unknown value', 'Suffix');
    }
}

/**
 * Represents a namon validator to help to parse single pieces of string
 * @class
 */
class NamonValidator implements Validator<string> {
    readonly type: ValidatorType = ValidatorType.NAMON;
    /**
     * Validates the content of a name
     * @param {string} value data to validate
     */
    validate(value: string): void {
        if (!ValidationRule.namon.test(value))
            throw new ValidationError('invalid string content', 'Name');
    }
}

/**
 * Represents a `Nama` validator to help the nama parser
 * @class
 * @implements {Validator}
 */
class NamaValidator implements Validator<Nama> {
    readonly type: ValidatorType = ValidatorType.NAMA;
    /**
     * Validates the content of a JSON-formatted names
     * @param {string} value data to validate
     */
    validate(value: Nama): void {

        const entries = Object.entries(value);
        if (entries.length <= 1 && entries.length > 5)
            throw new ValidationError('incomplete JSON object', 'Nama')

        const validators = {
            [Namon.PREFIX]: new PrefixValidator(),
            [Namon.FIRST_NAME]: new FirstnameValidator(),
            [Namon.MIDDLE_NAME]: new MiddlenameValidator(),
            [Namon.LAST_NAME]: new LastnameValidator(),
            [Namon.SUFFIX]: new SuffixValidator(),
        };
        for (const entry of entries) {
            let key = entry[0] as keyof Nama, value = entry[1] as string;
            validators[key].validate(value);
        }
    }
}

/**
 * Represents a validator to help the array string parser
 * @class
 * @classdesc
 */
class ArrayStringValidator implements Validator<string[]> {
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

/**
 * Represents a validator to help the array `Name` parser
 * @class
 * @classdesc
 */
class ArrayNameValidator implements Validator<Name[]> {
    readonly type: ValidatorType = ValidatorType.ARR_NAMES;
    /**
     * Validates the content of a set of custom `Name`s
     * @param {Array<Name>} value data to validate
     */
    validate(values: Array<Name>): void {
        if (values.length <= 1 && values.length > 5) {
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


export {
    Validator,
    ValidatorType,
    ValidationRule,
    //------------
    PrefixValidator,
    FirstnameValidator,
    MiddlenameValidator,
    LastnameValidator,
    SuffixValidator,
    //------------
    NamonValidator,
    NamaValidator,
    ArrayNameValidator,
    ArrayStringValidator,
    StringNameValidator,
    FullnameValidator,
};
