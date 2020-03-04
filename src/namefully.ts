/**
 * `Namefully` person name handler
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

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

    constructor(
        private rawstring: string,
        private orderedBy: Namon.FIRST_NAME | Namon.LAST_NAME = Namon.FIRST_NAME,
        private separator: Separator = Separator.SPACE // for ending suffix
    ) {
        this.parse();
    }

    getFullname(): string {
        const nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(this.fullname.prefix)

        switch(this.orderedBy) {
            case Namon.FIRST_NAME:
                nama.push(this.getFirstname());
                nama.push(this.getLastname());
                break;
            case Namon.LAST_NAME:
                nama.push(this.getLastname());
                nama.push(this.getFirstname());
                break;
        }

        if (this.fullname.suffix) {
            const suffix = this.separator !== Separator.SPACE ?
                `${this.separator} ${this.fullname.suffix}` : // => ', PhD'
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
        const initials = [];
        if (this.orderedBy = Namon.FIRST_NAME) {
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

    private parse(): void {
        const splitnames = this.rawstring.split(Separator.SPACE);
        const lastname = this.capitalize(splitnames.pop());
        const firstname = this.capitalize(splitnames[0]);

        const fullname = [];
        if (this.orderedBy === Namon.FIRST_NAME) {
            fullname.push(firstname, lastname);
        } else {
            fullname.push(lastname, firstname);
        }
        this.fullname = {
            firstname: new Firstname(firstname),
            lastname: new Lastname(lastname)
        }
        this.stats = new Summary(fullname.join(Separator.SPACE));
    }

    private capitalize(namon: string): string {
        return Separator.EMPTY.concat(
            namon[0].toUpperCase(), // TODO: check toLocaleUppercase when include unicode | intl
            namon.slice(1, namon.length)
        );
    }
}

abstract class Name {

    private initial: string;
    private body: string;

    constructor(public namon: string, public type: Namon) {
        this.initial = namon[0];
        this.body = namon.slice(1, namon.length);
    }

    abstract describe(): Summary;

    abstract tostring(includeAll: boolean): string;

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

class Firstname extends Name {

    constructor(public namon: string, public more?: string[]) {
        super(namon, Namon.FIRST_NAME);
    }

    describe(): Summary {
        throw new Error('Not implemented yet');
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

class Lastname extends Name {

    constructor(public father: string, public mother?: string, hyphenated: boolean = false) {
        super(father, Namon.LAST_NAME);
    }

    describe(): Summary {
        throw new Error('Not implemented yet');
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

interface Fullname {
    firstname: Firstname;
    lastname: Lastname;
    middlename?: Name[];
    prefix?: Prefix;
    suffix?: Suffix;
    nickname?: Name;
}

enum Namon {
    LAST_NAME = 'lastname',
    FIRST_NAME = 'firstname',
    MIDDLE_NAME = 'middlename',
    PREFIX = 'prefix',
    SUFFIX = 'suffix',
    NICK_NAME = 'nickname',
    MONO_NAME = 'mononame'
}

/**
 * ASCII characters
 */
enum Separator {
    EMPTY = '',
    SPACE = ' ',
    COMMA = ',',
    PERIOD = '.',
    HYPHEN = '-',
    UNDERSCORE = '_',
    APOSTROPHE = `'`,
}

enum Prefix {
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

enum Suffix {
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

class Summary {
    count: number;
    frequency: number;
    top: string;
    unique: number;

    constructor(private namon: string) {
        this.compute();
    }

    tostring(): string {
        return `
Descriptive statistics of the name "${this.namon}":
    count    : ${this.count}
    frequency: ${this.frequency}
    top      : '${this.top}'
    unique   : ${this.unique}`;
    }

    tojson(): object {
        return {
            count: this.count,
            frequency: this.frequency,
            top: this.top,
            unique: this.unique,
        }
    }

    private compute(): void {
        // compute stats for the string
        this.count = this.namon.length;
        // dummy values
        this.frequency = 5;
        this.top = 'I';
        this.unique = 3;
    }
}
