/**
 * An array of string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Fullname, Firstname, Lastname, Name, Prefix, Suffix, Separator } from '@models/index';
import { organizeNameIndex } from '@models/index';
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
    parse(options: { orderedBy: 'firstname' | 'lastname' }): Fullname {

        // given this setting
        const { orderedBy } = options;

        // validate first
        new ArrayStringValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname = this.distribute(orderedBy);

        // finally return high quality of data
        return fullname;
    }

    private distribute(orderedBy: 'firstname' | 'lastname'): Fullname {
        const raw: string[] = this.raw;
        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

        const index = organizeNameIndex(orderedBy, raw.length);

        switch (raw.length) {
            case 2: // first name + last name
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case 3: // first name + middle name + last name
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.middlename.push(new Name(raw[index.middlename], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case 4: // prefix + first name + middle name + last name
                fullname.prefix = raw[index.prefix] as Prefix;
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.middlename.push(new Name(raw[index.middlename], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case 5: // prefix + first name + middle name + last name + suffix
                fullname.prefix = raw[index.prefix] as Prefix;
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.middlename.push(new Name(raw[index.middlename], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(raw[index.lastname]);
                fullname.suffix = raw[index.suffix] as Suffix;
                break;
        }
        return fullname;
    }
}
