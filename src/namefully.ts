import { Config } from './config';
import { ALLOWED_TOKENS } from './constants';
import { InputError, NotAllowedError } from './error';
import { FullName } from './full-name';
import { Name, JsonName } from './name';
import { ArrayNameParser, ArrayStringParser, NamaParser, Parser, StringParser } from './parser';
import { Flat, NameOrder, NameType, Namon, Nullable, Surname } from './types';
import { capitalize, decapitalize, isNameArray, isStringArray, toggleCase } from './utils';

/**
 * A helper for organizing person names in a particular order, way, or shape.
 *
 * Though `namefully` is easy to use, it does not magically guess which part of
 * the name is what (prefix, suffix, first, last, or middle names). It relies
 * actually on how the name parts are indicated (i.e., their roles) so that
 * it can perform internally certain operations and saves us some extra
 * calculations/processing. In addition, `Namefully` can be created using
 * distinct raw data shapes. This is intended to give some flexibility to the
 * developer so that he or she is not bound to a particular data format.
 * By following closely the API reference to know how to harness its usability,
 * this utility aims to save time in formatting names.
 *
 * `namefully` also works like a trapdoor. Once a raw data is provided and
 * validated, a developer can only *access* in a vast amount of, yet effective
 * ways the name info. *No editing* is possible. If the name is mistaken, a new
 * instance of `Namefully` must be created. In other words, it's immutable.
 * Remember, this utility's primary objective is to help manipulate a person name.
 *
 * Note that the name standards used for the current version of this library
 * are as follows:
 *      `[prefix] firstName [middleName] lastName [suffix]`
 * The opening `[` and closing `]` symbols mean that these parts are optional.
 * In other words, the most basic and typical case is a name that looks like
 * this: `John Smith`, where `John` is the first name piece and `Smith`, the last
 * name piece.
 *
 * @see https://www.fbiic.gov/public/2008/nov/Naming_practice_guide_UK_2006.pdf
 * for more info on name standards.
 *
 * **IMPORTANT**: Keep in mind that the order of appearance (or name order) matters
 * and may be altered through configured parameters, which will be seen later.
 * By default, the order of appearance is as shown above and will be used as a
 * basis for future examples and use cases.
 *
 * Once imported, all that is required to do is to create an instance of
 * `Namefully` and the rest will follow.
 *
 * Some terminologies used across the library are:
 * - namon: 1 piece of name (e.g., first name)
 * - nama: 2+ pieces of name (e.g., first name + last name)
 *
 * Happy name handling 😊!
 */
export class Namefully {
  /** A copy of high-quality name data. */
  #fullName: FullName;

  /** Creates a name with distinguishable parts from a raw string content.
   * @param names element to parse.
   * @param options additional settings.
   *
   * An optional configuration may be provided with specifics on how to treat
   * a full name during its course. By default, all name parts are validated
   * against some basic validation rules to avoid common runtime exceptions.
   */
  constructor(names: string | string[] | Name[] | JsonName | Parser, options?: Partial<Config>) {
    this.#fullName = this.#toParser(names).parse(options);
  }

  /**
   * Constructs a `Namefully` instance from a text.
   *
   * It works like `parse` except that this function returns `null` where `parse`
   * would throw a `NameError`.
   */
  static tryParse(text: string): Namefully | undefined {
    try {
      return new this(Parser.build(text));
    } catch {
      return undefined;
    }
  }

  /**
   * Constructs a `Namefully` instance from a text.
   *
   * It throws a `NameError` if the text cannot be parsed. Use `tryParse`
   * instead if a `null` return is preferred over a throwable error.
   *
   * This operation is computed asynchronously, which gives more flexibility at
   * the time of catching the error (and stack trace if any). The acceptable
   * text format is a string composed of two or more name pieces. For instance,
   * `John Lennon`, or `John Winston Ono Lennon` are parsable names and follow
   * the basic name standard rules (i.e., first-middle-last).
   *
   * Keep in mind that prefix and suffix are not considered during the parsing
   * process.
   */
  static async parse(text: string): Promise<Namefully> {
    return Parser.buildAsync(text).then((parser) => new Namefully(parser));
  }

  /** The current configuration. */
  get config(): Config {
    return this.#fullName.config;
  }

  /** The number of characters of the `birthName`, including spaces. */
  get length(): number {
    return this.birth.length;
  }

  /** The prefix part. */
  get prefix(): Nullable<string> {
    return this.#fullName.prefix?.toString();
  }

  /** The firt name part. */
  get first(): string {
    return this.firstName();
  }

  /** The first middle name part if any. */
  get middle(): Nullable<string> {
    return this.hasMiddle ? this.middleName()[0] : undefined;
  }

  /** Returns true if any middle name has been set. */
  get hasMiddle(): boolean {
    return this.#fullName.has(Namon.MIDDLE_NAME);
  }

  /** The last name part. */
  get last(): string {
    return this.lastName();
  }

  /** The suffix part. */
  get suffix(): Nullable<string> {
    return this.#fullName.suffix?.toString();
  }

  /** The birth name part. */
  get birth(): string {
    return this.birthName();
  }

  /** The shortest version of a person name. */
  get short(): string {
    return this.shorten();
  }

  /** The longest version of a person name. */
  get long(): string {
    return this.birth;
  }

  /** The entire name set. */
  get full(): string {
    return this.fullName();
  }

  /** The first name combined with the last name's initial. */
  get public(): string {
    return this.format('f $l');
  }

  /** Returns the full name as set. */
  toString(): string {
    return this.full;
  }

  /** Fetches the raw form of a name piece. */
  get(namon: Namon): Nullable<Name | Name[]> {
    if (namon.equal(Namon.PREFIX)) return this.#fullName.prefix;
    if (namon.equal(Namon.FIRST_NAME)) return this.#fullName.firstName;
    if (namon.equal(Namon.MIDDLE_NAME)) return this.#fullName.middleName;
    if (namon.equal(Namon.LAST_NAME)) return this.#fullName.lastName;
    if (namon.equal(Namon.SUFFIX)) return this.#fullName.suffix;
    return undefined;
  }

  /** Whether this name is equal to another one from a raw-string perspective. */
  equal(other: Namefully): boolean {
    return this.toString() === other.toString();
  }

  /** Gets a JSON representation of the full name. */
  toJson(): JsonName {
    return {
      prefix: this.prefix,
      firstName: this.first,
      middleName: this.middleName(),
      lastName: this.last,
      suffix: this.suffix,
    };
  }

  /** Confirms that a name part has been set. */
  has(namon: Namon): boolean {
    return this.#fullName.has(namon);
  }

  /**
   * Gets the full name ordered as configured.
   *
   * The name order `orderedBy` forces to order by first or last name by
   * overriding the preset configuration.
   *
   * `Namefully.format` may also be used to alter manually the order of appearance
   * of full name.
   *
   * For example:
   * ```ts
   * const name = new Namefully('Jon Stark Snow');
   * console.log(name.fullName(NameOrder.LAST_NAME)); // "Snow Jon Stark"
   * console.log(name.format('l f m')); // "Snow Jon Stark"
   * ```
   */
  fullName(orderedBy?: NameOrder): string {
    const sep = this.config.ending ? ',' : '';
    const names: string[] = [];
    orderedBy = orderedBy || this.config.orderedBy;

    if (this.prefix) names.push(this.prefix);
    if (orderedBy === NameOrder.FIRST_NAME) {
      names.push(this.first, ...this.middleName(), this.last + sep);
    } else {
      names.push(this.last, this.first, this.middleName().join(' ') + sep);
    }
    if (this.suffix) names.push(this.suffix);

    return names.join(' ').trim();
  }

  /**
   * Gets the birth name ordered as configured, no `prefix` or `suffix`.
   *
   * @param orderedBy forces to order by first or last name by overriding the
   * preset configuration.
   */
  birthName(orderedBy?: NameOrder): string {
    orderedBy = orderedBy || this.config.orderedBy;
    return orderedBy === NameOrder.FIRST_NAME
      ? [this.first, ...this.middleName(), this.last].join(' ')
      : [this.last, this.first, ...this.middleName()].join(' ');
  }

  /**
   * Gets the first name part of the `FullName`.
   *
   * @param withMore determines whether to include other pieces of the first
   * name.
   */
  firstName(withMore = true): string {
    return this.#fullName.firstName.toString(withMore);
  }

  /** Gets the middle name part of the `FullName`. */
  middleName(): string[] {
    return this.#fullName.middleName.map((n) => n.value);
  }

  /**
   * Gets the last name part of the `FullName`.
   *
   * @param format overrides the how-to formatting of a surname output,
   * considering its sub-parts.
   */
  lastName(format?: Surname): string {
    return this.#fullName.lastName.toString(format);
  }

  /**
   * Gets the initials of the `FullName`.
   *
   * @param {options.orderedBy} forces to order by first or last name by
   * overriding the preset configuration.
   * @param
   *
   * For example, given the names:
   * - `John Smith` => `['J', 'S']`
   * - `John Ben Smith` => `['J', 'B', 'S']`.
   */
  initials(options?: { orderedBy?: NameOrder; only?: NameType }): string[] {
    const initials: string[] = [];
    const firstInits = this.#fullName.firstName.initials();
    const midInits = this.#fullName.middleName.map((n) => n.initials()[0]);
    const lastInits = this.#fullName.lastName.initials();

    const mergedOptions = {
      orderedBy: this.config.orderedBy,
      only: NameType.BIRTH_NAME,
      ...options,
    };
    const { orderedBy, only } = mergedOptions;

    if (only !== NameType.BIRTH_NAME) {
      if (only === NameType.FIRST_NAME) {
        initials.push(...firstInits);
      } else if (only === NameType.MIDDLE_NAME) {
        initials.push(...midInits);
      } else {
        initials.push(...lastInits);
      }
    } else if (orderedBy === NameOrder.FIRST_NAME) {
      initials.push(...firstInits, ...midInits, ...lastInits);
    } else {
      initials.push(...lastInits, ...firstInits, ...midInits);
    }
    return initials;
  }

  /**
   * Shortens a complex full name to a simple typical name, a combination of
   * first and last name.
   *
   * @param orderedBy forces to order by first or last name by overriding the
   * preset configuration.
   *
   * For a given name such as `Mr Keanu Charles Reeves`, shortening this name
   * is equivalent to making it `Keanu Reeves`.
   *
   * As a shortened name, the namon of the first name is favored over the other
   * names forming part of the entire first names, if any. Meanwhile, for
   * the last name, the configured `surname` is prioritized.
   *
   * For a given `FirstName FatherName MotherName`, shortening this name when
   * the surname is set as `mother` is equivalent to making it:
   * `FirstName MotherName`.
   */
  shorten(orderedBy?: NameOrder): string {
    orderedBy = orderedBy || this.config.orderedBy;
    return orderedBy === NameOrder.FIRST_NAME
      ? [this.#fullName.firstName.value, this.#fullName.lastName.toString()].join(' ')
      : [this.#fullName.lastName.toString(), this.#fullName.firstName.value].join(' ');
  }

  /**
   * Flattens a long name using the name types as variants.
   *
   * While @param limit sets a threshold as a limited number of characters
   * supported to flatten a `FullName`, @param by indicates which variant
   * to use when doing so. By default, a full name gets flattened by
   * `Flat.MIDDLE_NAME`.
   *
   * The flattening operation is only executed iff there is a valid entry and
   * it surpasses the limit set. In the examples below, let us assume that the
   * name goes beyond the limit value.
   *
   * Flattening a long name refers to reducing the name to the following forms.
   * For example, `John Winston Ono Lennon` flattened by:
   * * Flat.FIRST_NAME: => 'J. Winston Ono Lennon'
   * * Flat.MIDDLE_NAME: => 'John W. O. Lennon'
   * * Flat.LAST_NAME: => 'John Winston Ono L.'
   * * Flat.FIRST_MID: => 'J. W. O. Lennon'
   * * Flat.MID_LAST: => 'John W. O. L.'
   * * Flat.ALL: => 'J. W. O. L.'
   *
   * With the help of the @param recursive flag, the above operation can happen
   * recursively in the same order if the name is still too long. For example,
   * flattening `John Winston Ono Lennon` using the following params:
   * `flatten({ limit: 18, by: Flat.FIRST_NAME, recursive: true })`
   * will result in `John W. O. Lennon` and not `J. Winston Ono Lennon`.
   *
   * A shorter version of this method is `zip()`.
   */
  flatten(
    options: Partial<{
      limit: number;
      by: Flat;
      withPeriod: boolean;
      recursive: boolean;
      withMore: boolean;
      surname: Surname;
    }>,
  ): string {
    if (this.length <= options.limit) return this.full;

    const mergedOptions = {
      limit: 20,
      by: Flat.MIDDLE_NAME,
      withPeriod: true,
      recursive: false,
      withMore: false,
      ...options,
    };

    const { by, limit, recursive, withMore, withPeriod, surname } = mergedOptions;
    const sep = withPeriod ? '.' : '';
    const fn = this.#fullName.firstName.toString();
    const mn = this.middleName().join(' ');
    const ln = this.#fullName.lastName.toString();
    const hasMid = this.hasMiddle;
    const f = this.#fullName.firstName.initials(withMore).join(sep + ' ') + sep;
    const l = this.#fullName.lastName.initials(surname).join(sep + ' ') + sep;
    const m = hasMid ? this.#fullName.middleName.map((n) => n.initials()[0]).join(sep + ' ') + sep : '';
    let name: string[] = [];

    if (this.config.orderedBy === NameOrder.FIRST_NAME) {
      switch (by) {
        case Flat.FIRST_NAME:
          name = hasMid ? [f, mn, ln] : [f, ln];
          break;
        case Flat.LAST_NAME:
          name = hasMid ? [fn, mn, l] : [fn, l];
          break;
        case Flat.MIDDLE_NAME:
          name = hasMid ? [fn, m, ln] : [fn, ln];
          break;
        case Flat.FIRST_MID:
          name = hasMid ? [f, m, ln] : [f, ln];
          break;
        case Flat.MID_LAST:
          name = hasMid ? [fn, m, l] : [fn, l];
          break;
        case Flat.ALL:
          name = hasMid ? [f, m, l] : [f, l];
          break;
      }
    } else {
      switch (by) {
        case Flat.FIRST_NAME:
          name = hasMid ? [ln, f, mn] : [ln, f];
          break;
        case Flat.LAST_NAME:
          name = hasMid ? [l, fn, mn] : [l, fn];
          break;
        case Flat.MIDDLE_NAME:
          name = hasMid ? [ln, fn, m] : [ln, fn];
          break;
        case Flat.FIRST_MID:
          name = hasMid ? [ln, f, m] : [ln, f];
          break;
        case Flat.MID_LAST:
          name = hasMid ? [l, fn, m] : [l, fn];
          break;
        case Flat.ALL:
          name = hasMid ? [l, f, m] : [l, f];
          break;
      }
    }

    const flat = name.join(' ');
    if (recursive && flat.length > limit) {
      const next =
        by === Flat.FIRST_NAME
          ? Flat.MIDDLE_NAME
          : by === Flat.MIDDLE_NAME
            ? Flat.LAST_NAME
            : by === Flat.LAST_NAME
              ? Flat.FIRST_MID
              : by === Flat.FIRST_MID
                ? Flat.MID_LAST
                : by === Flat.MID_LAST
                  ? Flat.ALL
                  : by === Flat.ALL
                    ? Flat.ALL
                    : by;
      if (next === by) return flat;
      return this.flatten({ ...options, by: next });
    }
    return flat;
  }

  /**
   * Zips or compacts a name using different forms of variants.
   *
   * @see `flatten()` for more details.
   */
  zip(by = Flat.MID_LAST, withPeriod = true): string {
    return this.flatten({ limit: 0, by, withPeriod });
  }

  /**
   * Formats the full name as desired.
   * @param pattern character used to format it.
   *
   * string format
   * -------------
   * - 'short': typical first + last name
   * - 'long': birth name (without prefix and suffix)
   * - 'public': first name combined with the last name's initial.
   * - 'official': official document format
   *
   * char format
   * -----------
   * - 'b': birth name
   * - 'B': capitalized birth name
   * - 'f': first name
   * - 'F': capitalized first name
   * - 'l': last name
   * - 'L': capitalized last name
   * - 'm': middle names
   * - 'M': capitalized middle names
   * - 'o': official document format
   * - 'O': official document format in capital letters
   * - 'p': prefix
   * - 'P': capitalized prefix
   * - 's': suffix
   * - 'S': capitalized suffix
   *
   * punctuations
   * ------------
   * - '.': period
   * - ',': comma
   * - ' ': space
   * - '-': hyphen
   * - '_': underscore
   * - '$': an escape character to select only the initial of the next char.
   *
   * Given the name `Joe Jim Smith`, use `format` with the `pattern` string.
   * - format('l f') => 'Smith Joe'
   * - format('L, f') => 'SMITH, Joe'
   * - format('short') => 'Joe Smith'
   * - format() => 'SMITH, Joe Jim'
   * - format(r'f $l.') => 'Joe S.'.
   *
   * Do note that the escape character is only valid for the birth name parts:
   * first, middle, and last names.
   */
  format(pattern: string): string {
    if (pattern === 'short') return this.short;
    if (pattern === 'long') return this.long;
    if (pattern === 'public') return this.public;
    if (pattern === 'official') pattern = 'o';

    let group = '';
    const formatted: string[] = [];
    for (const char of pattern.split('')) {
      if (ALLOWED_TOKENS.indexOf(char) === -1) {
        throw new NotAllowedError({
          source: this.full,
          operation: 'format',
          message: `unsupported character <${char}> from ${pattern}.`,
        });
      }
      group += char;
      if (char === '$') continue;
      formatted.push(this.#map(group) ?? '');
      group = '';
    }
    return formatted.join('').trim();
  }

  /** Flips definitely the name order from the preset/current config. */
  flip(): void {
    this.config.updateOrder(
      this.config.orderedBy === NameOrder.FIRST_NAME ? NameOrder.LAST_NAME : NameOrder.FIRST_NAME,
    );
  }

  /**
   * Splits the name parts of a birth name.
   * @param separator token for the split.
   */
  split(separator: string | RegExp = /[' -]/g): string[] {
    return this.birth.replace(separator, ' ').split(' ');
  }

  /**
   * Joins the name parts of a birth name.
   * @param separator token for the junction.
   */
  join(separator = ''): string {
    return this.split().join(separator);
  }

  /** Transforms a birth name into UPPERCASE. */
  toUpperCase(): string {
    return this.birth.toUpperCase();
  }

  /** Transforms a birth name into lowercase. */
  toLowerCase(): string {
    return this.birth.toLowerCase();
  }

  /** Transforms a birth name into camelCase. */
  toCamelCase(): string {
    return decapitalize(this.toPascalCase());
  }

  /** Transforms a birth name into PascalCase. */
  toPascalCase(): string {
    return this.split()
      .map((n) => capitalize(n))
      .join('');
  }

  /** Transforms a birth name into snake_case. */
  toSnakeCase(): string {
    return this.split()
      .map((n) => n.toLowerCase())
      .join('_');
  }

  /** Transforms a birth name into hyphen-case. */
  toHyphenCase(): string {
    return this.split()
      .map((n) => n.toLowerCase())
      .join('-');
  }

  /** Transforms a birth name into dot.case. */
  toDotCase(): string {
    return this.split()
      .map((n) => n.toLowerCase())
      .join('.');
  }

  /** Transforms a birth name into ToGgLeCaSe. */
  toToggleCase(): string {
    return toggleCase(this.birth);
  }

  #toParser(raw: string | string[] | Name[] | JsonName | Parser): Parser {
    if (raw instanceof Parser) return raw;
    if (typeof raw === 'string') return new StringParser(raw);
    if (isStringArray(raw)) return new ArrayStringParser(raw as string[]);
    if (isNameArray(raw)) return new ArrayNameParser(raw as Name[]);
    if (typeof raw === 'object') return new NamaParser(raw as JsonName);

    throw new InputError({ source: raw, message: 'Cannot parse raw data. Review expected data types.' });
  }

  #map(char: string): Nullable<string> {
    switch (char) {
      case '.':
      case ',':
      case ' ':
      case '-':
      case '_':
        return char;
      case 'b':
        return this.birth;
      case 'B':
        return this.birth.toUpperCase();
      case 'f':
        return this.first;
      case 'F':
        return this.first.toUpperCase();
      case 'l':
        return this.last;
      case 'L':
        return this.last.toUpperCase();
      case 'm':
      case 'M':
        return char === 'm' ? this.middleName().join(' ') : this.middleName().join(' ').toUpperCase();
      case 'o':
      case 'O':
        return ((character: string): string => {
          const sep = this.config.ending ? ',' : '',
            names: string[] = [];
          if (this.prefix) names.push(this.prefix);

          names.push(`${this.last},`.toUpperCase());
          if (this.hasMiddle) {
            names.push(this.first, this.middleName().join(' ') + sep);
          } else {
            names.push(this.first + sep);
          }
          if (this.suffix) names.push(this.suffix);

          const nama = names.join(' ').trim();
          return character === 'o' ? nama : nama.toUpperCase();
        })(char);
      case 'p':
        return this.prefix;
      case 'P':
        return this.prefix?.toUpperCase();
      case 's':
        return this.suffix;
      case 'S':
        return this.suffix?.toUpperCase();
      case '$f':
      case '$F':
        return this.#fullName.firstName.initials()[0];
      case '$l':
      case '$L':
        return this.#fullName.lastName.initials()[0];
      case '$m':
      case '$M':
        return this.hasMiddle ? this.middle[0] : undefined;
      default:
        return undefined;
    }
  }
}

/**
 * A default export for the `namefully` utility.
 * @param names element to parse.
 * @param options additional settings.
 */
export default (names: string | string[] | Name[] | JsonName | Parser, options?: Partial<Config>) => {
  return new Namefully(names, options);
};
