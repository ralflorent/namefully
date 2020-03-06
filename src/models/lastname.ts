/**
 * Last name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator } from './index';

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
     * @param {boolean} [hyphenated] whether to include the hyphen as part the
     * father-mother last name.
     */
    constructor(public father: string, public mother?: string, hyphenated: boolean = false) {
        super(father, Namon.LAST_NAME);
    }

    /**
     * Gives some descriptive statistics that summarize the central tendency,
     * dispersion and shape of the characters' distribution.
     * @see {@link describe} in `Namefully` class for further information
     */
    describe(): Summary {
        return new Summary(this.tostring());
    }

    /**
     * Returns a string representation of the last name
     * @param {boolean} includeAll whether to include other pieces of the last
     * name
     */
    tostring(includeAll: boolean = false): string {
        return !includeAll ?
            this.father :
            this.mother ?
                this.father.concat(Separator.SPACE, this.mother) :
                this.father;
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
