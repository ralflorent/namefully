# namefully

[![CircleCI](https://circleci.com/gh/ralflorent/namefully.svg?style=shield)](https://circleci.com/gh/ralflorent/namefully)
[![codecov](https://codecov.io/gh/ralflorent/namefully/branch/master/graph/badge.svg)](https://codecov.io/gh/ralflorent/namefully)

## Description

Person name handler in the English alphabet.

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
const Namefully = require('namefully').Namefully

const name = new Namefully('John Joe Smith')
console.log(name.format('L, f m')) // => SMITH, John Joe
```

The package comes with its own declaration file for TypeScript support.

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

So, we undertand that the name can be seen as follows:

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

### Special cases not being covered/considered so far

- mononym:  `Plato`
- multiple last names: `De La Cruz`, `Da Vinci`
- latin last names: `Perez Rodriguez`
- hyphenated last name: `Pinkett-Smith`
- last name with apostrophe: `O'Connell`, `O'Connor`
- nicknames: `Johnny`

## APIs

| Name | Arguments | Default | Returns | Description |
|---|---|---|---|---|
|*getPrefix*|none|none|`string`|Gets the prefix part of the full name, if any|
|*getFirstname*|none|none|`string`|Gets the first name part of the full name|
|*getMiddlenames*|none|none|`string[]`|Gets the middle name part of the full name|
|*getLastname*|none|none|`string`|Gets the last name part of the full name|
|*getSuffix*|none|none|`string`|Gets the suffix part of the full name, if any|
|*getFullname*|none|none|`string`|Gets the full name|
|*getInitials*|none|none|`string`|Gets the initials of the first and last name|
|*describe*|none|none|`string`|Gives some descriptive statistics that summarize the central tendency, dispersion and shape of the characters' distribution.|
|*shorten*|none|none|`string`|Returns a typical name (e.g. first and last name)|
|*compress*|`limit: number`, `by: NameType`|`20`, `middlename`|`string`|Compresses a name by using different forms of variants|
|*username*|none|none|`string[]`|Suggests possible (randomly) usernames closest to the name|
|*format*|`how: string`|`null`|`string`|Formats the name as desired|

See the [use cases](usecases) for further details.

## Author

Developed by [Ralph Florent](https://github.com/ralflorent)

## License

The underlying content of this project is licensed under [GPL-3.0](LICENSE).
