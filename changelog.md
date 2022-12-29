# Change Log

This file contains the documentation on the notable changes and bug fixes, and
is formatted following this [standard](https://keepachangelog.com/en/1.0.0/).
This project also adheres to [Semantic Versioning](https://semver.org/).

## [1.2.0] - 2022-12-30

- Improved usability of `Config`
- Improved error handling `NameError`
- Added named constructors for `Name`
- Used convenient getters (e.g., `FirstName.hasMore`, `LastName.hasMother`)
- Applied small refactoring: introduce additional class members
- Added support for initials in `format`
- Added text parser for dynamic birth names (ordered by first name)
- Reconfigured CI build setup via GitHub actions
- Improved API documentation
- Breaking changes:
  - changed to a simpler file structure
  - used JavaScript naming convention for class members, methods and functions (e.g. `firstName`)
  - `prefix` and `suffix` are now available as class members
  - used semantic names instead for types (e.g.,`titling` -> `title`; `lastnameFormat` -> `surname`)
  - removed support for summary, ascii and password fields.

## [1.1.0] - 2020-07-05

**Added**:

- Add a full name builder to construct `Namefully`
- Augment a `namon` functionality
  - capitalize
  - decapitalize
  - normalize
  - reset
- Add ASCII representations
- Add password-like representations
- Add support for title cases
- Add support for birth names (full name without prefix or suffix)
- Add test coverage for all the API methods
- Update use cases for new features
- Use string formats (`short`, `long`, `official`) when formatting a name

**Fixed**:

- Support space in regex
- Use simplified regex
- Support for more than one name parts in a first name
- Revert changes in `compress(...)`: always include a token in the compressed part.
- Switch to MIT License

## [1.0.9] - 2020-05-18

**Added**:

- Add support for Cyrillic and Greek alphabet

**Fixed**:

- Fix validation rules (regex) for specific fields

## [1.0.8] - 2020-04-18

**Added**:

- Add short API equivalent for `compress` => `zip`
- Add `lastnameFormat` option to config and surname subparts handling
- Refactor return values for `describe` (object instead of string)
- Add support for titling when compressing or zipping

**Fixed**:

- Fix missing bypass for fullname validator
- Fix logic for name parts handling in `Firstname` class

## [1.0.7] - 2020-03-28

**Added**:

- Add `titling` option to config
- Add support for prefixes and suffixes when formatting names
  - including a clear cut for (de)-capitalized official names

**Fixed**:

- Fix wrong ending reference for suffixes

## [1.0.6] - 2020-03-20

**Added**:

- Add support for Latin (European and Spanish) names
- Add a bypass to skip validation rules (regex)

## [1.0.5] - 2020-03-17

**Added**:

- Add optional parameters for the `getFullname` and `getInitials` API;
  - Users can forcefully alter order of appearance the full name and initials;
- Add optional parameters for the `describe` API;
  - Users can either decide to describe the full name or some specific name parts;
- Introduce new option in `Namefully` creation;
  - `ending` accepts a separator for to mark an ending suffix;
- Add some jsdoc comments to document the API;
- Add some aliases to the API.

**Fixed**:

- Fix validation error for string array input using wrong/insufficient entries;
- Fix options in `Namefully` creation;
  - `orderedBy` accepts now two name parts only (first or last name);
  - `separator` works as the splitting name factor;
- Fix the order of appearance for the full name and `compress` API.

## [1.0.3] - 2020-03-11

**Fixed**:

- Fix typescript compilation for ES2015, UMD
- Fix `namefully` version

## [1.0.2] - 2020-03-11

**Added**:

- Add use cases
- Add test coverage
- Add setup CI/CD
- Add support for UMD
- Make validation error message more explicit

## [1.0.1] - 2020-03-07

**Fixed**:

- Fix typo in readme
- Fix build system for npm

## [1.0.0] - 2020-03-07

Initial version

[1.2.0]: https://github.com/ralflorent/namefully/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ralflorent/namefully/compare/v1.0.9...v1.1.0
[1.0.9]: https://github.com/ralflorent/namefully/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/ralflorent/namefully/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/ralflorent/namefully/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/ralflorent/namefully/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/ralflorent/namefully/compare/v1.0.3...v1.0.5
[1.0.3]: https://github.com/ralflorent/namefully/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/ralflorent/namefully/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ralflorent/namefully/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ralflorent/namefully/releases/tag/v1.0.0
