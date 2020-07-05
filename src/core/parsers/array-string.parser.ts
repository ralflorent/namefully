/**
 * An array of string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import {
    Namon,
    Fullname,
    Firstname,
    Lastname,
    Name,
    Prefix,
    Suffix,
    NameIndex,
    NameOrder
} from '../../models';
import { ArrayStringValidator } from '../../validators';
import { organizeNameIndex } from '../utils';
import { Parser } from './parser';
import {
    FIRST_LAST_NAME_INDEX,
    FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX
} from '../constants';


/**
 * Represents an array string parser
 * @class
 * @implements {Parser<string[]>}
 *
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
     * @param {string[]} raw data
     */
    constructor(public raw: string[]) { }

    /**
     * Parses the raw data into a full name
     */
    parse(options: { orderedBy: NameOrder, bypass: boolean }): Fullname {

        // given this setting
        const { orderedBy, bypass } = options;

        // validate first
        const raw = this.raw.map(n => n.trim()); // cleanup
        const index = organizeNameIndex(orderedBy, raw.length);
        if (!bypass) new ArrayStringValidator(index).validate(raw);

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
            case FIRST_LAST_NAME_INDEX:
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case FIRST_MIDDLE_LAST_NAME_INDEX:
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.middlename.push(new Name(raw[index.middlename], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX:
                fullname.prefix = raw[index.prefix] as Prefix;
                fullname.firstname = new Firstname(raw[index.firstname]);
                fullname.middlename.push(new Name(raw[index.middlename], Namon.MIDDLE_NAME));
                fullname.lastname = new Lastname(raw[index.lastname]);
                break;
            case PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX:
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
