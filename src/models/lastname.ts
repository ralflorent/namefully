/**
 * Last name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator, LastnameFormat } from './index';
import { convertToAscii, generatePassword } from '../core';

/**
 * Represents a last name with some extra functionalities
 * @class
 * @extends Name
 */
export class Lastname extends Name {

    /**
     * Constructs a `Lastname`
     * @param {string} father a piece of string that will be defined as a namon
     * @param {string} [mother] additional pieces considered as a last name
     * @param {LastnameFormat} [format] how to output a surname considering its
     * subparts
     */
    constructor(public father: string, public mother?: string, private format: LastnameFormat = 'father') {
        super(father, Namon.LAST_NAME);
    }

    /**
     * Determines whether a 'mother' subpart was set
     */
    hasMother(): boolean {
        return !!this.mother && this.mother.length > 0;
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @param {LastnameFormat} [format] overrides the how-to format of a surname
     * output, considering its subparts.
     * @see {@link describe} in `Namefully` class for further information
     */
    describe(format?: LastnameFormat): Summary {
        format = format || this.format;
        return new Summary(this.tostring(format));
    }

    /**
     * Returns a string representation of the last name
     * @param {LastnameFormat} [format] overrides the how-to format of a surname
     * output, considering its subparts.
     */
    tostring(format?: LastnameFormat): string {
        format = format || this.format;
        switch(format) {
            case 'father':
                return this.father;
            case 'mother':
                return this.mother || Separator.EMPTY;
            case 'hyphenated':
                return this.mother ? this.father.concat(Separator.HYPHEN, this.mother) : this.father;
            case 'all':
                return this.mother ? this.father.concat(Separator.SPACE, this.mother) : this.father;
        }
    }

    /**
     * Gets the initials of the last name
     */
    getInitials(format?: LastnameFormat): string[] {
        format = format || this.format;
        const initials: string[] = [];

        switch(format) {
            case 'father':
                initials.push(this.father[0]);
                break;
            case 'mother':
                if (this.hasMother())
                    initials.push(this.mother[0]);
                break;
            case 'hyphenated': case 'all':
                initials.push(this.father[0]);
                if (this.hasMother())
                    initials.push(this.mother[0]);
                break;
        }
        return initials;
    }

    /**
     * Capitalizes a last name
     * @param {'initial' | 'all'} option how to capitalize its subparts
     */
    capitalize(option: 'initial' | 'all' = 'initial'): Lastname {
        super.capitalize(option);
        if (option === 'initial') {
            this.father = this.father[0].toUpperCase().concat(this.father.slice(1));
            if (this.hasMother())
                this.mother = this.mother[0].toUpperCase().concat(this.mother.slice(1));
        } else {
            this.father = this.father.toUpperCase();
            if (this.hasMother()) this.mother = this.mother.toUpperCase();
        }
        return this;
    }

    /**
     * De-capitalizes a last name
     * @param {'initial' | 'all'} option how to decapitalize its subparts
     */
    decapitalize(option: 'initial' | 'all' = 'initial'): Lastname {
        super.capitalize(option);
        if (option === 'initial') {
            this.father = this.father[0].toLowerCase().concat(this.father.slice(1));
            if (this.hasMother())
                this.mother = this.mother[0].toLowerCase().concat(this.mother.slice(1));
        } else {
            this.father = this.father.toLowerCase();
            if (this.hasMother())
                this.mother = this.mother.toLowerCase();
        }
        return this;
    }

    /**
     * Normalizes the last name as it should be
     */
    normalize(): Lastname {
        this.father = this.father[0]
            .toUpperCase()
            .concat(this.father.slice(1).toLowerCase());
        if (this.hasMother())
            this.mother = this.mother[0]
                .toUpperCase()
                .concat(this.mother.slice(1).toLowerCase());
        return this;
    }

    /**
     * Returns an ascii representation of each characters of a last name
     * @param restrictions chars to skip
     */
    ascii(restrictions?: string[]): number[] {
        return convertToAscii(this.tostring(), restrictions);
    }

    /**
     * Returns a password-like representation of a last name
     */
    passwd(): string {
        return generatePassword(this.tostring());
    }
}

/**
 * Aliases for `Lastname`
 */
export interface Lastname {
    cap: typeof Lastname.prototype.capitalize;
    decap: typeof Lastname.prototype.decapitalize;
    norm: typeof Lastname.prototype.normalize;
    stats: typeof Lastname.prototype.describe;
    inits: typeof Lastname.prototype.getInitials;
}

Lastname.prototype.cap = Lastname.prototype.capitalize;
Lastname.prototype.decap = Lastname.prototype.decapitalize;
Lastname.prototype.norm = Lastname.prototype.normalize;
Lastname.prototype.stats = Lastname.prototype.describe;
Lastname.prototype.inits = Lastname.prototype.getInitials;
