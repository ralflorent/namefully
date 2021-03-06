/**
 * Name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Summary, Namon } from './index';
import { convertToAscii, generatePassword } from '../core';

/**
 * Represents a namon with some extra functionalities
 * @class
 * @see {@link Namon} interface to understand the concept of namon/nama.
 */
export class Name {
    private readonly initial: string;
    private readonly body: string;

    /**
     * Constructs a `Name`
     * @param namon a piece of string that will be defined as a namon
     * @param type which namon that is
     * @param cap which kind of capitalizations
     */
    constructor(public namon: string, public type: Namon, cap?: 'initial' | 'all') {
        this.initial = namon[0];
        this.body = namon.slice(1);
        if (!!cap) this.capitalize(cap);
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
     * Returns a string representation of the namon
     */
    tostring(): string {
        return this.namon;
    }

    /**
     * Gets the initials of the name
     */
    getInitials(): string[] {
        return [this.namon[0]];
    }

    /**
     * Capitalizes a name
     * @param {'initial' | 'all'} option how to capitalize it
     */
    capitalize(option: 'initial' | 'all' = 'initial'): Name {
        const initial = this.initial.toUpperCase();
        if (option === 'initial') {
            this.namon = initial.concat(this.body);
        } else {
            this.namon = this.namon.toUpperCase();
        }
        return this;
    }

    /**
     * De-capitalizes a name
     * @param {'initial' | 'all'} option how to decapitalize it
     */
    decapitalize(option: 'initial' | 'all' = 'initial'): Name {
        const initial = this.initial.toLowerCase();
        if (option === 'initial') {
            this.namon = initial.concat(this.body);
        } else {
            this.namon = initial.concat(this.body.toLowerCase());
        }
        return this;
    }

    /**
     * Normalizes the name as it should be
     */
    normalize(): Name {
        this.namon = this.namon[0]
            .toUpperCase()
            .concat(this.namon.slice(1).toLowerCase());
        return this;
    }

    /**
     * Resets to the initial namon
     */
    reset(): Name {
        this.namon = this.initial.concat(this.body);
        return this;
    }

    /**
     * Returns an ascii representation of each characters of a name
     * @param restrictions chars to skip
     */
    ascii(restrictions?: string[]): number[] {
        return convertToAscii(this.namon, restrictions);
    }

    /**
     * Returns a password-like representation of a name
     */
    passwd(): string {
        return generatePassword(this.namon);
    }
}

/**
 * Aliases for `Name`
 */
export interface Name {
    cap: typeof Name.prototype.capitalize;
    decap: typeof Name.prototype.decapitalize;
    norm: typeof Name.prototype.normalize
    stats: typeof Name.prototype.describe;
    inits: typeof Name.prototype.getInitials;
}

Name.prototype.cap = Name.prototype.capitalize;
Name.prototype.decap = Name.prototype.decapitalize;
Name.prototype.norm = Name.prototype.normalize;
Name.prototype.stats = Name.prototype.describe;
Name.prototype.inits = Name.prototype.getInitials;
