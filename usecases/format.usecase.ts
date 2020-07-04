/**
 * Format a full name as desired
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { USECASES } from './constants';

function formatUseCase(): void {
    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: format the name as desired                                         |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name     : ${name.getFullname()}\n`;
        content += `by default    : ${name.format()}\n`;
        content += `short name    : ${name.format('short')}\n`;
        content += `long name     : ${name.format('long')}\n`;
        content += `[LN], [fn]    : ${name.format('L, f')}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

export {
    formatUseCase,
}

export default {
    formatUseCase,
}
