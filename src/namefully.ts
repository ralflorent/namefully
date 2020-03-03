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
        private by: Namon.FIRST_NAME | Namon.LAST_NAME = Namon.FIRST_NAME
    ) {
        this.parse();
    }

    getFullname(): string {
        let nama: string[] = [];

        if (this.fullname.prefix)
            nama.push(this.fullname.prefix)

        switch(this.by) {
            case 'firstname':
                nama.push(this.getFirstname());
                nama.push(this.getLastname());
                break;
            case 'lastname':
                nama.push(this.getLastname());
                nama.push(this.getFirstname());
                break;
        }

        if (this.fullname.suffix)
            nama.push(this.fullname.suffix)

        return nama.join(Separator.SPACE);
    }

    getFirstname(): string {
        let nama: string[] = [this.fullname.firstname.first];
        if (this.fullname.firstname.second)
            nama.push(this.fullname.firstname.second)
        return nama.join(Separator.SPACE);
    }

    getLastname(): string {
        let nama: string[] = [this.fullname.lastname.father];
        if (this.fullname.lastname.mother)
            nama.push(this.fullname.lastname.mother)
        return nama.join(Separator.SPACE);
    }

    describe(): string {
        return this.stats.tostring();
    }

    initials(): string[] {
        const initials = [];
        initials.push(this.getFirstname(), this.getLastname());
        return initials;
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
        const splitnames = this.rawstring.split(' ');
        const lastname = this.capitalize(splitnames.pop());
        const firstname = this.capitalize(splitnames[0]);

        const fullname = [];
        if (this.by = Namon.FIRST_NAME) {
            fullname.push(firstname, lastname);
        } else {
            fullname.push(lastname, firstname);
        }
        this.fullname = {
            firstname: {
                first: firstname
            },
            lastname: {
                father: lastname
            }
        }
        this.stats = new Summary(fullname.join(Separator.SPACE));
    }

    private capitalize(namon: string): string {
        return ''.concat(namon[0].toUpperCase(), namon.slice(1, namon.length));
    }
}

enum Namon {
    LAST_NAME = 'lastname',
    FIRST_NAME = 'firstname',
    MIDDLE_NAME = 'middlename',
    PREFIX = 'prefix',
    SUFFIX = 'suffix',
    NICKNAME = 'nickname'
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

interface Fullname {
    firstname: Firstname;
    lastname: Lastname;
    middlename?: string[];
    prefix?: Prefix;
    suffix?: Suffix;
    nickname?: string;
}

interface Firstname {
    first: string;
    second?: string;
}

interface Lastname {
    father: string;
    mother?: string;
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
