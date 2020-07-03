/**
 * Describe any part of the name
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully } from '../src/index';
import { USECASES } from './constants';

function describeFullnameUseCase(): void {

    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the full name                                             |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe().tostring();
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function describeFirstnameUseCase(): void {
    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the first name                                            |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe('firstname').tostring();
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function describeMiddlenameUseCase(): void {

    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the middle name                                             |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        const summary = name.describe('middlename');
        content += summary ? summary.tostring() : `No middle name has been set for "${name.full()}"\n`
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function describeLastnameUseCase(): void {

    const names = USECASES.map(c => new Namefully(c.raw, c.options));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the last name                                             |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe('lastname').tostring();
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

export {
    describeFullnameUseCase,
    describeFirstnameUseCase,
    describeMiddlenameUseCase,
    describeLastnameUseCase,
}

export default {
    describeFullnameUseCase,
    describeFirstnameUseCase,
    describeMiddlenameUseCase,
    describeLastnameUseCase,
}
