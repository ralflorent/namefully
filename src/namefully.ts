/**
 * `Namefully` name handler
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
    fullname: string;
    firstname: string;
    lastname: string;

    private stats: Summary;

    constructor(private rawstring: string) {
        this.parse(rawstring);
    }

    describe(): string {
        return this.stats.tostring();
    }

    initials(): string[] {
        const initials = [];
        initials.push(this.firstname[0], this.lastname[0]);
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

    private parse(name: string): void {
        const splitnames = name.split(' ');
        this.lastname = this.capitalize(splitnames.pop());
        this.firstname = this.capitalize(splitnames[0]);

        this.fullname = `${this.lastname}, ${this.firstname}`;
        this.stats = new Summary(this.fullname);
    }

    private capitalize(namon: string): string {
        return ''.concat(namon[0].toUpperCase(), namon.slice(1, namon.length));
    }
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
