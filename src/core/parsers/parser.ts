/**
 * A `Parser` contract
 *
 * Created on March 15, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Fullname } from '@models/index';


/**
 * Interface for JSON signature that represents a generic parser
 * @interface
 */
export interface Parser<T> {
    /**
     * raw data to be parsed
     * @type {T}
     */
    raw: T;

    /**
     * Parses the raw data into a full name
     * @returns {Fullname}
     */
    parse(): Fullname;
}
