/**
 * Describe any part of the name
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully, Firstname, Lastname, Name, Namon } from '../src/index';
import { nameCases as cases } from './constants';

function describeFullnameUseCase(): void {
    const names = cases.map(c => new Namefully(c));
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
    const names: Name[] = [];
    names.push(...cases.filter(c => c.length === 2).map(c => new Firstname(c[0])));
    names.push(...cases.filter(c => c.length === 3).map(c => new Firstname(c[0])));
    names.push(...cases.filter(c => c.length === 4).map(c => new Firstname(c[1])));
    names.push(...cases.filter(c => c.length === 5).map(c => new Firstname(c[1])));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the first name                                            |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe().tostring();
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function describeMiddlenameUseCase(): void {
    const names: Name[] = [];
    names.push(...cases.filter(c => c.length === 3).map(c => new Name(c[1], Namon.MIDDLE_NAME)));
    names.push(...cases.filter(c => c.length === 4).map(c => new Name(c[2], Namon.MIDDLE_NAME)));
    names.push(...cases.filter(c => c.length === 5).map(c => new Name(c[2], Namon.MIDDLE_NAME)));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the middle name                                             |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe().tostring();
        content += `----------------------------------------------------------------------------\n`
    })
    console.log(content);
}

function describeLastnameUseCase(): void {
    const names: Name[] = [];
    names.push(...cases.filter(c => c.length === 2).map(c => new Lastname(c[1])));
    names.push(...cases.filter(c => c.length === 3).map(c => new Lastname(c[2])));
    names.push(...cases.filter(c => c.length === 4).map(c => new Lastname(c[3])));
    names.push(...cases.filter(c => c.length === 5).map(c => new Lastname(c[3])));

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Describe the last name                                             |\n`
    content += `+==============================================================================+\n`
    names.forEach(name => {
        content += name.describe().tostring();
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
