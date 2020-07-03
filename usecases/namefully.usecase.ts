/**
 * How to create a name using `Namefully`
 *
 * Created on March 09, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namefully, Name, Namon, Firstname, Lastname, Config, Separator, Parser, Fullname, Prefix, Suffix } from '../src/index';

function createFromLiteralStringUseCase() {
    const cases = [
        'John Smith',
        'John Joe Smith',
        'Mr John Joe Smith',
        'Mr John Joe Smith PhD',
    ];

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using string literal               |\n`
    content += `+==============================================================================+\n`;
    cases.forEach(c => {
        const name = new Namefully(c);
        content += `full name \t: ${name.getFullname()}\n`;
        content += `birth name \t: ${name.getBirthname()}\n`;
        content += `prefix \t\t: ${name.getPrefix()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `middle name \t: ${name.getMiddlenames()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `initials \t: ${name.getInitials()}\n`;
        content += `suffix \t\t: ${name.getSuffix()}\n`;
        content += `----------------------------------------------------------------------------\n`;
    });
    console.log(content);
}

function createFromArrayStringUseCase() {
    const cases = [
        ['John', 'Smith'],
        ['John', 'Joe', 'Smith'],
        ['Mr', 'John', 'Joe', 'Smith'],
        ['Mr', 'John', 'Joe', 'Smith', 'PhD'],
    ];

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using an array of string           |\n`
    content += `+==============================================================================+\n`;
    cases.forEach(c => {
        const name = new Namefully(c);
        content += `full name \t: ${name.getFullname()}\n`;
        content += `birth name \t: ${name.getBirthname()}\n`;
        content += `prefix \t\t: ${name.getPrefix()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `middle name \t: ${name.getMiddlenames()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `initials \t: ${name.getInitials()}\n`;
        content += `suffix \t\t: ${name.getSuffix()}\n`;
        content += `----------------------------------------------------------------------------\n`;
    });
    console.log(content);
}

function createFromArrayNameUseCase(): void {
    const cases =[
        [
            new Name('John', Namon.FIRST_NAME), // the order doesn't matter here
            new Name('Smith', Namon.LAST_NAME),
        ],
        [
            new Firstname('John'),
            new Name('Joe', Namon.MIDDLE_NAME),
            new Lastname('Smith'),
        ],
        [
            new Name('Mr', Namon.PREFIX),
            new Name('John', Namon.FIRST_NAME),
            new Name('Joe', Namon.MIDDLE_NAME),
            new Name('Smith', Namon.LAST_NAME),
        ],
        [
            new Name('Mr', Namon.PREFIX),
            new Name('John', Namon.FIRST_NAME),
            new Name('Joe', Namon.MIDDLE_NAME),
            new Name('Smith', Namon.LAST_NAME),
            new Name('PhD', Namon.SUFFIX),
        ]
    ];

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using the class Name               |\n`
    content += `+==============================================================================+\n`;
    cases.forEach(c => {
        const name = new Namefully(c);
        content += `full name \t: ${name.getFullname()}\n`;
        content += `birth name \t: ${name.getBirthname()}\n`;
        content += `prefix \t\t: ${name.getPrefix()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `middle name \t: ${name.getMiddlenames()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `initials \t: ${name.getInitials()}\n`;
        content += `suffix \t\t: ${name.getSuffix()}\n`;
        content += `----------------------------------------------------------------------------\n`;
    });
    console.log(content);
}

function createFromArrayNamaUseCase(): void {
    const cases = [
        { firstname: 'John', lastname: 'Smith' },
        { firstname: 'John', middlename: 'Joe', lastname: 'Smith' },
        { prefix: 'Mr', firstname: 'John', middlename: 'Joe', lastname: 'Smith' },
        { prefix: 'Mr', firstname: 'John', middlename: 'Joe', lastname: 'Smith', suffix: 'PhD' },
    ];

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using JSON object 'Nama's          |\n`
    content += `+==============================================================================+\n`;
    cases.forEach(c => {
        const name = new Namefully(c);
        content += `full name \t: ${name.getFullname()}\n`;
        content += `birth name \t: ${name.getBirthname()}\n`;
        content += `prefix \t\t: ${name.getPrefix()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `middle name \t: ${name.getMiddlenames()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `initials \t: ${name.getInitials()}\n`;
        content += `suffix \t\t: ${name.getSuffix()}\n`;
        content += `----------------------------------------------------------------------------\n`;
    });
    console.log(content);
}

function createWithOptionalParamsUseCase(): void {

    class MyParser implements Parser<string> {
        constructor(public raw: string) {}
        parse(): Fullname {
            const [fn, ln] = this.raw.split('#');
            return {
                prefix: 'Sr' as Prefix, // unknown prefix
                firstname: new Firstname(fn),
                lastname: new Lastname(ln),
                suffix: 'Lic' as Suffix // unknown suffix
            };
        }
    }

    const options: Partial<Config>[] = [
        { orderedBy: 'lastname', separator: Separator.COLON, titling: 'us', ending: true },
        { parser: new MyParser('Juan#Garcia'), bypass: true }, // e.g., we don't cover this '#' separator
        // use this 'bypass' when it's very necessary, i.e, when you want to skip the regex
        { orderedBy: 'lastname', separator: Separator.COLON, bypass: true },
    ];

    let content = '';
    content += `+==============================================================================+\n`
    content += `| USE CASE: Create an instance of Namefully using optional parameters          |\n`
    content += `+==============================================================================+\n`;
    options.forEach(o => {
        const name = new Namefully('Mr:Smith:John:Joe:PhD', o);
        content += `full name \t: ${name.getFullname()}\n`;
        content += `birth name \t: ${name.getBirthname()}\n`;
        content += `prefix \t\t: ${name.getPrefix()}\n`;
        content += `first name \t: ${name.getFirstname()}\n`;
        content += `middle name \t: ${name.getMiddlenames()}\n`;
        content += `last name \t: ${name.getLastname()}\n`;
        content += `initials \t: ${name.getInitials()}\n`;
        content += `suffix \t\t: ${name.getSuffix()}\n`;
        content += `----------------------------------------------------------------------------\n`;
    });
    console.log(content);
}

export {
    createFromLiteralStringUseCase,
    createFromArrayStringUseCase,
    createFromArrayNameUseCase,
    createFromArrayNamaUseCase,
    createWithOptionalParamsUseCase,
};

export default {
    createFromLiteralStringUseCase,
    createFromArrayStringUseCase,
    createFromArrayNameUseCase,
    createFromArrayNamaUseCase,
    createWithOptionalParamsUseCase,
};
