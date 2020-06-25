/**
 * Constants
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator, Config, NameIndex } from '../models/index';

/**
 * The current version of `Namefully`.
 * @constant
 */
export const version = '1.0.9';

/**
 * CONFIG
 * @constant
 * @type {Config}
 * @default
 */
export const CONFIG: Config = {
    orderedBy: 'firstname',
    separator: Separator.SPACE,
    titling: 'uk', // no period
    ending: Separator.SPACE,
    bypass: false,
    lastnameFormat: 'father',
} as const

/**
 * NAME_INDEX
 * @constant
 * @type {NameIndex}
 * @default
 */
export const NAME_INDEX: NameIndex = {
    prefix: 0,
    firstname: 1,
    middlename: 2,
    lastname: 3,
    suffix: 4,
} as const

/**
 * RESTRICTED_CHARS
 * @constant
 * @default
 */
export const RESTRICTED_CHARS = [
    Separator.SPACE,
    Separator.SINGLE_QUOTE,
    Separator.HYPHEN
] as const
