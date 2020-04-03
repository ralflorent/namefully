/**
 * `Namefully` person name handler
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 *
 * @license GPL-3.0
 * @see {@link https://github.com/ralflorent/namefully|namefully} for more info.
 */
import { Parser, NamaParser, StringParser, ArrayNameParser, ArrayStringParser, CONFIG } from './core/index';
import { Fullname, Name, Nama, Namon, Separator, Summary, Config, NameOrder, AbbrTitle, LastnameFormat } from './models/index';
import { FullnameValidator } from './validators/index';

/**
 * Person name handler in the Latin alphabet
 * @class
 * @classdesc
 * `Namefully` does not magically guess which part of the name is what. It relies
 * actually on how the developer indicates the roles of the name parts so that
 * it, internally, can perform certain operations and saves the developer some
 * calculations/processings. Nevertheless, Namefully can be constructed using
 * distinct raw data shape. This is intended to give some flexibility to the
 * developer so that he or she is not bound to a particular data format. Please,
 * do follow closely the APIs to know how to properly use it in order to avoid
 * some errors (mainly validation's).
 *
 * `Namefully` also works like a trap door. Once a raw data is provided and
 * validated, a developer can only ACCESS in a vast amount of, yet effective ways
 * the name info. NO EDITING is possible. If the name is mistaken, a new instance
 * of `Namefully` must be created. Remember, this utility's primary objective is
 * to help to **handle** a person name.
 *
 * Note that the name standards used for the current version of this library are
 * as follows:
 *      [Prefix] Firstname [Middlename] Lastname [Suffix]
 * The opening `[` and closing `]` brackets mean that these parts are optional.
 * In other words, the most basic and typical case is a name that looks like this:
 * `John Smith`, where `John` is the first name and `Smith`, the last name.
 * @see https://departments.weber.edu/qsupport&training/Data_Standards/Name.htm
 * for more info on name standards.
 *
 * **IMPORTANT**: Keep in mind that the order of appearance matters and can be
 * altered through configured parameters, which we will be seeing later on. By
 * default, the order of appearance is as shown above and will be used as a basis
 * for future examples and use cases.
 *
 * Once imported, all that is required to do is to create an instance of
 * `Namefully` and the rest will follow.
 *
 * Some terminologies used across the library are:
 * - namon: piece of a name (e.g., firstname)
 * - nama: pieces of a name (e.g., firstname + lastname)
 *
 * Happy naming!
 */
export class Namefully {
    /**
     * Holds a json-like high quality of data
     * @see {Fullname} description for more details
     */
    private fullname: Fullname;
    /**
     * Holds statistical info on the name
     * @see {Summary} class description for more details
     */
    private summary: Summary;
    /**
     * Holds a json-like copy of the preset configuration
     * @see {Config} description for more details
     */
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
            orderedBy: NameOrder,
            separator: Separator, // how to split string names
            titling: AbbrTitle, // whether to add a period to a prefix
            ending: Separator, // for ending suffix
            bypass: boolean, // a bypass for validators
            parser: Parser<any> // (user-defined) custom parser
        }>
    ) {
        // well, first thing first
        this.configure(options);

        // let's try to parse this, baby!
        this.build(raw);
    }

    /**
     * Gets the full name ordered as configured
     * @param {'firstname'|'lastname'} orderedBy force to order by first or last
     * name by overriding the preset configuration
     * @returns {string} the suffix
     *
     * @see {format} to alter manually the order of appearance of the full name.
     * For example, ::format('l f m') outputs `lastname firstname middlename`.
     */
    getFullname(orderedBy?: NameOrder): string {
        orderedBy = orderedBy || this.config.orderedBy; // override config
        const { titling, ending } = this.config;
        const pxSep = titling === 'us' ? Separator.PERIOD : Separator.EMPTY; // Mr[.]
        const sxSep = ending !== Separator.SPACE ? ending : Separator.EMPTY; // [,] PhD
        const nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(Separator.EMPTY.concat(this.fullname.prefix, pxSep))

        switch (orderedBy) {
            case 'firstname':
                nama.push(this.getFirstname());
                nama.push(...this.getMiddlenames());
                nama.push(Separator.EMPTY.concat(this.getLastname(), sxSep));
                break;
            case 'lastname':
                nama.push(this.getLastname());
                nama.push(this.getFirstname());
                nama.push(this.getMiddlenames().join(Separator.SPACE).concat(sxSep));
                break;
        }

        if (this.fullname.suffix)
            nama.push(this.fullname.suffix);

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
     * @param {LastnameFormat} [format] overrides the how-to format of a surname
     * output, considering its subparts.
     * @returns {string} the last name
     */
    getLastname(format?: LastnameFormat): string {
        return this.fullname.lastname.tostring(format);
    }

    /**
     * Gets the middle names part of the full name
     * @returns {Array<string>} the middle names
     */
    getMiddlenames(): string[] {
        return this.fullname.middlename ? this.fullname.middlename.map(n => n.namon) : [];
    }

    /**
     * Gets the prefix part of the full name
     * @returns {string} the prefix
     */
    getPrefix(): string {
        const pxSep = this.config.titling === 'us' ? Separator.PERIOD : Separator.EMPTY;
        return this.fullname.prefix ?
            Separator.EMPTY.concat(this.fullname.prefix, pxSep) :
            Separator.EMPTY;
    }

    /**
     * Gets the suffix part of the full name
     * @returns {string} the suffix
     */
    getSuffix(): string {
        return this.fullname.suffix || Separator.EMPTY;
    }

    /**
     * Gets the initials of the full name
     * @param {'firstname'|'lastname'} orderedBy force to order by first or last
     * name by overriding the preset configuration
     * @param {boolean} [withMid] whether to include middle names's
     * @returns {Array<string>} the initials
     *
     * @example
     * Given the names:
     * - `John Smith` => ['J', 'S']
     * - `John Ben Smith` => ['J', 'S']
     * when `withMid` is set to true:
     * - `John Ben Smith` => ['J', 'B', 'S']
     *
     * **NOTE**:
     * Ordered by last name obeys the following format:
     *  `lastname firstname [middlename]`
     * which means that if no middle name was set, setting `withMid` to true
     * will output nothing and warn the end user about it.
     */
    getInitials(
        orderedBy?: NameOrder,
        withMid: boolean = false
    ): string[] {
        orderedBy = orderedBy || this.config.orderedBy; // override config
        const midInits = this.fullname.middlename ?
            this.fullname.middlename.map(n => n.getInitials()) : [];

        if (withMid && !this.fullname.middlename) {
            console.warn('No initials for middle names since none was set.');
        }

        const initials = [];
        switch(orderedBy) {
            case 'firstname':
                initials.push(...this.fullname.firstname.getInitials());
                if (withMid) midInits.forEach(m => initials.push(...m));
                initials.push(...this.fullname.lastname.getInitials());
                break;
            case 'lastname':
                initials.push(...this.fullname.lastname.getInitials());
                initials.push(...this.fullname.firstname.getInitials());
                if (withMid) midInits.forEach(m => initials.push(...m));
                break;
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
    describe(what: 'fullname' | 'firstname' | 'lastname' | 'middlename' = 'fullname'): string {
        switch(what) {
            case 'fullname':
                return this.summary.tostring();
            case 'firstname':
                return this.fullname.firstname.describe().tostring();
            case 'lastname':
                return this.fullname.lastname.describe().tostring();
            case 'middlename':
                return this.fullname.middlename ?
                    this.fullname.middlename.map(n => n.describe().tostring()).join('\n') :
                    Separator.EMPTY
        }
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
    shorten(orderedBy?: 'firstname' | 'lastname'): string {
        orderedBy = orderedBy || this.config.orderedBy; // override config
        return orderedBy === 'firstname' ?
        [
            this.fullname.firstname.namon,
            this.fullname.lastname.namon,
        ].join(Separator.SPACE) :
        [
            this.fullname.lastname.namon,
            this.fullname.firstname.namon,
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

        if (this.getFullname().length <= limit) // no need to compress
            return this.getFullname();

        const { firstname: fn, lastname: ln, middlename } = this.fullname;
        const mn = this.getMiddlenames().join(Separator.SPACE);
        const hasmid: boolean = Array.isArray(middlename) && middlename.length > 0;

        const firsts = fn.getInitials().join(Separator.PERIOD).concat(Separator.PERIOD);
        const lasts = ln.getInitials().join(Separator.SPACE).concat(Separator.PERIOD);
        const mids = hasmid ?
            middlename.map(n => n.getInitials())
            .join(Separator.PERIOD)
            .concat(Separator.PERIOD) :
            Separator.EMPTY;
        let cname = '';

        if (this.config.orderedBy === 'firstname') {
            switch (by) {
                case 'firstname':
                    cname = hasmid ?
                        [firsts, mn, ln.tostring()].join(Separator.SPACE) :
                        [firsts, ln.tostring()].join(Separator.SPACE);
                        break;
                case 'lastname':
                    cname = hasmid ?
                        [fn.tostring(), mn, lasts].join(Separator.SPACE) :
                        [fn.tostring(), lasts].join(Separator.SPACE);
                        break;
                case 'middlename':
                    cname = hasmid ?
                        [fn.tostring(), mids, ln.tostring()].join(Separator.SPACE) :
                        [fn.tostring(), ln.tostring()].join(Separator.SPACE);
                        break;
                case 'firstmid':
                    cname = hasmid ?
                        [firsts, mids, ln.tostring()].join(Separator.SPACE) :
                        [firsts, ln.tostring()].join(Separator.SPACE);
                        break;
                case 'midlast':
                    cname = hasmid ?
                        [fn.tostring(), mids, lasts].join(Separator.SPACE) :
                        [fn.tostring(), lasts].join(Separator.SPACE);
                    break;
            }
        }
        else {
            switch (by) {
                case 'firstname':
                    cname = hasmid ?
                        [ln.tostring(), firsts, mn].join(Separator.SPACE) :
                        [ln.tostring(), firsts].join(Separator.SPACE);
                        break;
                case 'lastname':
                    cname = hasmid ?
                        [lasts, fn.tostring(), mn].join(Separator.SPACE) :
                        [lasts, fn.tostring()].join(Separator.SPACE);
                        break;
                case 'middlename':
                    cname = hasmid ?
                        [ln.tostring(), fn.tostring(), mids].join(Separator.SPACE) :
                        [ln.tostring(), fn.tostring()].join(Separator.SPACE);
                        break;
                case 'firstmid':
                    cname = hasmid ?
                        [ln.tostring(), firsts, mids].join(Separator.SPACE) :
                        [ln.tostring(), firsts].join(Separator.SPACE);
                        break;
                case 'midlast':
                    cname = hasmid ?
                        [lasts, fn.tostring(), mids].join(Separator.SPACE) :
                        [lasts, fn.tostring()].join(Separator.SPACE);
                    break;
            }
        }

        if (cname.length > limit)
            console.warn(`The compressed name <${cname}> still surpasses the set limit ${limit}`);

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
        const tokens = [
            '.', ',', ' ', '-', '_', 'f', 'F', 'l', 'L', 'm', 'M',
            'n', 'N', 'o', 'O', 'p', 'P', 's', 'S'
        ];
        for (const c of how) {
            if (tokens.indexOf(c) === -1)
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
        const { orderedBy, separator, bypass } = this.config;
        this.fullname = parser.parse({ orderedBy, separator, bypass });
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
            case 'o': case 'O':
                const { titling, ending } = this.config;
                const pxSep = titling === 'us' ? Separator.PERIOD : Separator.EMPTY;
                const sxSep = ending !== Separator.SPACE ? ending : Separator.EMPTY;

                const official = [
                    this.fullname.prefix ? Separator.EMPTY.concat(this.fullname.prefix, pxSep) : Separator.EMPTY,
                    this.fullname.lastname.upper().concat(Separator.COMMA),
                    this.fullname.firstname.tostring(),
                    this.fullname.middlename.map(n => n.namon).join(Separator.SPACE).concat(sxSep),
                    this.fullname.suffix || Separator.EMPTY,
                ].join(Separator.SPACE).trim();

                return c === 'o' ? official : official.toUpperCase();
            case 'p':
                return this.fullname.prefix || Separator.EMPTY;
            case 'P':
                return this.fullname.prefix ? this.fullname.prefix.toUpperCase() : Separator.EMPTY;
            case 's':
                return this.fullname.suffix || Separator.EMPTY;
            case 'S':
                return this.fullname.suffix ? this.fullname.suffix.toUpperCase() : Separator.EMPTY;
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

                for (const key of raw as Array<string>)
                    if (typeof key !== 'string')
                        throw new Error(`Cannot parse raw data as array of 'string'`);
                this.initialize(new ArrayStringParser(raw as Array<string>))

            } else if (raw[0] instanceof Name) { // check for Array<Name>

                for (const obj of raw as Array<string>)
                    if (!(obj as any instanceof Name))
                        throw new Error(`Cannot parse raw data as array of '${Name.name}'`);
                this.initialize(new ArrayNameParser(raw as Array<Name>));

            } else {
                // typescript should stop them, but let's be paranoid (for JS developers)
                throw new Error(`Cannot parse raw data as arrays that are not of '${Name.name}' or string`);
            }
        } else if (raw instanceof Object) { // check for json object

            for (const entry of Object.entries(raw)) { // make sure keys are correct
                const key = entry[0], value = entry[1];
                if (['firstname', 'lastname', 'middlename', 'prefix', 'suffix'].indexOf(key) === -1)
                    throw new Error(`Cannot parse raw data as json object that does not contains keys of '${Namon}'`);

                if (typeof value !== 'string') // make sure the values are proper string
                    throw new Error(`Cannot parse raw data. The key <${key}> should be a 'string' type`);
            }
            this.initialize(new NamaParser(raw as Nama));
        } else {
            // typescript should stop them, but let's be paranoid again (for JS developers)
            throw new Error(`Cannot parse raw data. Review the data type expected.`);
        }
        // paranoid coder mode: on :P
        new FullnameValidator().validate(this.fullname);
        this.summary = new Summary(this.getFullname());
    }
}

/**
 * Aliases for `Namefully`
 */
export interface Namefully {
    full: typeof Namefully.prototype.getFullname;
    fn: typeof Namefully.prototype.getFirstname;
    ln: typeof Namefully.prototype.getLastname;
    mn: typeof Namefully.prototype.getMiddlenames;
    px: typeof Namefully.prototype.getPrefix;
    sx: typeof Namefully.prototype.getSuffix;
    inits: typeof Namefully.prototype.getInitials;
    stats: typeof Namefully.prototype.describe;
}

Namefully.prototype.full = Namefully.prototype.getFullname;
Namefully.prototype.fn = Namefully.prototype.getFirstname;
Namefully.prototype.ln = Namefully.prototype.getLastname;
Namefully.prototype.mn = Namefully.prototype.getMiddlenames;
Namefully.prototype.px = Namefully.prototype.getPrefix;
Namefully.prototype.sx =  Namefully.prototype.getSuffix;
Namefully.prototype.inits = Namefully.prototype.getInitials;
Namefully.prototype.stats = Namefully.prototype.describe;
