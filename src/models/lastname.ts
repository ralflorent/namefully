/**
 * Last name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator, LastnameFormat } from './index';

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
        switch(this.format) {
            case 'father':
                return this.father;
            case 'mother':
                return this.mother || Separator.EMPTY;
            case 'hyphenated':
                return this.mother ? this.father.concat(Separator.HYPHEN, this.mother) : this.father;
            case 'all':
                return this.mother ? this.father.concat(Separator.SPACE, this.mother) : this.father;
            default:
                return this.father;
        }
    }

    /**
     * Gets the initials of the last name
     * @returns {Array<string>} the initials
     */
    getInitials(): string[] {
        const initials: string[] = [this.father[0]];
        if (!!this.mother && this.mother.length) {
            initials.push(this.mother[0]);
        }
        return initials;
    }
}
