/**
 * First name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator } from './index';
import { convertToAscii, generatePassword } from '../core';


/**
 * Represents a first name with some extra functionalities
 * @class
 * @extends Name
 */
export class Firstname extends Name {

    readonly more: string[] = [];
    /**
     * Constructs a `Firstname`
     * @param {string} namon a piece of string that will be defined as a namon
     * @param {string[]} [more] additional pieces considered as a given name
     */
    constructor(public namon: string, ...more: string[]) {
        super(namon, Namon.FIRST_NAME);
        this.more = more;
    }

    /**
     * Determines whether a first name has more name parts
     */
    hasMore(): boolean {
        return Array.isArray(this.more) && this.more.length > 0;
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @param {boolean} includeAll whether to include other pieces of the first
     * name in the summary
     * @see {@link describe} in `Namefully` class for further information
     */
    describe(includeAll: boolean = false): Summary {
        return new Summary(this.tostring(includeAll));
    }

    /**
     * Returns a string representation of the first name
     * @param {boolean} includeAll whether to include other pieces of the first
     * name
     */
    tostring(includeAll: boolean = false): string {
        return !includeAll
            ? this.namon
            : this.namon.concat(
                Separator.SPACE,
                this.more.join(Separator.SPACE)
            );
    }

    /**
     * Gets the initials of the first name
     */
    getInitials(includeAll: boolean = false): string[] {
        const initials: string[] = [this.namon[0]];
        if (includeAll && this.hasMore()) {
            initials.push(...this.more.map(n => n[0]));
        }
        return initials;
    }

    /**
     * Capitalizes a first name
     * @param {'initial' | 'all'} option how to capitalize its subparts
     */
    capitalize(option: 'initial' | 'all' = 'initial'): void {
        if (option === 'initial') {
            this.namon = this.namon[0].toUpperCase().concat(this.namon.slice(1));
            if (this.hasMore())
                this.more.forEach(n => n = n[0].toUpperCase().concat(n.slice(1)));
        } else {
            this.namon = this.namon.toUpperCase();
            if (this.hasMore()) this.more.forEach(n => n = n.toUpperCase());
        }
    }

    /**
     * De-capitalizes a first name
     * @param {'initial' | 'all'} option how to decapitalize its subparts
     */
    decapitalize(option: 'initial' | 'all' = 'initial'): void {
        if (option === 'initial') {
            this.namon = this.namon[0].toLowerCase().concat(this.namon.slice(1));
            if (this.hasMore()) this.more.forEach(n => n = n[0].toLowerCase().concat(n.slice(1)));
        } else {
            this.namon = this.namon.toLowerCase();
            if (this.hasMore()) this.more.forEach(n => n = n.toLowerCase());
        }
    }

        /**
     * Returns an ascii representation of each characters of a first name
     * @param restrictions chars to skip
     */
    ascii(restrictions?: string[]): number[] {
        return convertToAscii(this.tostring(true), restrictions);
    }

    /**
     * Returns a password-like representation of a first name
     */
    passwd(): string {
        return generatePassword(this.tostring(true))
    }
}

/**
 * Aliases for `Firstname`
 */
export interface Firstname {
    cap: typeof Firstname.prototype.capitalize;
    decap: typeof Firstname.prototype.decapitalize;
    stats: typeof Firstname.prototype.describe;
    inits: typeof Firstname.prototype.getInitials;
}

Firstname.prototype.cap = Firstname.prototype.capitalize;
Firstname.prototype.decap = Firstname.prototype.decapitalize;
Firstname.prototype.stats = Firstname.prototype.describe;
Firstname.prototype.inits = Firstname.prototype.getInitials;
