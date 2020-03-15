/**
 * An array `Name` parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Fullname, Firstname, Lastname, Prefix, Suffix } from '@models/index';
import { ArrayNameValidator } from '@validators/index';
import { Parser } from './parser';


/**
 * Represents a `Name[]` parser
 * @class
 * @implements {Parser}
 * @classdesc
 */
export default class ArrayNameParser implements Parser<Name[]> {

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
