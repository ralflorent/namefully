/**
 * Core contents
 *
 * Created on June 30, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Extends `Set` functionalities by shuffling the set values and return one
 */
export class CharSet<T> extends Set<T> {
    random(): T {
        return Array.from(this)[Math.floor(Math.random() * this.size)];
    }
}

/**
 * Extends `Array` functionalities
 */
export class CharArray<T> extends Array<T> {

}
