/**
 * `Namefully` person name handler
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

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
 * The current version of `Namefully`.
 */
export const version: string = '1.0.0';

export enum Namon {
    LAST_NAME = 'lastname',
    FIRST_NAME = 'firstname',
    MIDDLE_NAME = 'middlename',
    PREFIX = 'prefix',
    SUFFIX = 'suffix',
    NICK_NAME = 'nickname',
    MONO_NAME = 'mononame'
}

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

    constructor(
        private raw: string | string[] | {} | Name | Fullname,
        private options?: Partial<{
            orderedBy: Namon,
            separator: Separator // for ending suffix
        }>
    ) {
        this.configure(options);
        if (typeof raw === 'string') {
            this.initialize(raw, new StringParser());
        } else if ( raw instanceof Name ) {
            this.initialize(raw, new NameParser());
        } else {
            this.initialize(raw, new FullnameParser());
        }
        this.stats = new Summary(this.getFullname());
    }

    getFullname(): string {
        const nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(this.fullname.prefix)

        switch(this.config.orderedBy) {
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
                this.fullname.suffix
            ;
            nama.push(suffix);
        }

        return nama.join(Separator.SPACE);
    }

    getFirstname(): string {
        return this.fullname.firstname.tostring();
    }

    getLastname(): string {
        return this.fullname.lastname.tostring();
    }

    getMiddlenames(): string[] {
        return this.fullname.middlename ?
            this.fullname.middlename.map(n => n.namon) :
            []
        ;
    }

    getNickname(): string {
        return this.fullname.nickname ?
            this.fullname.nickname.namon :
            Separator.EMPTY
        ;
    }

    getPrefix(): string {
        return this.fullname.prefix ?
            this.fullname.prefix :
            Separator.EMPTY
        ;
    }

    getSuffix(): string {
        return this.fullname.suffix ?
            this.fullname.suffix :
            Separator.EMPTY
        ;
    }

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

    describe(): string {
        return this.stats.tostring();
    }

    shorten(): string {
        throw new Error('Not implemented yet');
    }

    compress(): string {
        throw new Error('Not implemented yet');
    }

    unicode(): string {
        throw new Error('Not implemented yet');
    }

    intl(): string {
        throw new Error('Not implemented yet');
    }

    username(): string {
        throw new Error('Not implemented yet');
    }

    root(): string {
        throw new Error('Not implemented yet');
    }

    format(): string {
        throw new Error('Not implemented yet');
    }

    private configure(options?: Partial<{
        orderedBy: Namon,
        separator: Separator
    }>): void {
        // consider using deepmerge if objects no longer stay shallow
        this.config = {...CONFIG, ...options}; // if options, it overrides CONFIG
    }

    private initialize<T>(sth: T, parser: Parser<T>): void {
        this.fullname = parser.parse(sth);
    }
}

export class Name {

    private initial: string;
    private body: string;

    constructor(public namon: string, public type: Namon) {
        this.initial = namon[0];
        this.body = namon.slice(1, namon.length);
    }

    describe(): Summary {
        return new Summary(this.namon);
    }

    getInitials(): string[] {
        return [this.initial];
    }

    protected capitalize(option: 'initial' | 'all' = 'initial'): void {
        if (option === 'initial') {
            this.initial = this.initial.toUpperCase();
            this.namon = this.initial.concat(this.body);
        } else  {
            this.namon = this.namon.toUpperCase();
        }
    }
}

export class Firstname extends Name {

    constructor(public namon: string, public more?: string[]) {
        super(namon, Namon.FIRST_NAME);
    }

    describe(): Summary {
        return new Summary(this.tostring());
    }

    tostring(includeAll: boolean = false): string {
        return !includeAll ?
            this.namon :
            this.namon.concat(
                Separator.SPACE,
                this.more.join(Separator.SPACE)
            );
    }

    getInitials(): string[] {
        const initials: string[] = [this.namon[0]];
        if (Array.isArray(this.more) && this.more.length) {
            initials.push(...this.more);
        }
        return initials;
    }
}

export class Lastname extends Name {

    constructor(public father: string, public mother?: string, hyphenated: boolean = false) {
        super(father, Namon.LAST_NAME);
    }

    describe(): Summary {
        return new Summary(this.tostring());
    }

    tostring(includeAll: boolean = false): string {
        return !includeAll ?
            this.father :
            this.mother ?
                this.father.concat(Separator.SPACE, this.mother) :
                this.father
        ;
    }

    getInitials(): string[] {
        const initials: string[] = [this.father[0]];
        if (!!this.mother && this.mother.length) {
            initials.push(this.mother[0]);
        }
        return initials;
    }
}

export interface Parser<T> {
    parse(value: T): Fullname;
}

export class StringParser implements Parser<string> {

    parse(str: string): Fullname {
        let fullname: Fullname;
        // dummy implementation to test the parsing
        // assuming this: 'Firstname [Middlename] [Lastname]'
        const nama = str.split(Separator.SPACE);
        const firstname = nama[0];
        const middlenames: Array<string> = [];
        let lastname = nama.pop();

        if (nama.length > 1)
            middlenames.push(...nama.slice(1, nama.length));

        // TODO: some validators are needed here (use of regex)

        return {
            firstname: new Firstname(firstname),
            lastname: new Lastname(lastname),
            middlename: middlenames.map(n => new Name(n, Namon.MIDDLE_NAME)),
        };
    }
}

export class FullnameParser implements Parser<Fullname> {

    parse(fullname: Fullname): Fullname {
        throw new Error('Not implemeted yet');
    }
}

export class NameParser implements Parser<Name> {

    parse(name: Name): Fullname {
        throw new Error('Not implemeted yet');
    }
}

export interface Fullname {
    firstname: Firstname;
    lastname: Lastname;
    middlename?: Name[];
    prefix?: Prefix;
    suffix?: Suffix;
    nickname?: Name;
}

/**
 * ASCII characters
 */
export enum Separator {
    EMPTY = '',
    SPACE = ' ',
    COMMA = ',',
    PERIOD = '.',
    HYPHEN = '-',
    UNDERSCORE = '_',
    APOSTROPHE = `'`,
}

export enum Prefix {
    FIRT_LIEUTENANT = '1st Lt',
    ADMIRAL = 'Adm',
    ATTORNEY = 'Atty',
    BROTHER = 'Brother', // Religious
    CAPTAIN = 'Capt',
    CHIEF = 'Chief',
    COMMANDER = 'Cmdr',
    COLONEL = 'Col',
    UNI_DEAN = 'Dean',
    DOCTOR = 'Dr',
    ELDER = 'Elder', // Religious
    FATHER = 'Father', // Religious
    GENERAL = 'Gen',
    HONORABLE = 'Hon',
    LIEUTENANT_COLONEL = 'Lt Col',
    MAJOR = 'Maj',
    MASTER_SERGEANT = 'MSgt',
    MISTER = 'Mr',
    MARRIED_WOMAN = 'Mrs',
    SINGLE_WOMAN = 'Ms',
    PRINCE = 'Prince',
    PROFESSOR = 'Prof',
    RABBI = 'Rabbi', // Religious
    REVEREND = 'Rev', // Religious
    SISTER = 'Sister'
}

export enum Suffix {
    THE_SECOND = 'II',
    THE_THIRD = 'III',
    THE_FOURTH = 'IV',
    CERT_PUB_ACCOUNTANT = 'CPA',
    DOCTOR_DENTAL_MED = 'DDS',
    ESQUIRE = 'Esq',
    JURIST_DOCTOR = 'JD',
    JUNIOR = 'Jr',
    DOCTOR_OF_LAWS = 'LLD',
    DOCTORATE = 'PhD',
    RETIRED_ARMED_FORCES = 'Ret',
    REGISTERED_NURSE = 'RN',
    SENIOR = 'Sr',
    DOCTOR_OF_OSTEO = 'DO'
}

export class Summary {
    count: number;
    frequency: number;
    top: string;
    unique: number;

    constructor(private namon: string, restrictions: string[] = [Separator.SPACE]) {
        this.compute(restrictions);
    }

    tostring(): string {
        return Separator.EMPTY.concat(
            `Descriptive statistics for "${this.namon}" \n`,
            `count    : ${this.count} \n`,
            `frequency: ${this.frequency} \n`,
            `top      : ${this.top} \n`,
            `unique   : ${this.unique} \n`
        );
    }

    private compute(restrictions: string[] = []): void {
        // compute stats for the string
        let count = 0, maxfreq = 0, uniq = 0, top = '';
        const freqs = this.groupByChar();

        for (const char in freqs) {
            if (restrictions.indexOf(char) === -1) {
                count += freqs[char];
                if (freqs[char] >= maxfreq) {
                    maxfreq = freqs[char];
                    top = char;
                }
                uniq++;
            }
        }

        this.count = count;
        this.frequency = maxfreq;
        this.top = top;
        this.unique = uniq;
    }

    private groupByChar(): any {
        const frequencies: { [key: string]: number } = {};
        for (let char of this.namon.toUpperCase())
            if (Object.keys(frequencies).includes(char))
                frequencies[char] += 1;
            else
                frequencies[char] = 1;
        return frequencies;
    }
}

interface Config {
    orderedBy: Namon;
    separator: Separator;
}

const CONFIG: Config = {
    orderedBy: Namon.FIRST_NAME,
    separator: Separator.SPACE,
}
