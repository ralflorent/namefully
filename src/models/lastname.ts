/**
 * Last name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator, LastnameFormat } from './index';
import { convertToA0, convertToA1, convertToPhoneCode, convertToAscii } from '../core';

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
    capitalize(option: 'initial' | 'all' = 'initial'): void {
        super.capitalize(option);
        if (option === 'initial') {
            this.father = this.father[0].toUpperCase().concat(this.father.slice(1, this.father.length));
            if (this.hasMother())
                this.mother = this.mother[0].toUpperCase().concat(this.mother.slice(1, this.mother.length));
        } else {
            this.father = this.father.toUpperCase();
            if (this.hasMother()) this.mother = this.mother.toUpperCase();
        }
    }

    /**
     * De-capitalizes a last name
     * @param {'initial' | 'all'} option how to decapitalize its subparts
     */
    decapitalize(option: 'initial' | 'all' = 'initial'): void {
        super.capitalize(option);
        if (option === 'initial') {
            this.father = this.father[0].toLowerCase().concat(this.father.slice(1, this.father.length));
            if (this.hasMother())
                this.mother = this.mother[0].toLowerCase().concat(this.mother.slice(1, this.mother.length));
        } else {
            this.father = this.father.toLowerCase();
            if (this.hasMother()) this.mother = this.mother.toLowerCase();
        }
    }

    /**
     * Returns a numerical representation of characters of a name as specified
     * @param type which kind of conversion
     * @param restrictions chars to skip
     */
    convert(type: 'a0' | 'a1' | 'phone' | 'ascii', restrictions?: string[]): number[] {
        switch(type) {
            case 'a0':
                return convertToA0(this.tostring(), restrictions);
            case 'a1':
                return convertToA1(this.tostring(), restrictions);
            case 'phone':
                return convertToPhoneCode(this.tostring(), restrictions);
            case 'ascii':
                return convertToAscii(this.tostring(), restrictions);
            default:
                throw new Error('Unknown conversion type');
        }
    }
}

/**
 * Aliases for `Lastname`
 */
export interface Lastname {
    cap: typeof Lastname.prototype.capitalize;
    decap: typeof Lastname.prototype.decapitalize;
    stats: typeof Lastname.prototype.describe;
    inits: typeof Lastname.prototype.getInitials;
}

Lastname.prototype.cap = Lastname.prototype.capitalize;
Lastname.prototype.decap = Lastname.prototype.decapitalize;
Lastname.prototype.stats = Lastname.prototype.describe;
Lastname.prototype.inits = Lastname.prototype.getInitials;
