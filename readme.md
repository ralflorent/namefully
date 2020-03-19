# namefully

[![npm version][version-img]][version-url]
[![CircleCI][circleci-img]][circleci-url]
[![Coverage Status][codecov-img]][codecov-url]
[![GPL-3.0 License][license-img]][license-url]

## Description

Person name handler in the Latin alphabet.

## Installation

```bash
npm i namefully
```

## Dependencies

None

## Usage

```ts
// ES6 modules or typescript
import { Namefully } from 'namefully'

const name = new Namefully('John Joe Smith')
console.log(name.format('L, f m')) // => SMITH, John Joe
```

or

```js
// CommonJS
const { Namefully } = require('namefully')

const name = new Namefully('John Joe Smith')
console.log(name.format('L, f m')) // => SMITH, John Joe
```

The package comes with its own declaration file for TypeScript support.

## Support

This utility supports names of the following nature:

- English
- European (e.g., German, Icelandic names)
- Spanish
- hyphenated
- with apostrophe
- with comma
- with a period
- with space

**IMPORTANT**:
*If you want to use this utility while it does not offer support for your language (*
*e.g., Cyrillic alphabet), you can always bypass the validation rules by configuring*
*an optional parameter `bypass` to `true`. Do note though that you risk to face*
*some validation errors for certain API.*

## Examples

Note that the name standards used for the current version of this library are as
follows:
```[Prefix] Firstname [Middlename] Lastname [Suffix]```.
The opening `[` and closing `]` brackets mean that these parts are optional. In
other words, the most basic and typical case is a name that looks like this:
`John Smith`, where `John` is the first name and `Smith`, the last name.

**IMPORTANT**: *Keep in mind that the order of appearance matters and can be*
*altered through configured parameters. By default, the order of appearance is*
*as shown above and will be used as a basis for future examples and use cases.*

Once imported, all that is required to do is to create an instance of
`Namefully` and the rest will follow.

### Basic case

Let us take a common example:

```Mr. John Joe Smith, PhD```

So, we understand that the name can be seen as follows:

- a typical name: `John Smith`
  - with middle name: `John Joe Smith`
  - with prefix: `Mr John Smith`
  - with suffix: `John Smith, PhD`
  - with both prefix and suffix: `Mr John Smith, PhD`
  - full name: `Mr. John Joe Smith, PhD`
- possible usernames: `jsmith, johnsmith, j.smith`, etc.

### The allowed punctuation

So far, we allowed the following punctuations: comma, period, apostrophe
(single quote), and hyphen.

### Special cases not being covered so far

`namefully` does not have support for certain use cases:

- mononame:  `Plato`. You can still trick it though by setting the mononame as both
first and last name;
- multiple surnames: `De La Cruz`, `Da Vinci`. You can also trick it by using your
own parsing method or by setting separately each name part via the `Nama|Name` type
or the string array input.

## APIs

| Name | Arguments | Default | Returns | Description |
|---|---|---|---|---|
|*getPrefix*|none|none|`string`|Gets the prefix part of the full name, if any|
|*getFirstname*|none|none|`string`|Gets the first name part of the full name|
|*getMiddlenames*|none|none|`string[]`|Gets the middle name part of the full name|
|*getLastname*|none|none|`string`|Gets the last name part of the full name|
|*getSuffix*|none|none|`string`|Gets the suffix part of the full name, if any|
|*getFullname*|`orderedBy`|`null`|`string`|Gets the full name|
|*getInitials*|`orderedBy`, `withMid`|`null`, `false`|`string`|Gets the initials of the first and last name|
|*describe*|`what`|`fullname`|`string`|Gives some descriptive statistics that summarize the central tendency, dispersion and shape of the characters' distribution.|
|*shorten*|`orderedBy`|`null`|`string`|Returns a typical name (e.g. first and last name)|
|*compress*|`limit`, `by`|`20`, `middlename`|`string`|Compresses a name by using different forms of variants|
|*username*|none|none|`string[]`|Suggests possible (randomly) usernames closest to the name|
|*format*|`how: string`|`null`|`string`|Formats the name as desired|

If you find the names of the method somewhat too long, we provide aliases to make
your life as a coder easier.

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

See the [use cases](usecases) for further details.

## Author

Developed by [Ralph Florent](https://github.com/ralflorent)

## License

The underlying content of this project is licensed under [GPL-3.0](LICENSE).

[version-img]: https://img.shields.io/npm/v/namefully
[version-url]: https://www.npmjs.com/package/namefully
[circleci-img]: https://circleci.com/gh/ralflorent/namefully.svg?style=shield
[circleci-url]: https://circleci.com/gh/ralflorent/namefully
[codecov-img]: https://codecov.io/gh/ralflorent/namefully/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ralflorent/namefully
[license-img]: https://img.shields.io/npm/l/namefully
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html
