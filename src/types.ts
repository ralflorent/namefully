/** Make a type nullable. */
export type Nullable<T> = T | null | undefined;

/**
 * The abbreviation type to indicate whether or not to add period to a prefix
 * using the American or British way.
 */
export enum Title {
  // A period after the prefix.
  US = 'US',

  // No period after the prefix.
  UK = 'UK',
}

/**
 * An option indicating how to format a surname.
 *
 * This enum can be set via `Config` or when creating a `LastName`. As this can
 * become ambiguous at the time of handling it, the value set in `Config` is
 * prioritized and viewed as the source of truth for future considerations.
 */
export enum Surname {
  // The fatherly surname only.
  FATHER = 'father',

  // The motherly surname only.
  MOTHER = 'mother',

  // The junction of both the fatherly and motherly surnames with a hyphen.
  HYPHENATED = 'hyphenated',

  // The junction of both the fatherly and motherly surnames with a space.
  ALL = 'all',
}

/** The order of appearance of a `FullName`. */
export enum NameOrder {
  // The first part of a full name, usually the first piece of a human name.
  FIRST_NAME = 'firstName',

  // The last part of a full name, usually the last piece of a human name.
  LAST_NAME = 'lastName',
}

/** The types of name handled in this according the name standards. */
export enum NameType {
  FIRST_NAME = 'firstName',
  MIDDLE_NAME = 'middleName',
  LAST_NAME = 'lastName',
  BIRTH_NAME = 'birthName',
}

/** The possible variants to indicate how to flatten a `FullName`. */
export enum Flat {
  // Use the first name's initial combined with the remaining parts.
  FIRST_NAME = 'firstName',

  // Use the middle name's initial combined with the remaining parts.
  MIDDLE_NAME = 'middleName',

  // Use the last name's initial combined with the remaining parts.
  LAST_NAME = 'lastName',

  // Use both the first and middle names' initials combined with the remaining parts.
  FIRST_MID = 'firstMid',

  // Use both the last and middle names' initials combined with the remaining parts.
  MID_LAST = 'midLast',

  // Use the first, middle and last names' initials combined with the remaining parts.
  ALL = 'all',
}

/** The range to use when capitalizing a string content. */
export enum CapsRange {
  // No capitalization.
  NONE,

  // Apply capitalization to the first letter.
  INITIAL,

  // Apply capitalization to all the letters.
  ALL,
}

/** The types of name handled in this utility according the name standards. */
export class Namon {
  static readonly PREFIX: Namon = new Namon(0, 'prefix');
  static readonly FIRST_NAME: Namon = new Namon(1, 'firstName');
  static readonly MIDDLE_NAME: Namon = new Namon(2, 'middleName');
  static readonly LAST_NAME: Namon = new Namon(3, 'lastName');
  static readonly SUFFIX: Namon = new Namon(4, 'suffix');

  /** The list of supported name types. */
  static readonly values: Namon[] = [Namon.PREFIX, Namon.FIRST_NAME, Namon.MIDDLE_NAME, Namon.LAST_NAME, Namon.SUFFIX];

  /** All the predefined name types. */
  static readonly all: Map<string, Namon> = new Map<string, Namon>([
    [Namon.PREFIX.key, Namon.PREFIX],
    [Namon.FIRST_NAME.key, Namon.FIRST_NAME],
    [Namon.MIDDLE_NAME.key, Namon.MIDDLE_NAME],
    [Namon.LAST_NAME.key, Namon.LAST_NAME],
    [Namon.SUFFIX.key, Namon.SUFFIX],
  ]);

  private constructor(
    readonly index: number,
    readonly key: string,
  ) {}

  /** Whether this string key is part of the predefined keys. */
  static has(key: string): boolean {
    return Namon.all.has(key);
  }

  /** Makes a string key a namon type. */
  static cast(key: string): Nullable<Namon> {
    return Namon.has(key) ? Namon.all.get(key) : undefined;
  }

  /** String representation of this object. */
  toString(): string {
    return `Namon.${this.key}`;
  }

  /** Whether this and the other value are equal. */
  equal(other: Namon | unknown): boolean {
    return other instanceof Namon && other.index === this.index && other.key === this.key;
  }
}

/** The token used to indicate how to split string values. */
export class Separator {
  static readonly COMMA: Separator = new Separator('comma', ',');
  static readonly COLON: Separator = new Separator('colon', ':');
  static readonly DOUBLE_QUOTE: Separator = new Separator('doubleQuote', '"');
  static readonly EMPTY: Separator = new Separator('empty', '');
  static readonly HYPHEN: Separator = new Separator('hyphen', '-');
  static readonly PERIOD: Separator = new Separator('period', '.');
  static readonly SEMI_COLON: Separator = new Separator('semiColon', ';');
  static readonly SINGLE_QUOTE: Separator = new Separator('singleQuote', `'`);
  static readonly SPACE: Separator = new Separator('space', ' ');
  static readonly UNDERSCORE: Separator = new Separator('underscore', '_');

  /** All the available separators. */
  static readonly all: Map<string, Separator> = new Map<string, Separator>([
    [Separator.COMMA.name, Separator.COMMA],
    [Separator.COLON.name, Separator.COLON],
    [Separator.DOUBLE_QUOTE.name, Separator.DOUBLE_QUOTE],
    [Separator.EMPTY.name, Separator.EMPTY],
    [Separator.HYPHEN.name, Separator.HYPHEN],
    [Separator.PERIOD.name, Separator.PERIOD],
    [Separator.SEMI_COLON.name, Separator.SEMI_COLON],
    [Separator.SINGLE_QUOTE.name, Separator.SINGLE_QUOTE],
    [Separator.SPACE.name, Separator.SPACE],
    [Separator.UNDERSCORE.name, Separator.UNDERSCORE],
  ]);

  /** All the available tokens. */
  static readonly tokens: string[] = [...Separator.all.values()].map((s) => s.token);

  private constructor(
    readonly name: string,
    readonly token: string,
  ) {}

  /** String representation of this object. */
  toString(): string {
    return `Separator.${this.name}`;
  }
}
