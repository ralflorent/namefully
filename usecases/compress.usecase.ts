/**
 * Compress a full name using different variants
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { USECASES } from './constants';

function compressUseCase(): void {
    const limitBy = 20;
    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: compress the full name using different variants                    |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name    : ${name.getFullname()}\n`;
        content += `by default   : ${name.compress()}\n`;
        content += `by limit ${limitBy}  : ${name.compress(limitBy)}\n`;
        content += `by firstname : ${name.compress(limitBy, 'firstname')}\n`;
        content += `by lastname  : ${name.compress(limitBy, 'lastname')}\n`;
        content += `by middlename: ${name.compress(limitBy, 'middlename')}\n`;
        content += `by firstmid  : ${name.compress(limitBy, 'firstmid')}\n`;
        content += `by midlast   : ${name.compress(limitBy, 'midlast')}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function zipUseCase(): void {
    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: zip the full name using different variants                    |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name    : ${name.getFullname()}\n`;
        content += `by default   : ${name.zip()}\n`;
        content += `by firstname : ${name.zip('firstname')}\n`;
        content += `by lastname  : ${name.zip('lastname')}\n`;
        content += `by middlename: ${name.zip('middlename')}\n`;
        content += `by firstmid  : ${name.zip('firstmid')}\n`;
        content += `by midlast   : ${name.zip('midlast')}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

export {
    compressUseCase,
    zipUseCase,
}

export default {
    compressUseCase,
    zipUseCase,
}
