/**
 * A string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator, Fullname } from '@models/index';
import { StringNameValidator } from '@validators/index';
import { Parser, ArrayStringParser } from './index';


/**
 * Represents a string parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export default class StringParser implements Parser<string> {

    /**
     * Create a parser ready to parse the raw data
     * @param {string} raw data as a string representation
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
