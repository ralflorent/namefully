/**
 * Shorten a full name
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { nameCases as cases } from './constants';

function shortenUseCase(): void {
    const names = cases.map(c => new Namefully(c));
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: shorten the full name                                              |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name \t: ${name.getFullname()}\n`;
        content += `typical name \t: ${name.shorten()}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

export {
    shortenUseCase,
}

export default {
    shortenUseCase,
}
