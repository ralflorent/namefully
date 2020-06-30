/**
 * An array `Name` parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Fullname, Firstname, Lastname, Prefix, Suffix, LastnameFormat } from '../../models/index';
import { ArrayNameValidator } from '../../validators/index';
import { Parser } from './parser';


/**
 * Represents a `Name[]` parser
 * @class
 * @implements {Parser<Name[]>}
 *
 * This parser parses an array of the class `Name` while checking that every part
 * plays the role they are supposed to play. The class `Name` is a ready-made
 * recipe that saves the how-to parsing for a raw data input.
 *
 * **NOTE**:
 * In this specific case, the user is expected to carefully set each name part
 * and submit a high-quality data. Why is this parser if the data is already
 * shaped as wanted? Well, it is better to be safe than sorry, so we implement a
 * double-check of these values and reconfirm a cleaner data. Remember, namefully
 * works like a trapdoor, once the data is set and confirmed safe, no editing is
 * possible.
 */
export default class ArrayNameParser implements Parser<Name[]> {

    /**
     * Create a parser ready to parse the raw data
     * @param {Name[]} raw data
     */
    constructor(public raw: Name[]) {}

    /**
     * Parses the raw data into a full name
     */
    parse(options: { bypass: boolean, lastnameFormat: LastnameFormat }): Fullname {
        const { bypass, lastnameFormat } = options;
        // validate first
        if (!bypass) new ArrayNameValidator().validate(this.raw);

        // then distribute all the elements accordingly
        const fullname: Fullname = this.distribute(lastnameFormat);

        // finally return high quality of data
        return fullname;
    }

    private distribute(lastnameFormat: LastnameFormat): Fullname {

        const fullname: Fullname = {
            firstname: null,
            lastname: null,
            middlename: [],
            prefix: null,
            suffix: null,
        };

        this.raw.forEach(name => {
            switch (name.type) {
                case Namon.PREFIX:
                    fullname.prefix = name.namon as Prefix;
                    break;
                case Namon.FIRST_NAME:
                    fullname.firstname = new Firstname(name.namon);
                    break;
                case Namon.LAST_NAME:
                    if (name instanceof Lastname)
                        fullname.lastname = new Lastname(name.father, name.mother, lastnameFormat)
                    else
                        fullname.lastname = new Lastname(name.namon, null, lastnameFormat);
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
