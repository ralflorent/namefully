/**
 * Miscellaneous contents
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Parser } from '../core/index';
import { Name, Firstname, Lastname, Prefix, Suffix, Separator } from './index';

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
}

/**
 * Defines the two ways that a full name can be ordered: first or last name
 * @typedef NameOrder
 */
export type NameOrder = 'firstname' | 'lastname';

/**
 * Interface for JSON signature that represents the configuration of the utility
 * @interface
 */
export interface Config {
    orderedBy: NameOrder;
    separator: Separator; // how to split names
    ending: Separator; // ending suffix
    bypass: boolean; // bypass the validation rules
    parser?: Parser<any>; // (user-defined) custom parser
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
