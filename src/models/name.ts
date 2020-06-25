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
    constructor(public namon: string, public type: Namon, capitalized?: 'initial' | 'all') {
        this.initial = namon[0];
        this.body = namon.slice(1, namon.length);
        if (!!capitalized) this.capitalize(capitalized);
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
     */
    getInitials(): string[] {
        return [this.initial];
    }

    /**
     * Capitalizes a name
     * @param {'initial' | 'all'} option how to capitalize it
     */
    capitalize(option: 'initial' | 'all' = 'initial'): void {
        this.initial = this.initial.toUpperCase();
        if (option === 'initial') {
            this.namon = this.initial.concat(this.body);
        } else {
            this.namon = this.namon.toUpperCase();
        }
    }

    /**
     * De-capitalizes a name
     * @param {'initial' | 'all'} option how to decapitalize it
     */
    decapitalize(option: 'initial' | 'all' = 'initial'): void {
        this.initial = this.initial.toLowerCase();
        if (option === 'initial') {
            this.namon = this.initial.concat(this.body);
        } else {
            this.namon = this.initial.concat(this.body.toLowerCase());
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

    /**
     * Resets to the initial namon
     */
    reset(): void {
        this.namon = this.initial.concat(this.body);
    }
}

/**
 * Aliases for `Name`
 */
export interface Name {
    cap: typeof Name.prototype.capitalize;
    decap: typeof Name.prototype.decapitalize;
    stats: typeof Name.prototype.describe;
    inits: typeof Name.prototype.getInitials;
}

Name.prototype.cap = Name.prototype.capitalize;
Name.prototype.decap = Name.prototype.decapitalize;
Name.prototype.stats = Name.prototype.describe;
Name.prototype.inits = Name.prototype.getInitials;
