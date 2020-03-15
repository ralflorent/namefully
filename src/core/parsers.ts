/**
 * Parsers
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import {
    StringNameValidator,
    ArrayStringValidator,
    ArrayNameValidator,
    NamaValidator,
} from '@validators/index';
import {
    Namon,
    Separator,
    Name,
    Nama,
    Firstname,
    Lastname,
    Fullname,
    Prefix,
    Suffix
} from '@models/index';


/**
 * Interface for JSON signature that represents a generic parser
 * @interface
 */
export interface Parser<T> {
    /**
     * raw data to be parsed
     * @type {T}
     */
    raw: T;

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname;
}

/**
 * Represents a `Name` parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export class ArrayNameParser implements Parser<Name[]> {

    /**
     * Create a parser ready to parse the raw data
     * @param {Array<Name>} raw data
     */
    constructor(public raw: Name[]) {}

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname {
        // validate first
        new ArrayNameValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname: Fullname = this.distribute(this.raw);

        // finally return high quality of data
        return fullname;
    }

    private distribute(args: Array<Name>): Fullname {

        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

        args.forEach(name => {
            switch (name.type) {
                case Namon.PREFIX:
                    fullname.prefix = name.namon as Prefix;
                    break;
                case Namon.FIRST_NAME:
                    fullname.firstname = new Firstname(name.namon);
                    break;
                case Namon.LAST_NAME:
                    fullname.lastname = new Lastname(name.namon);
                    break;
                case Namon.MIDDLE_NAME:
                    fullname.middlename.push(name);
                    break;
                case Namon.SUFFIX:
                    fullname.suffix = name.namon as Suffix;
                    break;
            }
        });

        return fullname;
    }
}

/**
 * Represents a `Nama` parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export class NamaParser implements Parser<Nama> {

    /**
     * Create a parser ready to parse the raw data
     * @param {Nama} raw data as JSON object
     */
    constructor(public raw: Nama) { }

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname {

        // validate first
        new NamaValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname = this.distribute(this.raw);

        // finally return high quality of data
        return fullname;
    }

    private distribute(args: any): Fullname {
        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

        for (const entry of Object.entries(this.raw)) {
            const key = entry[0] as keyof Nama;
            const value = entry[1] as string;
            switch (key) {
                case Namon.FIRST_NAME:
                    fullname.firstname = new Firstname(value);
                    break;
                case Namon.LAST_NAME:
                    fullname.lastname = new Lastname(value);
                    break;
                case Namon.MIDDLE_NAME:
                    fullname.middlename.push(new Name(value, Namon.MIDDLE_NAME));
                    break;
                case Namon.PREFIX:
                    fullname.prefix = value as Prefix;
                    break;
                case Namon.SUFFIX:
                    fullname.suffix = value as Suffix;
                    break;
            }
        }
        return fullname;
    }
}

/**
 * Represents an array string parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export class ArrayStringParser implements Parser<string[]> {

    /**
     * Create a parser ready to parse the raw data
     * @param {Array<string>} raw data
     */
    constructor(public raw: string[]) { }

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname {

        // validate first
        new ArrayStringValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname = this.distribute(this.raw);

        // finally return high quality of data
        return fullname;
    }

    private distribute(args: string[]): Fullname {

        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

        switch (args.length) {
            case 2: // first name + last name
                fullname.firstname = new Firstname(args[0]);
                fullname.lastname = new Lastname(args[1]);
                break;
            case 3: // first name + middle name + last name
                fullname.firstname = new Firstname(args[0]);
                fullname.middlename.push(new Name(args[1], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(args[2]);
                break;
            case 4: // prefix + first name + middle name + last name
                fullname.prefix = args[0] as Prefix;
                fullname.firstname = new Firstname(args[1]);
                fullname.middlename.push(new Name(args[2], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(args[3]);
                break;
            case 5: // prefix + first name + middle name + last name + suffix
                fullname.prefix = args[0] as Prefix;
                fullname.firstname = new Firstname(args[1]);
                fullname.middlename.push(new Name(args[2], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(args[3]);
                fullname.suffix = args[4] as Suffix;
                break;
        }
        return fullname;
    }
}

/**
 * Represents a string parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export class StringParser implements Parser<string> {

    /**
     * Create a parser ready to parse the raw data
     * @param {string} raw raw data as a string representation
     */
    constructor(public raw: string) {}

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname {

        // validate first
        new StringNameValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname: Fullname = this.distribute(this.raw);

        // finally return high quality of data
        return fullname;
    }

    private distribute(raw: string): Fullname {
        // assuming this: '[Prefix] Firstname [Middlename] Lastname [Suffix]'
        const nama = raw.split(Separator.SPACE); // TODO: config separator for this
        const fullname = new ArrayStringParser(nama).parse();
        return fullname;
    }
}
