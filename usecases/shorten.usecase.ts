/**
 * Shorten a full name
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { NAMECASES } from './constants';

function shortenUseCase(): void {

    const names = NAMECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: shorten the full name                                              |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name \t: ${name.getFullname()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `short name \t: ${name.shorten()}\n`;
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
