/**
 * Welcome to namefully!
 *
 * namefully is a JS utility for handing person names.
 *
 * Sources
 * - repo: https://github.com/ralflorent/namefully
 * - docs: https://namefully.netlify.app
 * - npm: https://npmjs.com/package/namefully
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 * @license MIT
 */
import {
    Parser,
    NamaParser,
    StringParser,
    ArrayNameParser,
    ArrayStringParser,
    capitalize,
    decapitalize,
    toggleCase,
    generatePassword,
    allowShortNameType,
    allowShortNameOrder,
    CONFIG, RESTRICTED_CHARS
} from './core';
import {
    Fullname,
    Name,
    Nama,
    Namon,
    Separator,
    Summary,
    Config,
    NameOrder,
    NameType,
    LastnameFormat
} from './models';
import { FullnameValidator } from './validators';


/**
 * Person name handler
 * @class
 *
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
 * - namon: 1 piece of a name (e.g., firstname)
 * - nama: 2+ pieces of a name (e.g., firstname + lastname)
 *
 * Happy handling!
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
     * @param {string | string[] | Name[] | Nama} raw element to parse or
     * construct the pieces of the name
     * @param {Config} options to configure how to run the utility
     */
    constructor(
        raw: string | string[] | Name[] | Nama | Fullname,
        options?: Partial<Config>
    ) {
        // well, first thing first
        this.configure(options);

        // let's try to parse this, baby!
        this.build(raw);
    }

    /**
     * Gets the full name ordered as configured
     * @param {NameOrder} orderedBy force to order by first or last
     * name by overriding the preset configuration
     *
     * @see {format} to alter manually the order of appearance of the full name.
     * For example, ::format('l f m') outputs `lastname firstname middlename`.
     */
    getFullname(orderedBy?: NameOrder): string {
        orderedBy = this.parseNameOrder(orderedBy);

        const { titling, ending } = this.config;
        const pxSep = titling === 'us' ? Separator.PERIOD : Separator.EMPTY; // Mr[.]
        const sxSep = ending ? ',' : Separator.EMPTY; // [,] PhD
        const nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(Separator.EMPTY.concat(this.fullname.prefix, pxSep))

        if (orderedBy === 'firstname') {
            nama.push(this.getFirstname());
            nama.push(...this.getMiddlenames());
            nama.push(Separator.EMPTY.concat(this.getLastname(), sxSep));
        } else {
            nama.push(this.getLastname());
            nama.push(this.getFirstname());
            nama.push(this.getMiddlenames().join(Separator.SPACE).concat(sxSep));
        }

        if (this.fullname.suffix)
            nama.push(this.fullname.suffix);

        return nama.join(Separator.SPACE);
    }

    /**
     * Gets the birth name ordered as configured, no prefix or suffix
     * @param {NameOrder} orderedBy force to order by first or last
     * name by overriding the preset configuration
     */
    getBirthname(orderedBy?: NameOrder): string {
        orderedBy = this.parseNameOrder(orderedBy);
        const nama: string[] = [];

        if (orderedBy === 'firstname') {
            nama.push(this.getFirstname());
            nama.push(...this.getMiddlenames());
            nama.push(this.getLastname());
        } else {
            nama.push(this.getLastname());
            nama.push(this.getFirstname());
            nama.push(...this.getMiddlenames());
        }

        return nama.join(Separator.SPACE);
    }

    /**
     * Gets the first name part of the full name
     * @param {boolean} includeAll whether to include other pieces of the first
     * name
     */
    getFirstname(includeAll: boolean = true): string {
        return this.fullname.firstname.tostring(includeAll);
    }

    /**
     * Gets the last name part of the full name
     * @param {LastnameFormat} [format] overrides the how-to format of a surname
     * output, considering its subparts.
     */
    getLastname(format?: LastnameFormat): string {
        return this.fullname.lastname.tostring(format);
    }

    /**
     * Gets the middle names part of the full name
     */
    getMiddlenames(): string[] {
        return this.hasMiddlename() ? this.fullname.middlename.map(n => n.namon) : [];
    }

    /**
     * Gets the prefix part of the full name
     */
    getPrefix(): string {
        return this.fullname.prefix
            ? this.fullname.prefix.concat(
                this.config.titling === 'us'
                ? Separator.PERIOD
                : Separator.EMPTY
            ): Separator.EMPTY;
    }

    /**
     * Gets the suffix part of the full name
     */
    getSuffix(): string {
        return this.fullname.suffix || Separator.EMPTY;
    }

    /**
     * Gets the initials of the full name
     * @param {NameOrder} orderedBy force to order by first or last name by
     * overriding the preset configuration
     * @param {boolean} [withMid] whether to include middle names's
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
        orderedBy = this.parseNameOrder(orderedBy);
        const midInits = this.fullname.middlename ?
            this.fullname.middlename.map(n => n.getInitials()) : [];

        if (withMid && !this.hasMiddlename()) {
            console.warn('No initials for middle names since none was set.');
        }

        const initials = [];
        if (orderedBy === 'firstname') {
            initials.push(...this.fullname.firstname.getInitials());
            if (withMid) midInits.forEach(m => initials.push(...m));
            initials.push(...this.fullname.lastname.getInitials());
        } else {
            initials.push(...this.fullname.lastname.getInitials());
            initials.push(...this.fullname.firstname.getInitials());
            if (withMid) midInits.forEach(m => initials.push(...m));
        }

        return initials;
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @param what which variant to use when describe a name part
     *
     * Treated as a categorical dataset, the summary contains the following info:
     * `count` : the number of *unrestricted* characters of the name;
     * `frequency` : the highest frequency within the characters;
     * `top` : the character with the highest frequency;
     * `unique` : the count of unique characters of the name;
     * `distribution` : the characters' distribution.
     *
     * @example
     * Given the name "Thomas Alva Edison", the summary will output as follows:
     *
     * Descriptive statistics for "Thomas Alva Edison"
     *  count    : 16
     *  frequency: 3
     *  top      : A
     *  unique   : 12
     *  distribution: { T: 1, H: 1, O: 2, M: 1, A: 2, S: 2, ' ': 2, L: 1, V: 1,
     *  E: 1, D: 1, I: 1, N: 1 }
     *
     * **NOTE:**
     * During the setup, a set of restricted characters can be defined to be removed
     * from the stats. By default, the only restricted character is the `space`.
     * That is why the `count` for the example below result in `16` instead of
     * `16`.
     * Another thing to consider is that the summary is case *insensitive*. Note
     * that the letter `a` has the top frequency, be it `3`.
     */
    describe(what?: NameType): Summary {
        what = allowShortNameType(what)
        switch(what) {
            case 'firstname':
                return this.fullname.firstname.describe();
            case 'lastname':
                return this.fullname.lastname.describe();
            case 'middlename':
                if (!this.hasMiddlename()) {
                    console.warn('No Summary for middle names since none was set.');
                    return null;
                }
                return new Summary(
                    this.fullname.middlename
                        .map(n => n.namon)
                        .join(Separator.SPACE)
                );
            default:
                return this.summary;
        }
    }

    /**
     * Shortens a complex full name to a simple typical name, a combination of
     * first name and last name.
     * @param {NameOrder} orderedBy force to order by first or last
     * name by overriding the preset configuration
     *
     * @example
     * For a given name such as `Mr Keanu Charles Reeves`, shortening this name
     * is equivalent to making it `Keanu Reeves`.
     *
     * As a shortened name, the namon of the first name is favored over the other
     * names forming part of the entire first names, if any. Meanwhile, for
     * the last name, the configured `lastnameFormat` is prioritized.
     *
     * @example
     * For a given `Firstname Fathername Mothername`, shortening this name when
     * the lastnameFormat is set as `mother` is equivalent to making it:
     * `Firstname Mothername`.
     */
    shorten(orderedBy?: NameOrder): string {
        orderedBy = orderedBy || this.config.orderedBy; // override config
        const { firstname, lastname } = this.fullname;
        return orderedBy === 'firstname'
            ? [firstname.namon, lastname.tostring()].join(Separator.SPACE)
            : [lastname.tostring(), firstname.namon].join(Separator.SPACE);
    }

    /**
     * Compresses a name by using different forms of variants
     * @param {number} [limit] a threshold to limit the number of characters
     * @param {'firstname'|'lastname'|'middlename'|'firstmid'|'midlast'} [by]
     * a variant to use when compressing the long name. The last two variants
     * represent respectively the combination of `firstname + middlename` and
     * `middlename + lastname`.
     * @param {boolean} [warning] should warn when the set limit is violated
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
        by: 'fn' | 'ln'| 'mn' | 'fm' | 'ml' |
        'firstname' |  'lastname' | 'middlename' | 'firstmid' | 'midlast' = 'mn',
        warning: boolean = true
    ): string {
        if (this.getFullname().length <= limit) // no need to compress
            return this.getFullname();

        const { firstname: fn, lastname: ln, middlename } = this.fullname;
        const mn = this.getMiddlenames().join(Separator.SPACE);
        const hasmid: boolean = Array.isArray(middlename) && middlename.length > 0;
        const sep = Separator.PERIOD;

        const firsts = fn.getInitials().join(sep).concat(sep);
        const lasts = ln.getInitials().join(sep).concat(sep);
        const mids = hasmid
            ? middlename.map(n => n.getInitials()).join(sep).concat(sep)
            : Separator.EMPTY;
        let cname = '';

        if (this.config.orderedBy === 'firstname') {
            switch (by) {
                case 'firstname': case 'fn':
                    cname = hasmid ?
                        [firsts, mn, ln.tostring()].join(Separator.SPACE) :
                        [firsts, ln.tostring()].join(Separator.SPACE);
                        break;
                case 'lastname': case 'ln':
                    cname = hasmid ?
                        [fn.tostring(), mn, lasts].join(Separator.SPACE) :
                        [fn.tostring(), lasts].join(Separator.SPACE);
                        break;
                case 'middlename': case 'mn':
                    cname = hasmid ?
                        [fn.tostring(), mids, ln.tostring()].join(Separator.SPACE) :
                        [fn.tostring(), ln.tostring()].join(Separator.SPACE);
                        break;
                case 'firstmid': case 'fm':
                    cname = hasmid ?
                        [firsts, mids, ln.tostring()].join(Separator.SPACE) :
                        [firsts, ln.tostring()].join(Separator.SPACE);
                        break;
                case 'midlast': case 'ml':
                    cname = hasmid ?
                        [fn.tostring(), mids, lasts].join(Separator.SPACE) :
                        [fn.tostring(), lasts].join(Separator.SPACE);
                    break;
            }
        }
        else {
            switch (by) {
                case 'firstname': case 'fn':
                    cname = hasmid ?
                        [ln.tostring(), firsts, mn].join(Separator.SPACE) :
                        [ln.tostring(), firsts].join(Separator.SPACE);
                        break;
                    case 'lastname': case 'ln':
                    cname = hasmid ?
                        [lasts, fn.tostring(), mn].join(Separator.SPACE) :
                        [lasts, fn.tostring()].join(Separator.SPACE);
                        break;
                case 'middlename': case 'mn':
                    cname = hasmid ?
                        [ln.tostring(), fn.tostring(), mids].join(Separator.SPACE) :
                        [ln.tostring(), fn.tostring()].join(Separator.SPACE);
                        break;
                case 'firstmid': case 'fm':
                    cname = hasmid ?
                        [ln.tostring(), firsts, mids].join(Separator.SPACE) :
                        [ln.tostring(), firsts].join(Separator.SPACE);
                        break;
                case 'midlast': case 'ml':
                    cname = hasmid ?
                        [lasts, fn.tostring(), mids].join(Separator.SPACE) :
                        [lasts, fn.tostring()].join(Separator.SPACE);
                    break;
            }
        }

        if (warning && cname.length > limit)
            console.warn(`The compressed name <${cname}> still surpasses the set limit ${limit}`);

        return cname;
    }

    /**
     * Zips or compresses a name by using different forms of variants
     * @param by a variant to use when compressing the long name. The last two
     * variants represent respectively the combination of `firstname + middlename`
     * and `middlename + lastname`.
     */
    zip(
        by: 'fn' | 'ln'| 'mn' | 'fm' | 'ml' |
        'firstname' |  'lastname' | 'middlename' | 'firstmid' | 'midlast' = 'mn'
    ): string {
        let v: 'firstname' | 'lastname' | 'middlename' | 'firstmid' | 'midlast';
        if (by === 'fn' || by === 'firstname') v = 'firstname';
        if (by === 'mn' || by === 'middlename') v = 'middlename';
        if (by === 'ln' || by === 'lastname') v = 'lastname';
        if (by === 'fm' || by === 'firstmid') v = 'firstmid';
        if (by === 'ml' || by === 'midlast') v = 'midlast';
        return this.compress(0, v, false);
    }

    /**
     * Suggests possible (randomly) usernames closest to the name
     *
     * **NOTE**
     * The validity of these usernames are not checked against any social media
     * or web app online.
     */
    username(): string[] {
        const unames: string[] = [];
        const { firstname, lastname } = this.fullname;
        const p = Separator.PERIOD;
        const fn = firstname.tostring().toLowerCase();
        const ln = lastname.father.toLowerCase();

        // Given `John Smith`
        unames.push(fn + ln); // johnsmith
        unames.push(ln + fn); // smithjohn
        unames.push(fn[0] + ln); // jsmith
        unames.push(ln[0] + fn); // sjohn
        unames.push(fn[0] + p + ln); // j.smith
        unames.push(ln[0] + p + fn); // s.john
        unames.push(fn.slice(0, 2) + ln); // josmith
        unames.push(ln.slice(0, 2) + fn); // smjohn
        unames.push(fn.slice(0, 2) + p + ln); // jo.smith
        unames.push(ln.slice(0, 2) + p + fn); // sm.john

        return unames;
    }

    /**
     * Formats the name as desired
     * @param {string} how to format the full name
     *
     * How to format it?
     * string format
     * -------------
     * 'short': typical first + last name
     * 'long': birth name (without prefix and suffix)
     *
     * char format
     * -----------
     * 'b': birth name
     * 'B': capitalized birth name
     * 'f': first name
     * 'F': capitalized first name
     * 'l': last name (official)
     * 'L': capitalized last name
     * 'm': middle names
     * 'M': capitalized middle names
     * 'o': official document format
     * 'O': official document format in capital letters
     * 'p': prefix
     * 'P': capitalized prefix
     * 's': suffix
     * 'S': capitalized suffix
     *
     * punctuations
     * ------------
     * '.': period
     * ',': comma
     * ' ': space
     * '-': hyphen
     * '_': underscore
     *
     * @example
     * Given the name `Joe Jim Smith`, call the `format` with the how string.
     * - format('l f') => 'Smith Joe'
     * - format('L, f') => 'SMITH, Joe'
     * - format('short') => 'Joe Smith'
     * - format() => 'SMITH, Joe Jim'
     */
    format(how: string = 'official'): string {
        if (how === 'short') return this.shorten();
        if (how === 'long') return this.getBirthname();
        if (how === 'official') how = 'o';

        const formatted: string[] = [];
        const tokens = [
            '.', ',', ' ', '-', '_', 'b', 'B', 'f', 'F', 'l', 'L', 'm', 'M',
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
     * Returns the count of characters of the birth name, excluding punctuations
     */
    size(): number {
        return new Summary(this.getBirthname(), [...RESTRICTED_CHARS]).count;
    }

    /**
     * Returns an ascii representation of each characters of a name as specified
     * @param options use specifics to shape conversion
     */
    ascii(
        options: Partial<{
            nameType: NameType;
            exceptions: string[];
        }> = {}
    ): number[] {
        const { exceptions: restrictions } = options;
        const nameType = allowShortNameType(options.nameType);
        const { firstname, lastname, middlename } = this.fullname;
        switch(nameType) {
            case 'firstname':
                return firstname.ascii(restrictions);
            case 'lastname':
                return lastname.ascii(restrictions);
            case 'middlename':
                if (!this.hasMiddlename())
                    console.warn(`No ASCII conversion for middle names since none was set.`);
                return middlename
                    .map(n => n.ascii(restrictions)) // convert
                    .reduce((acc, value) => acc.concat(value), []); // then flatten
            default:
                const firsts = firstname.ascii(restrictions);
                const mids = middlename
                    .map(n => n.ascii(restrictions))
                    .reduce((acc, value) => acc.concat(value), []);
                const lasts = lastname.ascii(restrictions);
                if (this.config.orderedBy === 'firstname') {
                    return firsts.concat(mids, lasts);
                }
                return lasts.concat(firsts, mids);
        }
    }

    /**
     * Transforms a birth name to a specific case
     * @param case which case to convert a birth name to
     */
    to(
        _case: 'upper' | 'lower' | 'camel' | 'pascal' | 'snake' | 'hyphen' | 'dot' | 'toggle'
    ): string {
        const birthname = this.getBirthname();
        const nama = birthname
            .replace(/[' -]/g, Separator.SPACE)
            .split(Separator.SPACE);

        switch(_case) {
            case 'upper':
                return birthname.toUpperCase();
            case 'lower':
                return birthname.toLowerCase();
            case 'camel': case 'pascal':
                const pascalCase = nama.map(n => capitalize(n)).join(Separator.EMPTY);
                return _case === 'camel' ? decapitalize(pascalCase) : pascalCase;
            case 'snake':
                return nama.map(n => n.toLowerCase()).join(Separator.UNDERSCORE);
            case 'hyphen':
                return nama.map(n => n.toLowerCase()).join(Separator.HYPHEN);
            case 'dot':
                return nama.map(n => n.toLowerCase()).join(Separator.PERIOD);
            case 'toggle':
                return toggleCase(birthname);
            default:
                return Separator.EMPTY;
        }
    }

    /**
     * Returns a password-like representation of a name
     * @param {NameType} [what] which name part
     */
    passwd(what?: NameType): string {
        what = allowShortNameType(what);
        switch(what) {
            case 'firstname':
                return this.fullname.firstname.passwd();
            case 'lastname':
                return this.fullname.lastname.passwd();
            case 'middlename':
                if (!this.hasMiddlename())
                    console.warn('No password for middle names since none was set.');
                return this.fullname.middlename
                    .map(n => n.passwd())
                    .join(Separator.EMPTY);
            default:
                return generatePassword(this.getBirthname());
        }
    }

    private hasMiddlename(): boolean {
        return Array.isArray(this.fullname.middlename) && this.fullname.middlename.length > 0;
    }

    private configure(options?: Partial<Config>): void {
        // consider using deepmerge if objects no longer stay shallow
        this.config = { ...CONFIG, ...options }; // if options, it overrides CONFIG
        this.config.orderedBy = allowShortNameOrder(this.config.orderedBy);
    }

    private initialize<T>(parser: Parser<T>): void {
        const { orderedBy, separator, bypass, lastnameFormat } = this.config;
        this.fullname = parser.parse({ orderedBy, separator, bypass, lastnameFormat });
    }

    private parseNameOrder(orderedBy?: NameOrder): NameOrder {
        orderedBy = orderedBy || this.config.orderedBy; // override config
        return allowShortNameOrder(orderedBy);
    }

    private map(c: string): string {
        const { firstname, lastname, middlename, prefix, suffix } = this.fullname;

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
            case 'b':
                return this.getBirthname();
            case 'B':
                return this.getBirthname().toUpperCase();
            case 'f':
                return firstname.tostring();
            case 'F':
                return firstname.tostring().toUpperCase();
            case 'l':
                return lastname.tostring();
            case 'L':
                return lastname.tostring().toUpperCase();
            case 'm':
                if (!this.hasMiddlename()) {
                    console.warn('No formatting for middle names since none was set.');
                    return Separator.EMPTY;
                }
                return this.fullname.middlename.map(n => n.namon).join(Separator.SPACE);
            case 'M':
                if (!this.hasMiddlename()) {
                    console.warn('No formatting for middle names since none was set.');
                    return Separator.EMPTY;
                }
                return middlename.map(n => n.namon.toUpperCase()).join(Separator.SPACE);
            case 'o': case 'O':
                const { titling, ending } = this.config;
                const pxSep = titling === 'us' ? Separator.PERIOD : Separator.EMPTY;
                const sxSep = ending ? ',' : Separator.EMPTY;

                const nama: string[] = [];
                if (prefix)
                    nama.push(prefix.concat(pxSep));
                nama.push(lastname.tostring().concat(Separator.COMMA).toUpperCase());
                if (this.hasMiddlename()) {
                    nama.push(firstname.tostring());
                    nama.push(middlename.map(n => n.namon).join(Separator.SPACE).concat(sxSep));
                } else {
                    nama.push(firstname.tostring().concat(sxSep));
                }
                nama.push(suffix || Separator.EMPTY);

                const official = nama.join(Separator.SPACE).trim();
                return c === 'o' ? official : official.toUpperCase();
            case 'p':
                return prefix || Separator.EMPTY;
            case 'P':
                return prefix ? prefix.toUpperCase() : Separator.EMPTY;
            case 's':
                return suffix || Separator.EMPTY;
            case 'S':
                return suffix ? suffix.toUpperCase() : Separator.EMPTY;
        }
    }

    private build(raw: string | string[] | Name[] | Nama | Fullname): void {
        if (this.config.parser) {
            this.initialize(this.config.parser);
        } else if (typeof raw === 'string') { // check for string type
            this.initialize(new StringParser(raw));
        } else if (Array.isArray(raw) && raw.length) { // check for T[]
            if (typeof raw[0] === 'string') { // check for string[]
                for (const key of raw as string[])
                    if (typeof key !== 'string')
                        throw new Error(`Cannot parse raw data as array of 'string'`);
                this.initialize(new ArrayStringParser(raw as string[]))
            } else if (raw[0] instanceof Name) { // check for Name[]
                for (const obj of raw as string[])
                    if (!(obj as any instanceof Name))
                        throw new Error(`Cannot parse raw data as array of 'Name'`);
                this.initialize(new ArrayNameParser(raw as Name[]));
            } else {
                // typescript should stop them, but let's be paranoid (for JS developers)
                throw new Error(
                    `Cannot parse raw data as arrays that are not of 'Name' or string`
                );
            }
        } else if (raw instanceof Object) { // check for json object
            for (const [key, value] of Object.entries(raw)) { // make sure keys are correct
                if (['firstname', 'lastname', 'middlename', 'prefix', 'suffix'].indexOf(key) === -1)
                    throw new Error(
                        `Cannot parse raw data as json object that does not contains keys of` +
                        `'${Object.keys(Namon)}'`
                    );

                // make sure the values are proper string or object
                if (typeof value !== 'string' && typeof value !== 'object')
                    throw new Error(
                        `Cannot parse raw data. The key <${key}> should be a 'string|object' type`
                    );
            }
            if (typeof (<Nama>raw)['firstname'] === 'string') // this key must always exist
                this.initialize(new NamaParser(raw as Nama));
            else
                this.fullname = raw as Fullname;
        } else {
            // typescript should stop them, but let's be paranoid again (for JS developers)
            throw new Error(`Cannot parse raw data. Review the data type expected.`);
        }
        // paranoid coder mode: on :P
        if (!this.config.bypass) new FullnameValidator().validate(this.fullname);
        this.summary = new Summary(this.getFullname());
    }
}

/**
 * Aliases for `Namefully`
 */
export interface Namefully {
    full: typeof Namefully.prototype.getFullname;
    birth: typeof Namefully.prototype.getBirthname;
    fn: typeof Namefully.prototype.getFirstname;
    ln: typeof Namefully.prototype.getLastname;
    mn: typeof Namefully.prototype.getMiddlenames;
    px: typeof Namefully.prototype.getPrefix;
    sx: typeof Namefully.prototype.getSuffix;
    inits: typeof Namefully.prototype.getInitials;
    stats: typeof Namefully.prototype.describe;
}

Namefully.prototype.full = Namefully.prototype.getFullname;
Namefully.prototype.birth = Namefully.prototype.getBirthname;
Namefully.prototype.fn = Namefully.prototype.getFirstname;
Namefully.prototype.ln = Namefully.prototype.getLastname;
Namefully.prototype.mn = Namefully.prototype.getMiddlenames;
Namefully.prototype.px = Namefully.prototype.getPrefix;
Namefully.prototype.sx =  Namefully.prototype.getSuffix;
Namefully.prototype.inits = Namefully.prototype.getInitials;
Namefully.prototype.stats = Namefully.prototype.describe;
