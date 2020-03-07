/**
 * Name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Summary, Namon } from './index';

/**
 * Represents a namon with some extra functionalities
 * @class
 * @see {@link Namon} interface to understand the concept of namon/nama.
 */
export class Name {

    private initial: string;
    private body: string;

    /**
     * Constructs a `Name`
     * @param namon a piece of string that will be defined as a namon
     * @param type which namon that is
     */
    constructor(public namon: string, public type: Namon) {
        this.initial = namon[0];
        this.body = namon.slice(1, namon.length);
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @see {@link describe} in `Namefully` class for further information
     */
    describe(): Summary {
        return new Summary(this.namon);
    }

    /**
     * Gets the initials of the name
     * @returns {Array<string>} the initials
     */
    getInitials(): string[] {
        return [this.initial];
    }

    /**
     * Capitalizes a name
     * @param {'initial' | 'all'} option how to capitalize it
     */
    protected capitalize(option: 'initial' | 'all' = 'initial'): void {
        if (option === 'initial') {
            this.initial = this.initial.toUpperCase();
            this.namon = this.initial.concat(this.body);
        } else {
            this.namon = this.namon.toUpperCase();
        }
    }

    /**
     * Converts all the alphabetic characters in a string to lowercase
     */
    lower(): string {
        return this.namon.toLowerCase();
    }

    /**
     * Converts all the alphabetic characters in a string to uppercase
     */
    upper(): string {
        return this.namon.toUpperCase();
    }
}