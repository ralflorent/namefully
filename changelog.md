# Change Log

This file contains the documentation on the notable changes and bug fixes, and
is formatted following this [standard](https://keepachangelog.com/en/1.0.0/).
This project also adheres to [Semantic Versioning](https://semver.org/)

## [1.0.4] - 2020-03-17

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

[1.0.3]: https://github.com/ralflorent/namefully/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/ralflorent/namefully/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ralflorent/namefully/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ralflorent/namefully/releases/tag/v1.0.0
