/** Make a type nullable. */
export type Nullable<T> = T | null | undefined;

/**
 * The abbreviation type to indicate whether or not to add period to a prefix
 * using the American or British way.
 * @see {@linkcode TypeMatcher} for more variant supports.
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

/**
 * Making types flexible so callers aren’t boxed into enums.
 *
 * Certain acceptable aliases should be able to work as well for some types. For example,
 * 'all' can be represented as '*', which is universally accepted. This works in
 * conjunction with public APIs that callers will use to indicate optional `Config`.
 */
export abstract class TypeMatcher {
  static readonly firstNames = ['firstname', 'first', 'fn', 'f'];
  static readonly middleNames = ['middlename', 'middle', 'mid', 'mn', 'm'];
  static readonly lastNames = ['lastname', 'last', 'ln', 'l'];
  static readonly all = ['*', 'all', 'every'];

  static find<T extends string>(value: string | T, aliases: Record<T, string[]>): T | undefined {
    const searchValue = String(value).toLowerCase();
    return Object.entries<string[]>(aliases).find(([, list]) => list.includes(searchValue))?.[0] as T;
  }

  static separator(acceptable: string | Separator, fallback?: Separator): Separator {
    if (acceptable instanceof Separator) return acceptable;
    return Separator.cast(acceptable.toLowerCase()) ?? fallback ?? Separator.SPACE;
  }

  static title(acceptable: string | Title, fallback?: Title): Title {
    const aliases: Record<Title, string[]> = {
      [Title.UK]: ['uk', 'gb', 'au', 'noperiod'],
      [Title.US]: ['us', 'usa', 'period', '.'],
    };

    return TypeMatcher.find(acceptable, aliases) ?? fallback ?? Title.UK;
  }

  static surname(acceptable: string | Surname, fallback?: Surname): Surname {
    const aliases: Record<Surname, string[]> = {
      [Surname.FATHER]: ['father'],
      [Surname.MOTHER]: ['mother'],
      [Surname.HYPHENATED]: ['hyphen', 'hyphenated'],
      [Surname.ALL]: TypeMatcher.all,
    };

    return TypeMatcher.find(acceptable, aliases) ?? fallback ?? Surname.FATHER;
  }

  static nameOrder(acceptable: string | NameOrder, fallback?: NameOrder): NameOrder {
    const aliases: Record<NameOrder, string[]> = {
      [NameOrder.FIRST_NAME]: TypeMatcher.firstNames,
      [NameOrder.LAST_NAME]: TypeMatcher.lastNames,
    };

    return TypeMatcher.find(acceptable, aliases) ?? fallback ?? NameOrder.FIRST_NAME;
  }

  static nameType(acceptable: string | NameType, fallback?: NameType): NameType {
    const aliases: Record<NameType, string[]> = {
      [NameType.FIRST_NAME]: TypeMatcher.firstNames,
      [NameType.MIDDLE_NAME]: TypeMatcher.middleNames,
      [NameType.LAST_NAME]: TypeMatcher.lastNames,
      [NameType.BIRTH_NAME]: ['birthname', 'birth', 'bn', 'b'],
    };

    return TypeMatcher.find(acceptable, aliases) ?? fallback ?? NameType.FIRST_NAME;
  }

  static flat(acceptable: string | Flat, fallback?: Flat): Flat {
    const aliases: Record<Flat, string[]> = {
      [Flat.FIRST_NAME]: TypeMatcher.firstNames,
      [Flat.MIDDLE_NAME]: TypeMatcher.middleNames,
      [Flat.LAST_NAME]: TypeMatcher.lastNames,
      [Flat.FIRST_MID]: ['firstmid', 'fm'],
      [Flat.MID_LAST]: ['midlast', 'ml'],
      [Flat.ALL]: TypeMatcher.all,
    };

    return TypeMatcher.find(acceptable, aliases) ?? fallback ?? Flat.MIDDLE_NAME;
  }
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
    const aliases: Record<string, string[]> = {
      [Namon.PREFIX.key]: ['prefix', 'px', 'p'],
      [Namon.FIRST_NAME.key]: TypeMatcher.firstNames,
      [Namon.MIDDLE_NAME.key]: TypeMatcher.middleNames,
      [Namon.LAST_NAME.key]: TypeMatcher.lastNames,
      [Namon.SUFFIX.key]: ['suffix', 'sx', 's'],
    };

    const namon = TypeMatcher.find(key, aliases);
    return namon && Namon.has(namon) ? Namon.all.get(key) : undefined;
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

  /** Makes a string key a separator type. */
  static cast(key: string): Nullable<Separator> {
    for (const [name, separator] of Separator.all) {
      if (separator.token === key || name.toLowerCase() === key.toLowerCase()) {
        return separator;
      }
    }
    return undefined;
  }

  /** String representation of this object. */
  toString(): string {
    return `Separator.${this.name}`;
  }
}
