/**
 * Constants
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator, Config, NameIndex } from '../models/index';
import { CharSet } from './core';

/**
 * The current version of `Namefully`.
 * @constant
 */
export const version = '1.1.0'

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
    ending: false,
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

export const FIRST_LAST_NAME_INDEX = 2
export const LAST_FIRST_NAME_INDEX = 2
export const FIRST_MIDDLE_LAST_NAME_INDEX = 3
export const LAST_FIRST_MIDDLE_NAME_INDEX = 3
export const PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX = 4
export const PREFIX_LAST_FIRST_MIDDLE_NAME_INDEX = 4
export const PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX = 5
export const PREFIX_LAST_FIRST_MIDDLE_SUFFIX_NAME_INDEX = 5

export const MIN_NUMBER_NAME_PART = 2
export const MAX_NUMBER_NAME_PART = 5

/**
 * RESTRICTED_CHARS
 * @constant
 * @default
 */
export const RESTRICTED_CHARS = [
    Separator.SPACE,
    Separator.SINGLE_QUOTE,
    Separator.HYPHEN,
    Separator.PERIOD,
    Separator.COMMA,
] as const

/**
 * PASSWORD_MAPPER
 * @constant
 */
export const PASSWORD_MAPPER = new Map([
    [ 'a', new CharSet(['a', 'A', '@', '4']) ],
    [ 'b', new CharSet(['b', 'B', '6', '|)', '|3', '|>']) ],
    [ 'c', new CharSet(['c', 'C', '(', '<']) ],
    [ 'd', new CharSet(['d', 'D', '(|', '<|']) ],
    [ 'e', new CharSet(['e', 'E', '3', '*']) ],
    [ 'f', new CharSet(['f', 'F', '7', '(-']) ],
    [ 'g', new CharSet(['g', 'G', '8', '&', '**']) ],
    [ 'h', new CharSet(['h', 'H', '#', '|-|']) ],
    [ 'i', new CharSet(['i', 'I', '!', '1', '|', '--']) ],
    [ 'j', new CharSet(['j', 'J', ')', '1']) ],
    [ 'k', new CharSet(['k', 'K', '%', '|<']) ],
    [ 'l', new CharSet(['l', 'L', '1', '!', '|_']) ],
    [ 'm', new CharSet(['m', 'M', '^^', '>>']) ],
    [ 'n', new CharSet(['n', 'N', '!=', '++']) ],
    [ 'o', new CharSet(['o', 'O', '0', '.', '*']) ],
    [ 'p', new CharSet(['p', 'P', '|3', '|)', '|>']) ],
    [ 'q', new CharSet(['q', 'Q', '&', '9', '<|']) ],
    [ 'r', new CharSet(['r', 'R', '7', '&']) ],
    [ 's', new CharSet(['s', 'S', '5', '$']) ],
    [ 't', new CharSet(['t', 'T', '7', '[']) ],
    [ 'u', new CharSet(['u', 'U', '|_|', 'v']) ],
    [ 'v', new CharSet(['v', 'V', '>', '<', '^']) ],
    [ 'w', new CharSet(['w', 'W', '[|]', 'vv']) ],
    [ 'x', new CharSet(['x', 'X', '%', '#']) ],
    [ 'z', new CharSet(['z', 'Z', '2', '!=']) ],
    [ '$', new CharSet([
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '[',
        '_', '=', '{', '}', ':', ';', ',', '.', '<', '>', '|', '~', ']',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ])],
])
