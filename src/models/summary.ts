/**
 * Summary of descriptive stats of the name
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Separator } from './index';

/**
 * Represents the statistical summary of a string representation
 * @class
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
            `count    : ${this.count} \n`,
            `frequency: ${this.frequency} \n`,
            `top      : ${this.top} \n`,
            `unique   : ${this.unique} \n`,
            `distrib  : ${Object.entries(this.distribution).map(e => `${e[1]}${e[0]}`).join(',')} \n`,
        );
    }

    private compute(restrictions: string[] = []) {
        // compute stats for the string
        let count = 0, maxfreq = 0, uniq = 0, top = '';
        const freqs = this.groupByChar();

        for (const char in freqs) {
            if (restrictions.indexOf(char) === -1) {
                count += freqs[char];
                if (freqs[char] >= maxfreq) {
                    maxfreq = freqs[char];
                    top = char;
                }
                uniq++;
            }
        }

        return {
            distribution: freqs,
            count,
            frequency: maxfreq,
            top,
            unique: uniq
        };
    }

    private groupByChar(): any {
        const frequencies: { [key: string]: number } = {};
        for (const char of this.namon.toUpperCase())
            if (Object.keys(frequencies).includes(char))
                frequencies[char] += 1;
            else
                frequencies[char] = 1;
        return frequencies;
    }
}
