/**
 * A string parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator, Fullname, NameOrder } from '../../models/index';
import { Parser, ArrayStringParser } from './index';


/**
 * Represents a string parser
 * @class
 * @implements {Parser}
 * @classdesc
 * This parser parses a string name using a separator, if set, or simply using
 * the space character <' '> as a basis for the split.
 *
 * **NOTE**:
 * A string name is basically a string type containing the name parts differentiated
 * with the help of a separator. The default separator is the character <space>
 * or <' '>. However, it can be very, very helpful to use a distinct separator
 * (e.g., a colon <:>) to handle multiple names for a `Namon`. That is to say,
 * a piece of name shaped as `De La Cruz` is a last name that needs to be handled
 * as a whole, and therefore requires that a different type of separator to split
 * up the name parts. Alternatively, the `ArrayStringParser` can be used by indicating
 * specifically which part of the name is what. Do note that this parser is actually
 * a wrapper of the `ArrayStringParser`.
 *
 * @example
 * Given the name `Maria De La Cruz`, using this parser without indicating a
 * separator different than <space> will definitely throw an error. So, if the proper
 * proper of doing when `De La Cruz` is the last name:
 * ```
 *  > const name = new Namefully('Maria:De La Cruz', { separator: Separator.COLON })
 *  > console.log(name.getLastname())
 *  De La Cruz
 * ```
 * Or
 * ```
 *  > const name = new Namefully(['Maria', 'De La Cruz'])
 *  > console.log(name.getLastname())
 *  De La Cruz
 * ```
 */
export default class StringParser implements Parser<string> {

    /**
     * Create a parser ready to parse the raw data
     * @param {string} raw data as a string representation
     */
    constructor(public raw: string) {}

    /**
     * Parses the raw data into a full name
     * @param options how to parse
     */
    parse(options: {
        orderedBy: NameOrder,
        separator: Separator,
        bypass: boolean,
    }): Fullname {

        // given this setting
        const { orderedBy, separator, bypass } = options;

        // then distribute all the elements accordingly
        const nama = this.raw.split(separator);
        const fullname = new ArrayStringParser(nama).parse({ orderedBy, bypass });

        // finally return high quality of data
        return fullname;
    }
}
