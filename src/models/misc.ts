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
 * Defines the distinct formats to output a surname
 * @typedef LastnameFormat
 */
export type LastnameFormat = 'father' | 'mother' | 'hyphenated' | 'all';

/**
 * Defines the ways the international community defines a title
 *
 * American and Canadian English follow slightly different rules for abbreviated
 * titles than British and Australian English. In North American English, titles
 * before a name require a period: `Mr., Mrs., Ms., Dr.` In British and Australian
 * English, no full stops are used in these abbreviations.
 * @typedef AbbrTitle
 */
export type AbbrTitle = 'us' | 'uk';

/**
 * Interface for JSON signature that represents the configuration of the utility
 * @interface
 */
export interface Config {
    orderedBy: NameOrder;
    separator: Separator; // how to split names
    titling: AbbrTitle, // whether to add period to a prefix
    ending: Separator; // ending suffix
    bypass: boolean; // bypass the validation rules
    parser?: Parser<any>; // (user-defined) custom parser
    lastnameFormat?: LastnameFormat; // how to format a surname
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
 * @interface Indexing represents the JSON signature for indexing name parts
 */
interface Indexing<T> {
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
export interface NameIndex extends Indexing<number> {}
