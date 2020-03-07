/**
 * Miscellaneous contents
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Parser } from '../core/index';
import {
    Name,
    Firstname,
    Lastname,
    Prefix,
    Suffix,
    Separator,
    Namon
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
    orderedBy: Namon;
    separator: Separator; // ending suffix
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