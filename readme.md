# namefully

[![npm version][version-img]][version-url]
[![CI build][ci-img]][ci-url]
[![Coverage Status][codecov-img]][codecov-url]
[![MIT License][license-img]][license-url]

## Description

A JavaScript utility for handling person names.
[Try it live](https://stackblitz.com/edit/namefully).

## Documentation

Check out the official documentation at
[namefully.netlify.com](https://namefully.netlify.com).

## Motivation

Have you ever had to format a user's name in a particular order, way, or shape?
Probably yes. If not, it will come at some point. Be patient.

You may want to use this library if:

- you've been repeatedly dealing with users' given names and surnames;
- you need to occasionally format a name in a particular order, way, or shape;
- you keep copy-pasting your name-related business logic for every project;
- you're curious about trying new, cool stuff.

## Key features

1. Accept different data shapes as input
2. Use optional parameters to access advanced features
3. Format a name as desired
4. Offer support for prefixes and suffixes
5. Access to names' initials
6. Support hyphenated names (and other special characters)
7. Offer predefined validation rules for many writing systems, including the
   Latin and European ones (e.g., German, Greek, Cyrillic, Icelandic characters)

## Advanced features

1. Alter the name order anytime
2. Handle various parts of a surname and a given name
3. Use tokens (separators) to reshape prefixes and suffixes
4. Accept customized parsers (do it yourself)
5. Parse non-standard name cases

## Installation

```bash
npm i namefully
```

## Dependencies

None

## Related packages

This package is also available in [Angular](https://angular.io/) and
[React](https://reactjs.org/):

- [@namefully/react](https://www.npmjs.com/package/@namefully/react)
- [@namefully/ng](https://www.npmjs.com/package/@namefully/ng)

## Usage

See `example/example.ts`.

```ts
import { Namefully } from 'namefully'

const name = new Namefully('Thomas Alva Edison');
console.log(name.short); // Thomas Edison
console.log(name.public); // Thomas E
console.log(name.initials()); // ['T', 'A', 'E']
console.log(name.format('L, f m')); // EDISON, Thomas Alva
console.log(name.zip()); // Thomas A. E.
```

> NOTE: if you intend to use this utility for non-standard name cases such as
> many middle names or last names, some extra work is required. For example,
> using `Namefully.parse()` lets you parse names containing many middle names
> with the risk of throwing a `NameError` when the parsing is not possible.

## `Config` and default values

`Config` is a single configuration to use across the other components.

The multiton pattern is used to keep one configuration across the `Namefully`
setup. This is useful for avoiding confusion when building other components such
as `FirstName`, `LastName`, or `Name` of distinct types (or `Namon`) that may
be of particular shapes.

Below are enlisted the options supported by `namefully`.

### orderedBy

`NameOrder` - default: `NameOrder.FIRST_NAME`

Indicates in what order the names appear when set as raw string values or string
array values. That is, the first element/piece of the name is either the given
name (e.g., `Jon Snow`) or the surname (e.g.,`Snow Jon`).

```ts
// 'Smith' is the surname in this raw string case
const name1 = new Namefully('Smith John Joe', { orderedBy: NameOrder.LAST_NAME });
console.log(name1.last); // Smith

// 'Edison' is the surname in this string array case
const name2 = new Namefully(['Edison', 'Thomas'], { orderedBy: NameOrder.LAST_NAME });
console.log(name2.first); // Thomas
```

> NOTE: This option also affects all the other results of the API. In other
> words, the results will prioritize the order of appearance set in the first
> place for the other operations. Keep in mind that in some cases, it can be
> altered on the go. See the example below.

```ts
// 'Smith' is the surname in this raw string case
const name = new Namefully('Smith John Joe', { orderedBy: NameOrder.LAST_NAME });
console.log(name.fullName()); // Smith John Joe

// Now alter the order by choosing the given name first
console.log(name.fullName(NameOrder.FIRST_NAME)); // John Joe Smith
```

### separator

`Separator` - default: `Separator.SPACE`

_Only valid for raw string values_, this option indicates how to split the parts
of a raw string name under the hood.

```ts
const name = new Namefully('John,Smith', { separator: Separator.COMMA });
console.log(name.full); // John Smith
```

### title

`Title` - default: `Title.UK`

Abides by the ways the international community defines an abbreviated title.
American and Canadian English follow slightly different rules for abbreviated
titles than British and Australian English. In North American English, titles
before a name require a period: `Mr., Mrs., Ms., Dr.`. In British and Australian
English, no periods are used in these abbreviations.

```ts
const name = new Namefully({
  prefix: 'Mr',
  firstName: 'John',
  lastName: 'Smith',
}, { title: Title.US });
console.log(name.full); // Mr. John Smith
console.log(name.prefix); // Mr.
```

### ending

`boolean` - default: `false`

Sets an ending character after the full name (a comma before the suffix actually).

```ts
const name = new Namefully({
    firstName: 'John',
    lastName: 'Smith',
    suffix: 'Ph.D'
}, { ending: true })
console.log(name.full) // John Smith, Ph.D
console.log(name.suffix) // Ph.D
```

### surname

`Surname` - default: `Surname.FATHER`

Defines the distinct formats to output a compound surname (e.g., Hispanic surnames).

```ts
const name = new Namefully(
    [FirstName('John'), LastName('Doe', 'Smith')],
    { surname: Surname.HYPHENATED },
);
console.log(name.full); // John Doe-Smith
```

### bypass

`boolean` - default: `true`

Skips all the validators (i.e., validation rules, regular expressions).

```ts
const name = new Namefully(
  {
    firstName: 'John',
    lastName: 'Smith',
    suffix: 'M.Sc.', // will fail the validation rule and throw an exception.
  },
  { bypass: false, ending: true },
);
```

To sum it all up, the default values are:

```ts
{
    orderedBy: NameOrder.FIRST_NAME,
    separator: Separator.SPACE,
    title: Title.UK
    ending: false,
    bypass: true,
    surname: Surname.FATHER
}
```

## Do It Yourself

Customize your own parser to indicate the full name yourself.

```ts
import { Config, FullName, Namefully, Parser } from 'namefully'

// Suppose you want to cover this '#' separator
class SimpleParser extends Parser<string> {
    parse(options: Partial<Config>): FullName {
        const [firstName, lastName] = this.raw.split('#')
        return FullName.parse({ firstName, lastName }, Config.merge(options))
    }
}

const name = new Namefully(SimpleParser('Juan#Garcia'));
console.log(name.full); // Juan Garcia
```

## Concepts and examples

The name standards used for the current version of this library are as follows:

`[prefix] firstName [middleName] lastName [suffix]`

The opening `[` and closing `]` brackets mean that these parts are optional. In
other words, the most basic/typical case is a name that looks like this:
`John Smith`, where `John` is the _firstName_ and `Smith`, the _lastName_.

> NOTE: Do notice that the order of appearance matters and (as shown in
> [orderedBy](#orderedby)) can be altered through configured parameters. By default,
> the order of appearance is as shown above and will be used as a basis for
> future examples and use cases.

Once imported, all that is required to do is to create an instance of
`Namefully` and the rest will follow.

### Basic cases

Let us take a common example:

`Mr John Joe Smith PhD`

So, this utility understands the name parts as follows:

- prefix: `Mr`
- first name: `John`
- middle name: `Joe`
- last name: `Smith`
- suffix: `PhD`
- full name: `Mr John Joe Smith PhD`
- birth name: `John Joe Smith`
- short version: `John Smith`
- flattened: `John J. S.`
- initials: `J J S`
- public: `John S`

### Limitations

`namefully` does not have support for certain use cases:

- mononame: `Plato`. A workaround is to set the mononame as both first and last name;
- multiple prefixes: `Prof. Dr. Einstein`.

See the [test cases](test) for further details.

## Author

Developed by [Ralph Florent](https://github.com/ralflorent).

## License

The underlying content of this utility is licensed under [MIT](LICENSE).

<!-- References -->

[version-img]: https://img.shields.io/npm/v/namefully
[version-url]: https://www.npmjs.com/package/namefully
[ci-img]: https://github.com/ralflorent/namefully/workflows/build/badge.svg
[ci-url]: https://github.com/ralflorent/namefully/actions/workflows/config.yml
[codecov-img]: https://codecov.io/gh/ralflorent/namefully/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ralflorent/namefully
[license-img]: https://img.shields.io/npm/l/namefully
[license-url]: https://opensource.org/licenses/MIT
