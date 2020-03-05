# namefully

## Description

Person name handler

## Concept

Given a string name, manipulate the chuncks of the name as desired while
considering some variants: language, non-unicode chars, latin-like, etc.

## Use cases and examples

English alphabet, ordered by first name:

- typical name `John Smith`
  - with middle name `John Joe Smith`
  - with prefix `Mr John Smith`
  - with suffix `John Smith, PhD`
  - with prefix and suffix `Mr John Smith, PhD`
- preferred name or nickname `Johnny`

## Special cases

- mononym:  `Plato`
- polynymous last names: `De La Cruz`, `Da Vinci`
- latin last names: `Perez Rodriguez`
- hyphenated last name: `Pinkett-Smith`
- last name with apostrophe: `O'Connell`, `O'Connor`
- middle names: `Stefani Joanne Angelina Germanotta`

## Objectives

- javascript module registered on npm, yarn registries
- typescript definitely typed and compiled
- ng-namefully for angular framework
- react-namefully for react library
- (equivalent for python)

## Dependencies

- string utils (if necessary)

## Things to consider

- testing
- browser support
- build systems
- CI / CD

## Expected API

Given a typical name `Mrs Jane O'Connor Pearson-Smith, PhD`:

- nama or body parts (first, last, mid name, prefix, suffix)
- initials
- digital signature
- alphabet
- stats

---

- describe (descriptive stats: count, freq, top, unique)
- shorten
- compress
- username (suggest usernames, 10+)
- format (as desired)

---

- unicode (equivalent of non-unicode chars: ASCII)
- intl (equivalent in other alphabets: e.g., cyrillic)
- root (origin and meaning of components)
- [to be continued]

## License

The underlying content of this project is licensed under [GPL-3.0](LICENSE).
