/**
 * Miscellaneous types
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Parser } from '../core/parsers';
import { Separator } from './enums';

/**
 * Defines the two ways that a full name can be ordered by: first or last name
 * @typedef NameOrder
 */
export type NameOrder = 'firstname' | 'fn' | 'lastname' | 'ln';

/**
 * Defines the three parts that a birth name
 * @typedef NameType
 */
export type NameType = 'firstname' | 'fn' | 'lastname' | 'ln' | 'middlename' | 'mn';

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
    /**
     * The order of appearance of a full name: by first name or last name
     */
    orderedBy: NameOrder;
    /**
     * For literal string input, this is the parameter used to indicate the token
     * to utilize to split the string names.
     */
    separator: Separator;
    /**
     * Whether or not to add period to a prefix using the American or British way.
     */
    titling: AbbrTitle,
    /**
     * Indicates if the ending suffix should be separated with a comma or space.
     */
    ending: boolean;
    /**
     * Bypass the validation rules with this option. Since we only provide a
     * handful of suffixes or prefixes in English, this parameter is ideal to
     * avoid checking their validity.
     */
    bypass: boolean;
    /**
     * Custom parser, a user-defined parser indicating how the name set is
     * organized. Namefully cannot guess it.
     */
    parser?: Parser<any>;
    /**
     * how to format a surname:
     * - 'father' (father name only)
     * - 'mother' (mother name only)
     * - 'hyphenated' (joining both father and mother names with a hyphen)
     * - 'all' (joining both father and mother names with a space).
     *
     * This parameter can be set either by an instance of a last name or during
     * the creation of a namefully instance. To avoid ambiguity, we prioritize as
     * source of truth the value set as optional parameter when instantiating
     * namefully.
     */
    lastnameFormat?: LastnameFormat;
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
 * @typedef NameIndex represents the JSON signature for indexing name parts
 * using numbered index.
 */
export type NameIndex = Indexing<number>;
