# namefully

[![npm version][version-img]][version-url]
[![CircleCI][circleci-img]][circleci-url]
[![Coverage Status][codecov-img]][codecov-url]
[![GPL-3.0 License][license-img]][license-url]

## Description

Person name handler. [Try it live](https://stackblitz.com/edit/namefully).

## Documentation

Check out the official documentation at [https://namefully.netlify.app/](https://namefully.netlify.app/).

## Motivation

Have you ever had to format a user's name in a particular order (or shape)?
Probably yes. If not, it will come at some point. Be patient. Anyway, that is
simple and easy to implement. Then, a new requirement for a different project
comes up and demands that you reuse and/or readjust that old implementation for some
reason. And trust me, more requirements will keep coming, and you'll have to do
it over and over. When you face this sort of situation on many occasions, it
surely becomes annoying and forces you to proceed by copy-paste. Well, as you
probably guess, that has been my situation for a while.

## Key features

1. Offer supports for Latin alphabet, including other European ones
(e.g., German, Greek, Cyrillic, Icelandic characters)
2. Accept different data shape as input
3. Allow a developer to configure optional parameters
4. Accept customized parsers (do it yourself)
5. Format a name as desired
6. Offer support for prefixes and suffixes
7. Suggest possible usernames associated with the name
8. Allow hyphenated names, including with apostrophes

## Advanced features

1. Alter the order of appearance of a name: by given name or surname
2. Handle various subparts of a surname
3. Use tokens (separators) to reshape prefixes and suffixes

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
console.log(name.zip()) // => John J Smith
```

> NOTE: The package comes with its own declaration file for
> [TypeScript](https://www.typescriptlang.org/) support.

## Options and default values

Below are enlisted the options supported by `namefully`.

### orderedBy

`string: 'firstname' | 'lastname'`, default: `firstname`

Indicate in what order the names appear when set as a raw string values or
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
> future operations. Keep in mind that in some cases it can be altered. See the example below.

```ts
// 'Smith' is the surname in this raw string case
const name = new Namefully('Smith John Joe', { orderedBy: 'lastname' })
console.log(name.full()) // => Smith John Joe

// Now alter the order by choosing the given name first
console.log(name.full('firstname')) // => John Joe Smith
```

### separator

`string: ':' | ',' | '-', | ',' | ' ' | '_'`, default: `(space)`

Only valid for raw string values, this option indicates how to split the parts of
a raw string name under the hood.

```ts
const name = new Namefully('Adam,Sandler', { separator: ',' })
console.log(name.full()) // => Adam Sandler
```

### titling

`string: 'uk' | 'us'`, default: `uk`

Define the ways the international community defines an abbreviated title.
American and Canadian English follow slightly different rules for abbreviated
titles than British and Australian English. In North American English, titles
before a name require a period: `Mr., Mrs., Ms., Dr.`. In British and Australian
English, no full stops are used in these abbreviations.

```ts
const name = new Namefully({
    prefix: 'Mr',
    firstname: 'John',
    lastname: 'Smith'
}, { titling: 'us' })
console.log(name.full()) // => Mr. John Smith
console.log(name.zip('fn')) // => Mr. J. Smith
```

### ending

`string: ':' | ',' | '-', | ',' | ' ' | '_'`, default: `(space)`

Set an ending character after the full name (before the suffix actually).

```ts
const name = new Namefully({
    prefix: 'Mr',
    firstname: 'John',
    lastname: 'Smith',
    suffix: 'PhD'
}, { ending: ',' })
console.log(name.full()) // => Mr. John Smith, PhD
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

Skip all the validators (or validation rules using regular expressions).

```ts
const name = new Namefully('2Pac Shakur', { bypass: true }) // normally would fail the regex
console.log(name.full()) // => 2Pac Shakur
```

> NOTE: This option can help to trick the utility and allow us to use it for
> unsupported languages or inner contents like prefixes or suffixes. For example,
> the Cyrillic alphabet will not pass the validation rules. Or, the Spanish
> equivalent for `Mr` => `Sr` will cause a failure of the utility. Do note though
> you risk facing some validation errors for certain API.

### parser

`object`, default: `null`

Customize your own parser to indicate the full name yourself.

```ts
import { Namefully, Firstname, Lastname, Parser } from 'namefully'

// Suppose you want to cover this '#' separator
class MyParser implements Parser<string> {
    constructor(public raw: string) {}
    parse() {
        const names = this.raw.split('#');
        return {
            firstname: new Firstname(names[0]),
            lastname: new Lastname(names[1]),
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
    "ending": " ",
    "lastnameFormat": "father",
    "bypass": false,
    "parser": null
}
```

## Concepts and Examples

The name standards used for the current version of this library are as
follows:

```[Prefix] Firstname [Middlename] Lastname [Suffix]```

The opening `[` and closing `]` brackets mean that these parts are optional. In
other words, the most basic/typical case is a name that looks like this:
`John Smith`, where `John` is the *Firstname* and `Smith`, the *Lastname*.

> NOTE: Keep in mind that the order of appearance matters and (as shown [here](#orderedBy)) can be
> altered through configured parameters. By default, the order of appearance is
> as shown above and will be used as a basis for future examples and use cases.

Once imported, all that is required to do is to create an instance of
`Namefully` and the rest will follow.

### Basic cases

Let us take a common example:

```Mr John Joe Smith PhD```

So, this utility understands the name parts as follows:

- a typical name: `John Smith`
  - with middle name: `John Joe Smith`
  - with prefix: `Mr John Smith`
  - with suffix: `John Smith, PhD`
  - with both prefix and suffix: `Mr John Smith, PhD`
  - full name: `Mr. John Joe Smith, PhD`
- zipped: `John J Smith`
- possible usernames: `jsmith, johnsmith, j.smith`, etc.

### Limitations

`namefully` does not have support for certain use cases:

- mononame:  `Plato`. You can still trick it though by setting the mononame as both
first and last name;
- multiple surnames: `De La Cruz`, `Da Vinci`. You can also trick it by using your
own parsing method or by setting separately each name part via the `Nama|Name` type
or the string array input;
- multiple prefixes: `Prof. Dr. Einstein`. An alternative would be to use the `bypass` option.

See the [use cases](usecases) for further details.

## API

| Name | Arguments | Default | Returns | Description |
|---|---|---|---|---|
|*getPrefix*|none|none|`string`|Gets the prefix part of the full name, if any|
|*getFirstname*|none|none|`string`|Gets the first name part of the full name|
|*getMiddlenames*|none|none|`string[]`|Gets the middle name part of the full name|
|*getLastname*|none|none|`string`|Gets the last name part of the full name|
|*getSuffix*|none|none|`string`|Gets the suffix part of the full name, if any|
|*getFullname*|`orderedBy`|`null`|`string`|Gets the full name|
|*getInitials*|`orderedBy`, `withMid`|`null`, `false`|`string`|Gets the initials of the first and last name|
|*describe*|`what`|`fullname`|`object`|Gives some descriptive statistics of the characters' distribution.|
|*shorten*|`orderedBy`|`null`|`string`|Returns a typical name (e.g. first and last name)|
|*compress*|`limit`, `by`|`20`, `middlename`|`string`|Compresses a name by using different forms of variants|
|*username*|none|none|`string[]`|Suggests possible (randomly) usernames closest to the name|
|*format*|`how`|`null`|`string`|Formats the name as desired|
|*zip*|`by`|`null`|`string`|Shortens a full name|

## Aliases

If you find the names of the method somewhat too long, we provide aliases to make
your life easier as a coder.

|Method|Aliases|
|---|---|
|*getPrefix*|*px*|
|*getSuffix*|*sx*|
|*getFirstname*|*fn*|
|*getLastname*|*ln*|
|*getMiddlenames*|*mn*|
|*getFullname*|*full*|
|*getInitials*|*inits*|
|*describe*|*stats*|

## Author

Developed by [Ralph Florent](https://github.com/ralflorent).

## License

The underlying content of this utility is licensed under [GPL-3.0](LICENSE).

<!-- References -->
[version-img]: https://img.shields.io/npm/v/namefully
[version-url]: https://www.npmjs.com/package/namefully
[circleci-img]: https://circleci.com/gh/ralflorent/namefully.svg?style=shield
[circleci-url]: https://circleci.com/gh/ralflorent/namefully
[codecov-img]: https://codecov.io/gh/ralflorent/namefully/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ralflorent/namefully
[license-img]: https://img.shields.io/npm/l/namefully
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html
