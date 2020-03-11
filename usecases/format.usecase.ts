/**
 * Format a full name as desired
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { nameCases as cases } from './constants';

function formatUseCase(): void {
    const names = cases.map(c => new Namefully(c));
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: format the name as desired                                         |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name     : ${name.getFullname()}\n`;
        content += `by default    : ${name.format()}\n`;
        content += `[fn] [ln]     : ${name.format('f l')}\n`;
        content += `[LN], [fn]    : ${name.format('L, f')}\n`;
        content += `[ln]_[mn]_[fn]: ${name.format('f_m_l')}\n`;
        content += `[LN]-[MN] [FN]: ${name.format('F-M L')}\n`;
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
