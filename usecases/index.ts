/**
 * Main entry for the use cases
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import namefullyCases from './namefully.usecase';
import describeCases from  './describe.usecase';
import shortenCases from './shorten.usecase';
import compressCases from './compress.usecase';
import formatCases from './format.usecase';

// execute all cases
Object.entries(namefullyCases).forEach(e => (e[1] as Function)());
Object.entries(describeCases).forEach(e => (e[1] as Function)());
Object.entries(shortenCases).forEach(e => (e[1] as Function)());
Object.entries(compressCases).forEach(e => (e[1] as Function)());
Object.entries(formatCases).forEach(e => (e[1] as Function)());
