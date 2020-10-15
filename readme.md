# namefully

[![npm version][version-img]][version-url]
[![CircleCI][circleci-img]][circleci-url]
[![Coverage Status][codecov-img]][codecov-url]
[![MIT License][license-img]][license-url]

## Description

A JavaScript utility for handling person names.
[Try it live](https://stackblitz.com/edit/namefully).

## Documentation

Check out the official documentation at
[https://namefully.dev](https://namefully.dev/).

## Motivation

Have you ever had to format a user's name in a particular order, way, or shape?
Probably yes. If not, it will come at some point. Be patient.

## Key features

1. Offer supports for many writing systems, including Latin and European ones
(e.g., German, Greek, Cyrillic, Icelandic characters)
2. Accept different data shapes as input
3. Use of optional parameters to access advanced features
4. Format a name as desired
5. Offer support for prefixes and suffixes
6. Access to names' initials
7. Allow hyphenated names, including with apostrophes

## Advanced features

1. Alter the order of appearance of a name: by given name or surname
2. Handle various subparts of a surname and given name
3. Use tokens (separators) to reshape prefixes and suffixes
4. Accept customized parsers (do it yourself)

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

```ts
import { Namefully } from 'namefully'

const name = new Namefully('John Joe Smith')
console.log(name.format('L, f m')) // => SMITH, John Joe
console.log(name.zip()) // => John J. Smith
```

> NOTE: This package comes with its own declaration file for
> [TypeScript](https://www.typescriptlang.org/) support.

## Options and default values

Below are enlisted the options supported by `namefully`.

### orderedBy

`string: 'firstname' | 'lastname'`, default: `firstname`

Indicate in what order the names appear when set as raw string values or
string array values. That is, the first element/piece of the name is either the
given name (e.g., `Jon Snow`)  or the surname (e.g.,`Snow Jon`).

```ts
// 'Smith' is the surname in this raw string case
const name = new Namefully('Smith John Joe', { orderedBy: 'lastname' })
console.log(name.ln()) // => Smith

// 'Edison' is the surname in this string array case
const name = new Namefully(['Edison', 'Thomas'], { orderedBy: 'lastname' })
console.log(name.fn()) // => Thomas
```

> NOTE: This option also affects all the other results of the API. In other words,
> the results will prioritize the order of appearance set in the first place for
> the other operations. Keep in mind that in some cases, it can be altered on the
> go. See the example below.

```ts
// 'Smith' is the surname in this raw string case
const name = new Namefully('Smith John Joe', { orderedBy: 'lastname' })
console.log(name.full()) // => Smith John Joe

// Now alter the order by choosing the given name first
console.log(name.full('firstname')) // => John Joe Smith
```

### separator

`enum: Separator`, default: `Separator.SPACE`

Only valid for raw string values, this option indicates how to split the parts of
a raw string name under the hood.

```ts
const name = new Namefully('Adam,Sandler', { separator: Separator.COMMA })
console.log(name.full()) // => Adam Sandler
```

### titling

`string: 'uk' | 'us'`, default: `uk`

Abide by the ways the international community defines an abbreviated title.
American and Canadian English follow slightly different rules for abbreviated
titles than British and Australian English. In North American English, titles
before a name require a period: `Mr., Mrs., Ms., Dr.`. In British and Australian
English, no periods are used in these abbreviations.

```ts
const name = new Namefully({
    prefix: 'Mr',
    firstname: 'John',
    lastname: 'Smith'
}, { titling: 'us' })
console.log(name.full()) // => Mr. John Smith
console.log(name.px()) // => Mr.
```

### ending

`boolean`, default: `false`

Set an ending character after the full name (a comma before the suffix actually).

```ts
const name = new Namefully({
    prefix: 'Mr',
    firstname: 'John',
    lastname: 'Smith',
    suffix: 'PhD'
}, { ending: true })
console.log(name.full()) // => Mr John Smith, PhD
```

### lastnameFormat

`string: 'father' | 'mother' | 'hyphenated' | 'all'`, default: `father`

Defines the distinct formats to output a compound surname (e.g., Hispanic
surnames).

```ts
import { Namefully, Firstname, Lastname } from 'namefully'

const fn = new Firstname('Jaden')
const ln = new Lastname('Smith', 'Pinkett')
const name = new Namefully([fn, ln], { lastnameFormat: 'hyphenated' })
console.log(name.full()) // => Jaden Smith-Pinkett
```

### bypass

`boolean`, default: `false`

Skip all the validators (i.e., validation rules, regular expressions).

```ts
const name = new Namefully('2Pac Shakur', { bypass: true }) // normally would fail the regex
console.log(name.fn()) // => 2Pac
```

> NOTE: This option can help to trick the utility and allow us to use it for
> unsupported languages or inner contents like prefixes or suffixes. For example,
> the Hindi characters will not pass the validation rules. Or, the Spanish
> equivalent for `Mr` => `Sr` will raise an exception as it is not part of the
> predefined prefixes.

### parser

`object`, default: `null`

Customize your own parser to indicate the full name yourself.

```ts
import { Namefully, Firstname, Lastname, Parser } from 'namefully'

// Suppose you want to cover this '#' separator
class MyParser implements Parser<string> {
    constructor(public raw: string) {}
    parse() {
        const [fn, ln] = this.raw.split('#');
        return {
            firstname: new Firstname(fn),
            lastname: new Lastname(ln),
        }
    }
}

const name = new Namefully(null, { parser: new MyParser('Juan#Garcia') })
console.log(name.full()) // => Juan Garcia
```

To sum up, the default values are:

```json
{
    "orderedBy": "firstname",
    "separator": " ",
    "titling": "uk",
    "ending": false,
    "lastnameFormat": "father",
    "bypass": false,
    "parser": null
}
```

## Concepts and examples

The name standards used for the current version of this library are as
follows:

```[Prefix] Firstname [Middlename] Lastname [Suffix]```

The opening `[` and closing `]` brackets mean that these parts are optional. In
other words, the most basic/typical case is a name that looks like this:
`John Smith`, where `John` is the *Firstname* and `Smith`, the *Lastname*.

> NOTE: Do notice that the order of appearance matters and (as shown [here](#orderedBy))
> can be altered through configured parameters. By default, the order of appearance
> is as shown above and will be used as a basis for future examples and use cases.

Once imported, all that is required to do is to create an instance of
`Namefully` and the rest will follow.

### Basic cases

Let us take a common example:

```Mr John Joe Smith PhD```

So, this utility understands the name parts as follows:

- typical name: `John Smith`
- first name: `John`
- middle name: `Joe`
- last name: `Smith`
- prefix: `Mr`
- suffix: `PhD`
- full name: `Mr John Joe Smith PhD`
- birth name: `John Joe Smith`
- zipped: `John J. Smith`
- initials: `J J S`
- usernames: `jsmith, johnsmith`, etc.

### Limitations

`namefully` does not have support for certain use cases:

- mononame:  `Plato`. It can be tricked though by setting the mononame as both
first and last name;
- multiple surnames: `De La Cruz`, `Da Vinci`. You can also trick it using your
own parsing method or setting separately each name part via the `Nama|Name` type
or the string array input;
- multiple prefixes: `Prof. Dr. Einstein`. An alternative would be to use the `bypass` option.

See the [use cases](usecases) for further details.

## API

| Name | Arguments | Default | Returns | Description |
|---|---|---|---|---|
|*getPrefix*|none|none|`string`|Gets the prefix part of the full name, if any|
|*getFirstname*|`includeAll`|`true`|`string`|Gets the first name part of the full name|
|*getMiddlenames*|none|none|`string[]`|Gets the middle name part of the full name, if any|
|*getLastname*|`format`|`null`|`string`|Gets the last name part of the full name|
|*getSuffix*|none|none|`string`|Gets the suffix part of the full name, if any|
|*getFullname*|`orderedBy`|`null`|`string`|Gets the full name|
|*getBirthname*|`orderedBy`|`null`|`string`|Gets the birth name, no prefix or suffix|
|*getInitials*|`orderedBy`, `withMid`|`null`, `false`|`string`|Gets the initials of the first and last names|
|*describe*|`nameType`|`null`|`Summary`|Gives some descriptive statistics of the characters' distribution.|
|*shorten*|`orderedBy`|`null`|`string`|Returns a typical name (e.g. first and last name)|
|*compress*|`limit`, `by`|`20`, `middlename`|`string`|Compresses a name using different forms of variants|
|*username*|none|none|`string[]`|Suggests possible (randomly) usernames closest to the name|
|*format*|`how`|`null`|`string`|Formats the name as desired|
|*zip*|`nameType`|`null`|`string`|Shortens a full name|
|*size*|none|none|`number`|Returns the count of characters of the birth name, excluding punctuations|
|*ascii*|`options`|`{}`|`number[]`|Returns an ascii representation of each characters|
|*to*|`case`|none|`string`|Transforms a birth name to a specific title case|
|*passwd*|`nameType`|`null`|`string`|Returns a password-like representation of a name|

## Aliases

If you find the names of the methods somewhat too long, we provide aliases to make
your life easier as a coder.

|Method|Aliases|
|---|---|
|*getPrefix*|*px*|
|*getSuffix*|*sx*|
|*getFirstname*|*fn*|
|*getLastname*|*ln*|
|*getMiddlenames*|*mn*|
|*getFullname*|*full*|
|*getBirthname*|*birth*|
|*getInitials*|*inits*|
|*describe*|*stats*|

## Author

Developed by [Ralph Florent](https://github.com/ralflorent).

## License

The underlying content of this utility is licensed under [MIT](LICENSE).

<!-- References -->
[version-img]: https://img.shields.io/npm/v/namefully
[version-url]: https://www.npmjs.com/package/namefully
[circleci-img]: https://circleci.com/gh/ralflorent/namefully.svg?style=shield
[circleci-url]: https://circleci.com/gh/ralflorent/namefully
[codecov-img]: https://codecov.io/gh/ralflorent/namefully/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ralflorent/namefully
[license-img]: https://img.shields.io/npm/l/namefully
[license-url]: https://opensource.org/licenses/MIT
