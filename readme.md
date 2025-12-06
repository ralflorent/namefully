# namefully

[![npm version][version-img]][version-url]
[![JSR Version][jsr-version]][jsr-url]
[![CI build][ci-img]][ci-url]
[![MIT License][license-img]][license-url]

Human name handling made easy.
[Try it live](https://stackblitz.com/edit/namefully).

## Documentation

Check out the official documentation at
[namefully.netlify.app](https://namefully.netlify.app).

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
6. Build a name on the fly (via a builder)

## Installation

```bash
npm i namefully
```

## Dependencies

None.

## Related packages

This package is also available in [Angular](https://angular.io/) and
[React](https://reactjs.org/):

- [@namefully/react](https://www.npmjs.com/package/@namefully/react)
- [@namefully/ng](https://www.npmjs.com/package/@namefully/ng)

## Usage

See [examples] or [test cases][test-cases] for more details. Here's a glimpse at
what this utility does:

```ts
import { Namefully } from 'namefully';

const name = new Namefully('Thomas Alva Edison');
console.log(name.short); // Thomas Edison
console.log(name.public); // Thomas E
console.log(name.initials()); // ['T', 'A', 'E']
console.log(name.format('L, f m')); // EDISON, Thomas Alva
console.log(name.zip()); // Thomas A. E.
```

> **Note** that if you intend to use this utility for non-standard name cases such as
> multiple first, middle or last names, use `Namefully.parse()` or `NameBuilder` instead.

## `Config` and default values

`Config` represents a series of configurable parameters used to control and customize
how `Namefully` objects get created.

The multiton pattern is used to allow unique settings across `Namefully` objects.
This is quite useful for avoiding confusion when building other name components such
as `FirstName`, `LastName`, or `Name` that may not often follow the same pattern,
rule or behavior in your application.

Below are enlisted the options supported by `namefully`.
> All enums can be provided as `string` as well. There's no need to bring them in
> when using TypeScript.

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
const name2 = new Namefully(['Edison', 'Thomas'], { orderedBy: 'lastname' });
console.log(name2.first); // Thomas
```

> **Note** that this option also affects all the other results of the API. In other
> words, the results will prioritize the order of appearance set in the first
> place for the other operations. Keep in mind that in some cases, it can be
> altered on the go. See the example below.

```ts
// 'Smith' is the surname in this raw string case
const name = new Namefully('Smith John Joe', { orderedBy: 'lastname' });
console.log(name.fullName()); // Smith John Joe

// Now alter the order by choosing the given name first
console.log(name.fullName(NameOrder.FIRST_NAME)); // John Joe Smith
```

### separator

`Separator` - default: `Separator.SPACE`

_Only valid for raw string values_, this option indicates how to split the parts
of a raw string name under the hood.

```ts
const name = new Namefully('John,Smith', { separator: ',' });
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
const name = new Namefully(
  { firstName: 'John', lastName: 'Smith', suffix: 'Ph.D'},
  { ending: true },
)
console.log(name.full) // John Smith, Ph.D
console.log(name.suffix) // Ph.D
```

### surname

`Surname` - default: `Surname.FATHER`

Defines the distinct formats to output a compound surname (e.g., Hispanic surnames).

```ts
const name = new Namefully(
  [new FirstName('John'), new LastName('Doe', 'Smith')],
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
  title: Title.UK,
  ending: false,
  bypass: true,
  surname: Surname.FATHER
}
```

## Do It Yourself

Customize your own parser to indicate the full name yourself.

```ts
import { IConfig, FullName, Namefully, Parser } from 'namefully';

// Suppose you want to cover this '#' separator
class SimpleParser extends Parser<string> {
  parse(options: IConfig): FullName {
    const [firstName, lastName] = this.raw.split('#');
    return FullName.parse({ firstName, lastName }, Config.merge(options));
  }
}

const name = new Namefully(new SimpleParser('Juan#Garcia'));
console.log(name.full); // Juan Garcia
```

**Or** use `NameIndex` to specify where the name parts are located in a text.

```ts
import { Namefully, NameIndex } from 'namefully';

const indexing = NameIndex.only({ firstName: 0, lastName: 3 });
const name = Namefully.tryParse('Dwayne "The Rock" Johnson', indexing);
console.log(name.full); // Dwayne Johnson
```

**Or** simply use `NameBuilder` to build a name on the fly (with lifecycle hooks if needed).

```ts
import { Name, NameBuilder } from 'namefully';

const builder = NameBuilder.of(Name.first('Nikola')); // can be more than one name
builder.add(Name.last('Tesla'));
builder.add(Name.prefix('Mr'));

const name = builder.build() // with options if needed
console.log(name.full); // Mr Nikola Tesla
```

## Concepts and examples

The name standards (inspired by this [UK name guide][name-standards]) used for
the current version of this library are as follows:

`[prefix] firstName [middleName] lastName [suffix]`

The opening `[` and closing `]` brackets mean that these parts are optional. In
other words, the most basic/typical case is a name that looks like this:
`John Smith`, where `John` is the _firstName_ and `Smith`, the _lastName_.

> Do notice that the order of appearance matters and (as shown in [orderedBy](#orderedby))
> can be altered through configured parameters. By default, the order of appearance
> is as shown above and will be used as a basis for future examples and use cases.

Once imported, all that is required to do is to create an instance of
`Namefully` and the rest will follow. Keep in mind that all name parts must have
at least one (1) character to proceed.

### Basic cases

Let us take this example with all the parts:

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
- salutation: `Mr Smith`

### Limitations

`namefully` does not support certain use cases:

- mononame: `Plato` - a workaround is to set the mononame as both first and last name;
- nickname: `Dwayne "The Rock" Johnson` - use custom parser instead.
- multiple prefixes or suffixes: `Prof. Dr. Einstein`.

## Contributing

Visit [CONTRIBUTING.md][contributing-url] for details on the contribution guidelines,
the code of conduct, and the process for submitting pull requests.

## License

The underlying content of this utility is licensed under [MIT License][license-url].

<!-- References -->

[version-img]: https://img.shields.io/npm/v/namefully
[version-url]: https://www.npmjs.com/package/namefully
[jsr-version]: https://jsr.io/badges/@ralflorent/namefully
[jsr-url]: https://jsr.io/@ralflorent/namefully
[ci-img]: https://github.com/ralflorent/namefully/workflows/build/badge.svg
[ci-url]: https://github.com/ralflorent/namefully/actions/workflows/ci.yml
[license-img]: https://img.shields.io/npm/l/namefully
[license-url]: https://opensource.org/licenses/MIT

[contributing-url]: https://github.com/ralflorent/namefully/blob/main/CONTRIBUTING.md
[examples]: https://github.com/ralflorent/namefully/tree/main/example
[test-cases]: https://github.com/ralflorent/namefully/tree/main/src/namefully.spec.ts
[name-standards]: https://www.fbiic.gov/public/2008/nov/Naming_practice_guide_UK_2006.pdf
