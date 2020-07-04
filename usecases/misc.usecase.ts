/**
 * Miscellaneous use cases
 *
 * Created on July 04, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { NAMECASES } from './constants';

function titleCaseUseCase(): void {

    const names = NAMECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: use of title cases                                                 |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name \t: ${name.getFullname()}\n`;
        content += `lower case \t: ${name.to('lower')}\n`;
        content += `upper case \t: ${name.to('upper')}\n`;
        content += `camel case \t: ${name.to('camel')}\n`;
        content += `pascal case \t: ${name.to('pascal')}\n`;
        content += `snake case \t: ${name.to('snake')}\n`;
        content += `hyphen case \t: ${name.to('hyphen')}\n`;
        content += `dot case \t: ${name.to('dot')}\n`;
        content += `toggle case \t: ${name.to('toggle')}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function asciiUseCase(): void {

    const names = NAMECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: generate an ascii representation                                   |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name \t: ${name.getFullname()}\n`;
        content += `first name \t: ${name.ascii({ nameType: 'fn'})}\n`;
        content += `last name \t: ${name.ascii({ nameType: 'ln'})}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function passwordUseCase(): void {

    const names = NAMECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: generate a password representation                                 |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += `full name \t: ${name.getFullname()}\n`;
        content += `password \t: ${name.passwd()}\n`;
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

export {
    titleCaseUseCase,
    asciiUseCase,
    passwordUseCase,
}

export default {
    titleCaseUseCase,
    asciiUseCase,
    passwordUseCase
}
