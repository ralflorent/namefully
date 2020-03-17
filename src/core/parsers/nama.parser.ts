/**
 * A `Nama` (JSON signature) parser
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Nama, Fullname, Firstname, Lastname, Name, Prefix, Suffix } from '../../models/index';
import { NamaValidator } from '../../validators/index';
import { Parser } from './parser';


/**
 * Represents a `Nama` parser
 * @class
 * @implements {Parser<Nama>}
 * @classdesc
 * This parser parses a JSON signature of the name parts provided as string
 * values. This is to facilitate a developer's life that holds users' info in a
 * JSON format. In other words, the developer only needs to provide similar info
 * and the rest will follow.
 */
export default class NamaParser implements Parser<Nama> {

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
