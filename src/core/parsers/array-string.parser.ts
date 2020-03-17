/**
 * An array of string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Fullname, Firstname, Lastname, Name, Prefix, Suffix, NameIndex } from '../../models/index';
import { ArrayStringValidator } from '../../validators/index';
import { organizeNameIndex } from '../../core/index';
import { Parser } from './parser';


/**
 * Represents an array string parser
 * @class
 * @implements {Parser<string[]>}
 * @classdesc
 * This parser parses an array of string name following a specific order based
 * on the count of elements. It is expected that the array has to be between two
 * and five elements. Also, the order of appearance set in the configuration
 * influences how this parsing is carried out.
 *
 * Ordered by first name, the parser works as follows:
 * - 2 elements: firstname lastname
 * - 3 elements: firstname middlename lastname
 * - 4 elements: prefix firstname middlename lastname
 * - 5 elements: prefix firstname middlename lastname suffix
 *
 * Ordered by last name, the parser works as follows:
 * - 2 elements: lastname firstname
 * - 3 elements: lastname firstname middlename
 * - 4 elements: prefix lastname firstname middlename
 * - 5 elements: prefix lastname firstname middlename suffix
 *
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
        const raw = this.raw.map(n => n.trim()); // cleanup
        const index = organizeNameIndex(orderedBy, raw.length);
        new ArrayStringValidator(index).validate(raw);

        // then distribute all the elements accordingly
        const fullname = this.distribute(raw, index);

        // finally return high quality of data
        return fullname;
    }

    private distribute(raw: string[], index: NameIndex): Fullname {

        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

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
