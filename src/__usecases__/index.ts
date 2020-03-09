/**
 * Main entry for the use cases
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully, Name, Nama, Namon } from '../index';

// case 1: create a name using raw string
function useCase1() {
    const name = new Namefully('Mr John Joe Smith PhD');
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using a raw string                 |\n`
    content += `+==============================================================================+\n`;
    content += `full name \t: ${name.getFullname()}\n`;
    content += `prefix \t\t: ${name.getPrefix()}\n`;
    content += `first name \t: ${name.getFirstname()}\n`;
    content += `middle name \t: ${name.getMiddlenames()}\n`;
    content += `last name \t: ${name.getLastname()}\n`;
    content += `initials \t: ${name.getInitials()}\n`;
    content += `suffix \t\t: ${name.getSuffix()}\n`;
    console.log(content);
}

function useCase2(): void {
    // case 2: create a name using an array of string
    const name = new Namefully(['Mr', 'John', 'Joe', 'Smith', 'PhD']);
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using an array of string           |\n`
    content += `+==============================================================================+\n`;
    content += `full name \t: ${name.getFullname()}\n`;
    content += `prefix \t\t: ${name.getPrefix()}\n`;
    content += `first name \t: ${name.getFirstname()}\n`;
    content += `middle name \t: ${name.getMiddlenames()}\n`;
    content += `last name \t: ${name.getLastname()}\n`;
    content += `initials \t: ${name.getInitials()}\n`;
    content += `suffix \t\t: ${name.getSuffix()}\n`;
    console.log(content);
}

function useCase3(): void {
    // // case 3: create a name using an array of Name
    const name = new Namefully([
        new Name('Mr', Namon.PREFIX),
        new Name('John', Namon.FIRST_NAME),
        new Name('Joe', Namon.MIDDLE_NAME),
        new Name('Smith', Namon.LAST_NAME),
        new Name('PhD', Namon.SUFFIX),
    ]);
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using an array of Name             |\n`
    content += `+==============================================================================+\n`;
    content += `full name \t: ${name.getFullname()}\n`;
    content += `prefix \t\t: ${name.getPrefix()}\n`;
    content += `first name \t: ${name.getFirstname()}\n`;
    content += `middle name \t: ${name.getMiddlenames()}\n`;
    content += `last name \t: ${name.getLastname()}\n`;
    content += `initials \t: ${name.getInitials()}\n`;
    content += `suffix \t\t: ${name.getSuffix()}\n`;
    console.log(content);
}

function useCase4(): void {
    // // case 4: create a name using a Nama (JSON object)
    const name = new Namefully({
        prefix: 'Mr',
        firstname: 'John',
        middlename: 'Joe',
        lastname: 'Smith',
        suffix: 'PhD'
    });
    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using an array of Name             |\n`
    content += `+==============================================================================+\n`;
    content += `full name \t: ${name.getFullname()}\n`;
    content += `prefix \t\t: ${name.getPrefix()}\n`;
    content += `first name \t: ${name.getFirstname()}\n`;
    content += `middle name \t: ${name.getMiddlenames()}\n`;
    content += `last name \t: ${name.getLastname()}\n`;
    content += `initials \t: ${name.getInitials()}\n`;
    content += `suffix \t\t: ${name.getSuffix()}\n`;
    console.log(content);
}

// useCase1();
// useCase2();
// useCase3();
useCase4();
