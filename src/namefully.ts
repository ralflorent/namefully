/**
 * `Namefully` person name handler
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 *
 * @license GPL-3.0
 * @see {@link https://github.com/ralflorent/namefully|LICENSE} for more info.
 */
import { Parser, NamaParser, StringParser, ArrayNameParser, ArrayStringParser, CONFIG } from './core/index';
import { Fullname, Name, Nama, Namon, Separator, Summary, Config } from './models/index';
import { FullnameValidator } from './validators/index';

/**
 * `Namefully` scheme to keep track of the types and not worry about name
 * collisions with other objects. Instead of putting lots of different names
 * into the global namespace.
 *
 * How to share namespace:
 *     /// <reference path="namefully.ts" />
 */
// export namespace Namefully {...}


/**
 * `Namefully` class definition
 * @todo docs
 *
 * namon: piece of a name (e.g., firstname)
 * nama: pieces of a name (e.g., firstname + lastname)
 * @see https://departments.weber.edu/qsupport&training/Data_Standards/Name.htm
 */
export class Namefully {

    private fullname: Fullname;
    private stats: Summary;
    private config: Config;

    /**
     * Constructs an instance of the utility and helps to benefit from many helpers
     * @param {string | string[] | Array<Name> | Nama} raw element to parse or
     * construct the pieces of the name
     * @param {Config} options to configure how to run the utility
     */
    constructor(
        raw: string | Array<string> | Array<Name> | Nama,
        options?: Partial<{
            orderedBy: Namon,
            separator: Separator, // for ending suffix
            parser: Parser<string> // (user-defined) custom parser
        }>
    ) {
        // well, first thing first
        this.configure(options);

        // let's try to parse this, baby!
        this.build(raw);
    }

    /**
     * Gets the full name ordered as configured
     * @returns {string} the suffix
     *
     * @see {format} to alter manually the order of appearance of the full name.
     * For example, ::format('l f m') outputs `lastname firstname middlename`.
     */
    getFullname(): string {
        const nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(this.fullname.prefix)

        switch (this.config.orderedBy) {
            case Namon.FIRST_NAME:
                nama.push(this.getFirstname());
                nama.push(...this.getMiddlenames());
                nama.push(this.getLastname());
                break;
            case Namon.LAST_NAME:
                nama.push(this.getLastname());
                nama.push(...this.getMiddlenames());
                nama.push(this.getFirstname());
                break;
        }

        if (this.fullname.suffix) {
            const suffix = this.config.separator !== Separator.SPACE ?
                `${this.config.separator} ${this.fullname.suffix}` : // => ', PhD'
                this.fullname.suffix;
            nama.push(suffix);
        }

        return nama.join(Separator.SPACE);
    }

    /**
     * Gets the first name part of the full name
     * @returns {string} the first name
     */
    getFirstname(): string {
        return this.fullname.firstname.tostring();
    }

    /**
     * Gets the last name part of the full name
     * @returns {string} the last name
     */
    getLastname(): string {
        return this.fullname.lastname.tostring();
    }

    /**
     * Gets the middle names part of the full name
     * @returns {Array<string>} the middle names
     */
    getMiddlenames(): string[] {
        return this.fullname.middlename ?
            this.fullname.middlename.map(n => n.namon) :
            [];
    }

    /**
     * Gets the prefix part of the full name
     * @returns {string} the prefix
     */
    getPrefix(): string {
        return this.fullname.prefix ?
            this.fullname.prefix :
            Separator.EMPTY;
    }

    /**
     * Gets the suffix part of the full name
     * @returns {string} the suffix
     */
    getSuffix(): string {
        return this.fullname.suffix ?
            this.fullname.suffix :
            Separator.EMPTY;
    }

    /**
     * Gets the initials of the full name
     * @returns {Array<string>} the initials
     */
    getInitials(): string[] {
        // TODO: not considering middle names for now
        const initials = [];
        if (this.config.orderedBy = Namon.FIRST_NAME) {
            initials.push(...this.fullname.firstname.getInitials());
            initials.push(...this.fullname.lastname.getInitials());
        } else {
            initials.push(...this.fullname.lastname.getInitials());
            initials.push(...this.fullname.firstname.getInitials());
        }
        return initials;
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @returns {string} the stats behind the full name.
     *
     * Treated as a categorical dataset, the summary contains the following info:
     * `count` : the number of *unrestricted* characters of the name;
     * `frequency` : the highest frequency within the characters;
     * `top` : the character with the highest frequency;
     * `unique` : the count of unique characters of the name.
     *
     * @example
     * Given the name "Thomas Alva Edison", the summary will output as follows:
     *
     * Descriptive statistics for "Thomas Alva Edison"
     *  count    : 16
     *  frequency: 3
     *  top      : A
     *  unique   : 12
     *
     * **NOTE:**
     * During the setup, a set of restricted characters can be defined to be removed
     * from the stats. By default, the only restricted character is the `space`.
     * That is why the `count` for the example below result in `16` instead of
     * `16`.
     * Another thing to consider is that the summary is case *insensitive*. Note
     * that the letter `a` has the top frequency, be it `3`.
     */
    describe(): string {
        return this.stats.tostring();
    }

    /**
     * Shortens a complex full name to a simple typical name, a combination of
     * first name and last name.
     * @returns {string} a typical name
     *
     * @example
     * For a given name such as `Mr Keanu Charles Reeves`, shortening this name
     * is equivalent to making it `Keanu Reeves`.
     */
    shorten(): string {
        return [
            this.fullname.firstname.namon,
            this.fullname.lastname.namon
        ].join(Separator.SPACE);
    }

    /**
     * Compresses a name by using different forms of variants
     * @param {number} limit a threshold to limit the number of characters
     * @param {'firstname'|'lastname'|'middlename'|'firstmid'|'midlast'} by
     * a variant to use when compressing the long name. The last two variants
     * represent respectively the combination of `firstname + middlename` and
     * `middlename + lastname`.
     *
     * @example
     * The compressing operation is only executed iff there is valid entry and it
     * surpasses the limit set. In the examples below, let us assume that the
     * name goes beyond the limit value.
     *
     * Compressing a long name refers to reducing the name to the following forms:
     * 1. by firstname: 'John Moe Beau Lennon' => 'J. Moe Beau Lennon'
     * 2. by middlename: 'John Moe Beau Lennon' => 'John M. B. Lennon'
     * 3. by lastname: 'John Moe Beau Lennon' => 'John Moe Beau L.'
     * 4. by firstmid: 'John Moe Beau Lennon' => 'J. M. B. Lennon'
     * 5. by midlast: 'John Moe Beau Lennon' => 'John M. B. L.'
     *
     * By default, it compresses by 'firstmid' variant: 'J. M. B. Lennon'.
     */
    compress(
        limit: number = 20,
        by: 'firstname' | 'lastname' | 'middlename' | 'firstmid' | 'midlast' = 'middlename'
    ): string {

        if (this.getFullname().length <= limit) // no need to reduce it
            return this.getFullname();

        const { firstname, lastname, middlename } = this.fullname;
        const hasmid: boolean = Array.isArray(middlename) && middlename.length > 0;

        const firsts = firstname
            .getInitials()
            .join(Separator.PERIOD)
            .concat(Separator.PERIOD)
        ;
        const lasts = lastname
            .getInitials()
            .join(Separator.SPACE)
            .concat(Separator.PERIOD)
        ;
        const mids = hasmid ?
            middlename.map(n => n.getInitials())
            .join(Separator.PERIOD)
            .concat(Separator.PERIOD) :
            ''
        ;
        let cname = '';
        switch (by) {
            case 'firstname':
                cname = hasmid ?
                    [firsts, this.getMiddlenames().join(Separator.SPACE), lastname.tostring()].join(Separator.SPACE) :
                    [firsts, lastname.tostring()].join(Separator.SPACE);
                    break;
            case 'lastname':
                cname = hasmid ?
                    [firstname.tostring(), this.getMiddlenames().join(Separator.SPACE), lasts].join(Separator.SPACE) :
                    [firstname.tostring(), lasts].join(Separator.SPACE);
                    break;
            case 'middlename':
                cname = hasmid ?
                    [firstname.tostring(), mids, lastname.tostring()].join(Separator.SPACE) :
                    [firstname.tostring(), lastname.tostring()].join(Separator.SPACE);
                    break;
            case 'firstmid':
                cname = hasmid ?
                    [firsts, mids, lastname.tostring()].join(Separator.SPACE) :
                    [firsts, lastname.tostring()].join(Separator.SPACE);
                    break;
            case 'midlast':
                cname = hasmid ?
                    [firstname.tostring(), mids, lasts].join(Separator.SPACE) :
                    [firstname.tostring(), lasts].join(Separator.SPACE);
                break;
        }
        if (cname.length > limit) {
            console.warn(`The compressed name <${cname}> still surpasses the set limit ${limit}`);
        }
        return cname;
    }

    /**
     * Suggests possible (randomly) usernames closest to the name
     * @returns {Array<string>} a set of usernames
     *
     * **NOTE**
     * The validity of these usernames are not checked against any social media
     * or web app online.
     */
    username(): string[] {
        const unames: Array<string> = [];
        const { firstname: f, lastname: l } = this.fullname;
        const p = Separator.PERIOD;

        // Given `John Smith`
        unames.push(f.lower() + l.lower()); // johnsmith
        unames.push(l.lower() + f.lower()); // smithjohn
        unames.push(f.lower()[0] + l.lower()); // jsmith
        unames.push(l.lower()[0] + f.lower()); // sjohn
        unames.push(f.lower()[0] + p + l.lower()); // j.smith
        unames.push(l.lower()[0] + p + f.lower()); // s.john
        unames.push(f.lower().slice(0, 2) + l.lower()); // josmith
        unames.push(l.lower().slice(0, 2) + f.lower()); // smjohn
        unames.push(f.lower().slice(0, 2) + p + l.lower()); // jo.smith
        unames.push(l.lower().slice(0, 2) + p + f.lower()); // sm.john

        return unames;
    }

    /**
     * Formats the name as desired
     * @param {string} how to format the full name
     * @returns {string} the formatted name as specified
     *
     * How to format it?
     * 'f': first name
     * 'F': capitalized first name
     * 'l': last name (official)
     * 'L': capitalized last name
     * 'm': middle names
     * 'M': Capitalized middle names
     * 'O': official document format
     *
     * @example
     * Given the name `Joe Jim Smith`, call the `format` with the how string.
     * - format('l f') => 'Smith Joe'
     * - format('L, f') => 'SMITH, Joe'
     * - format('fml') => 'JoeJimSmith'
     * - format('FML') => 'JOEJIMSMITH'
     * - format('L, f m') => 'SMITH, Joe Jim'
     * - format('O') => 'SMITH, Joe Jim'
     */
    format(how?: string): string {
        if (!how)
            return this.getFullname();

        const formatted: Array<string> = [];
        for (const c of how) {
            if (['.', ',', ' ', '-', '_', 'f', 'F', 'l', 'L', 'm', 'M', 'n', 'N', 'O'].indexOf(c) === -1)
                throw new Error(`<${c}> is an invalid character for the formatting.`)
            formatted.push(this.map(c));
        }
        return formatted.join(Separator.EMPTY).trim();
    }

    /**
     * Configures how the setup will be working
     * @param {Config} options for a customized setup
     */
    private configure(options?: Partial<Config>): void {
        // consider using deepmerge if objects no longer stay shallow
        this.config = { ...CONFIG, ...options }; // if options, it overrides CONFIG
    }

    /**
     * Defines the full name by having the pieces (namon) of the names ready
     * @param parser customized or user-defined parser to get the full name
     */
    private initialize<T>(parser: Parser<T>): void {
        this.fullname = parser.parse();
    }

    /**
     * Maps a character to a specific piece of the name
     * @param c character to be mapped
     * @return {string} piece of name
     */
    private map(c: string): string {
        switch(c) {
            case '.':
                return Separator.PERIOD;
            case ',':
                return Separator.COMMA;
            case ' ':
                return Separator.SPACE;
            case '-':
                return Separator.HYPHEN;
            case '_':
                return Separator.UNDERSCORE;
            case 'f':
                return this.fullname.firstname.namon;
            case 'F':
                return this.fullname.firstname.upper();
            case 'l':
                return this.fullname.lastname.namon;
            case 'L':
                return this.fullname.lastname.upper();
            case 'm':
                return this.fullname.middlename
                    .map(n => n.namon).join(Separator.SPACE);
            case 'M':
                return this.fullname.middlename
                    .map(n => n.upper()).join(Separator.SPACE);
            case 'O':
                return [
                    this.fullname.prefix ? this.fullname.prefix : Separator.EMPTY,
                    this.fullname.lastname.upper().concat(Separator.COMMA),
                    this.fullname.firstname.tostring(),
                    this.fullname.middlename.map(n => n.namon).join(Separator.SPACE)
                ].join(Separator.SPACE).trim();
            default:
                return Separator.EMPTY;
        }
    }

    /**
     * Builds a high qualitty of data using parsers and validators
     * @param {string | string[] | Array<Name> | Nama} raw data to parse or
     * construct the pieces of the name
     */
    private build(raw: string | string[] | Array<Name> | Nama): void {
        if (this.config.parser) {
            this.initialize(this.config.parser);
        } else if (typeof raw === 'string') { // check for string type
            this.initialize(new StringParser(raw));
        } else if (Array.isArray(raw) && raw.length) { // check for Array<T>
            if (typeof raw[0] === 'string') { // check for Array<string>

                for (const key of <Array<string>>raw)
                    if (typeof key !== 'string')
                        throw new Error(`Cannot parse raw data as array of 'string'`);
                this.initialize(new ArrayStringParser(raw as Array<string>))

            } else if (raw[0] instanceof Name) { // check for Array<Name>

                for (const obj of <Array<Name>>raw)
                    if (!(obj instanceof Name))
                        throw new Error(`Cannot parse raw data as array of '${Name.name}'`);
                this.initialize(new ArrayNameParser(raw as Array<Name>));

            } else {
                // typescript should stop them, but let's be paranoid (for JS users)
                throw new Error(`Cannot parse raw data as arrays that are not of '${Name.name}' or string`);
            }
        } else if (raw instanceof Object) { // check for json object

            for (const entry of Object.entries(raw)) { // make sure keys are correct
                let key = entry[0], value = entry[1];
                // FIXME: middlename in singular form
                if (['firstname', 'lastname', 'middlename', 'prefix', 'suffix'].indexOf(key) === -1)
                    throw new Error(`Cannot parse raw data as json object that does not contains keys of '${Namon}'`);

                if (typeof value !== 'string') // make sure the values are proper string
                    throw new Error(`Cannot parse raw data. The key <${key}> should be a 'string' type`);
            }
            this.initialize(new NamaParser(raw as Nama));
        } else {
            // typescript should stop them, but let's be paranoid again (for JS users)
            throw new Error(`Cannot parse raw data. Review the data type expected.`);
        }
        // paranoid coder mode: on :P
        new FullnameValidator().validate(this.fullname);
        this.stats = new Summary(this.getFullname());
    }
}
