/**
 * A `Validator` contract
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Interface for a JSON signature that represents a generic validator
 * @interface
 */
export interface Validator<T> {
    validate(value: T): void;
}
