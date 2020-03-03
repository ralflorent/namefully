# namefully

## Description

Name handler

## Concept

Given a string name, manipulate the chuncks of the name as desired while
considering some variants: language, non-unicode chars, latin-like, etc.

## Objectives

- javascript module registered on npm, yarn registries
- typescript definitely typed and compiled
- ng-namefully for angular framework
- react-namefully for react library
- (equivalent for python)

## Dependencies

- string utils (if necessary)

## To consider

- testing
- browser support
- build systems
- CI / CD

## Expected API

Given a name 'Joe Smith':

- body parts (first, last, mid name, prefix, suffix)
- initials
- digital signature
- alphabet

---

- describe (descriptive stats: count, freq, top, unique)
- shorten
- lenghten
- compress
- decompress
- unicode (equivalent of non-unicode chars: ASCII)
- intl (equivalent in other alphabets: e.g., cyrillic)
- username (suggest usernames)
- email (suggest emails)
- root (origin and meaning of components)
- format (PASSPORT, VISA, TICKETS, etc)
- [to be continued]

## License

The underlying content of this project is licensed under [GPLv3](LICENSE).
