/**
 * First name class definition
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Name, Namon, Summary, Separator } from './index';


/**
 * Represents a first name with some extra functionalities
 * @class
 * @extends Name
 */
export class Firstname extends Name {

    /**
     * Constructs a `Firstname`
     * @param {string} namon a piece of string that will be defined as a namon
     * @param {string[]} [more] additional pieces considered as a given name
     */
    constructor(public namon: string, public more?: string[]) {
        super(namon, Namon.FIRST_NAME);
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
     * Returns a string representation of the first name
     * @param {boolean} includeAll whether to include other pieces of the first
     * name
     */
    tostring(includeAll: boolean = false): string {
        return !includeAll ?
            this.namon :
            this.namon.concat(
                Separator.SPACE,
                this.more.join(Separator.SPACE)
            );
    }

    /**
     * Gets the initials of the first name
     * @returns {Array<string>} the initials
     */
    getInitials(): string[] {
        const initials: string[] = [this.namon[0]];
        if (Array.isArray(this.more) && this.more.length) {
            initials.push(...this.more);
        }
        return initials;
    }
}
