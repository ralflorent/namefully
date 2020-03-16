/**
 * Miscellaneous contents
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Parser, NAME_INDEX } from '@core/index';
import {
    Name,
    Firstname,
    Lastname,
    Prefix,
    Suffix,
    Separator,
} from './index';

/**
 * Interface for JSON signature that represents the full name
 * @interface
 */
export interface Fullname {
    firstname: Firstname;
    lastname: Lastname;
    middlename?: Name[];
    prefix?: Prefix;
    suffix?: Suffix;
    // nickname?: Name;
}

/**
 * Interface for JSON signature that represents the configuration of the utility
 * @interface
 */
export interface Config {
    orderedBy: 'firstname' | 'lastname';
    separator: Separator; // how to split names
    ending: Separator; // ending suffix
    parser?: Parser<string>; // (user-defined) custom parser
}

/**
 * @interface Nama represents the JSON signature for the `NamaParser`
 */
export interface Nama {
    prefix?: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    suffix?: string;
    // nickname?: string;
}

/**
 * @interface Index represents the JSON signature for indexing name parts
 */
interface Index<T> {
    prefix: T;
    firstname: T;
    middlename: T;
    lastname: T;
    suffix: T;
}

/**
 * @interface NameIndex represents the JSON signature for indexing name parts
 * using numbered index
 * @extends Index<number>
 */
export interface NameIndex extends Index<number> {}

export function organizeNameIndex(
    orderedBy: 'firstname' | 'lastname',
    argLength: number,
    nameIndex: NameIndex = NAME_INDEX
): NameIndex {
    const out: NameIndex = { ...nameIndex };

    if (orderedBy === 'firstname') {
        switch(argLength) {
            case 2: // first name + last name
                out.firstname = 0;
                out.lastname = 1;
                break;
            case 3: // first name + middle name + last name
                out.firstname = 0;
                out.middlename = 1;
                out.lastname = 2;
                break;
            case 4: // prefix + first name + middle name + last name
                out.prefix = 0;
                out.firstname = 1;
                out.middlename = 2;
                out.lastname = 3;
                break;
            case 5: // prefix + first name + middle name + last name + suffix
                out.prefix = 0;
                out.firstname = 1;
                out.middlename = 2;
                out.lastname = 3;
                out.suffix = 4;
                break;
        }
    }
    else {
        switch(argLength) {
            case 2: // last name + first name
                out.lastname = 0;
                out.firstname = 1;
                break;
            case 3: // last name + first name + middle name
                out.lastname = 0;
                out.firstname = 1;
                out.middlename = 2;
                break;
            case 4: // prefix + last name + first name + middle name
                out.prefix = 0;
                out.lastname = 1;
                out.firstname = 2;
                out.middlename = 3;
                break;
            case 5: // prefix + last name + first name + middle name + suffix
                out.prefix = 0;
                out.lastname = 1;
                out.firstname = 2;
                out.middlename = 3;
                out.suffix = 4;
                break;
        }
    }
    return out;
}
