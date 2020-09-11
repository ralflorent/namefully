/**
 * Summary of descriptive stats of the name
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator } from './index';

/**
 * Represents the statistical summary of a string content
 */
export class Summary {
    readonly distribution: { [key: string]: number};
    readonly count: number;
    readonly frequency: number;
    readonly top: string;
    readonly unique: number;

    /**
     * Creates a `Summary` of a given string of alphabetical characters
     * @param namon piece of name
     * @param restrictions a set of undesired characters
     */
    constructor(private namon: string, restrictions: string[] = [Separator.SPACE]) {
        const summary = this.compute(restrictions);
        this.distribution = summary.distribution;
        this.count = summary.count;
        this.frequency = summary.frequency;
        this.top = summary.top;
        this.unique = summary.unique;
    }

    /**
     * Returns a string representation of the summary
     */
    tostring(): string {
        return Separator.EMPTY.concat(
            `Descriptive statistics for "${this.namon}" \n`,
            `distrib  : ${Object.entries(this.distribution).map(e => `${e[1]}${e[0]}`).join(',')} \n`,
            `count    : ${this.count} \n`,
            `frequency: ${this.frequency} \n`,
            `top      : ${this.top} \n`,
            `unique   : ${this.unique} \n`,
        );
    }

    private compute(restrictions: string[] = []) {
        let count = 0, frequency = 0, unique = 0, top = '';
        const distribution = this.groupByChar();

        for (const char in distribution) {
            if (restrictions.indexOf(char) === -1) {
                count += distribution[char];
                if (distribution[char] >= frequency) {
                    frequency = distribution[char];
                    top = char;
                }
                unique++;
            }
        }

        return { distribution, count, frequency, top, unique };
    }

    private groupByChar() {
        const frequencies: { [key: string]: number } = {};
        for (const char of this.namon.toUpperCase())
            if (Object.keys(frequencies).includes(char))
                frequencies[char] += 1;
            else
                frequencies[char] = 1;
        return frequencies;
    }
}
