/**
 * Constants
 *
 * Created on March 07, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Separator, Config } from '../models';

/**
 * The current version of `Namefully`.
 * @constant
 */
export const version: string = '1.0.0';

/**
 * CONFIG type definition
 * @constant
 * @type {Config}
 * @default
 */
export const CONFIG: Config = {
    orderedBy: Namon.FIRST_NAME,
    separator: Separator.SPACE,
}