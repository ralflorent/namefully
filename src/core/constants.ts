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
export const version = '1.0.6';

/**
 * CONFIG constant
 * @constant
 * @type {Config}
 * @default
 */
export const CONFIG: Config = {
    orderedBy: 'firstname',
    separator: Separator.SPACE,
    ending: Separator.SPACE,
    bypass: false,
}

/**
 * NAME_INDEX constant
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
}
