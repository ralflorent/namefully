/**
 * An array of string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Fullname, Firstname, Lastname, Name, Prefix, Suffix } from '@models/index';
import { ArrayStringValidator } from '@validators/index';
import { Parser } from './parser';


/**
 * Represents an array string parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export default class ArrayStringParser implements Parser<string[]> {

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
