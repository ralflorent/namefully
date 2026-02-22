import { Config } from './config.js';
import { Validators } from './validator.js';
import { ZERO_WIDTH_SPACE } from './constants.js';
import { Nullable, Namon, Title } from './types.js';
import { NameError, UnknownError } from './error.js';
import { FirstName, LastName, Name, JsonName } from './name.js';

/**
 * The core component of this utility.
 *
 * This component is composed of five entities that make it easy to handle a
 * full name set: prefix, first name, middle name, last name, and suffix.
 * It is indeed intended for internal processes. However, it is understandable
 * that it might be needed at some point for additional purposes. For this reason,
 * it's made available.
 *
 * It is recommended to avoid using this class unless it is highly necessary or
 * a custom parser is used for uncommon use cases although this utility tries to
 * cover as many use cases as possible.
 *
 * Additionally, an optional configuration can be used to indicate some specific
 * behaviors related to that name handling.
 */
export class FullName {
  #prefix: Nullable<Name>;
  #firstName!: FirstName;
  #middleName: Name[] = [];
  #lastName!: LastName;
  #suffix: Nullable<Name>;
  #config: Config;

  /**
   * Creates a full name as it goes
   * @param options settings for additional features.
   */
  constructor(options?: Partial<Config>) {
    this.#config = Config.merge(options);
  }

  /** A snapshot of the configuration used to set up this full name. */
  get config(): Config {
    return this.#config;
  }

  /** The prefix part of the full name. */
  get prefix(): Nullable<Name> {
    return this.#prefix;
  }

  /** The first name part of the full name. */
  get firstName(): FirstName {
    return this.#firstName;
  }

  /** The last name part of the full name. */
  get lastName(): LastName {
    return this.#lastName;
  }

  /** The middle name part of the full name. */
  get middleName(): Name[] {
    return this.#middleName;
  }

  /** The suffix part of the full name. */
  get suffix(): Nullable<Name> {
    return this.#suffix;
  }

  /** Whether the full name is a single word name. */
  get isMono(): boolean {
    return this instanceof Mononym;
  }

  /**
   * Parses a JSON name into a full name.
   * @param {JsonName} json parsable name element
   * @param {Config} config for additional features.
   */
  static parse(json: JsonName, config?: Config): FullName {
    try {
      const { prefix, firstName: fn, middleName: mn, lastName: ln, suffix } = json;
      return new FullName(config)
        .setPrefix(prefix)
        .setFirstName(typeof fn === 'string' ? fn : new FirstName(fn.value, ...(fn.more ?? [])))
        .setMiddleName(typeof mn === 'string' ? [mn] : (mn ?? []))
        .setLastName(typeof ln === 'string' ? ln : new LastName(ln.father, ln.mother))
        .setSuffix(suffix);
    } catch (error) {
      if (error instanceof NameError) throw error;

      throw new UnknownError({
        source: Object.values(json).join(' '),
        message: 'could not parse JSON content',
        origin: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  setPrefix(name: Nullable<string | Name>): FullName {
    if (!name) return this;
    if (!this.#config.bypass) Validators.prefix.validate(name);
    const prefix = name instanceof Name ? name.value : name;
    this.#prefix = Name.prefix(this.#config.title === Title.US && !prefix.endsWith('.') ? `${prefix}.` : prefix);
    return this;
  }

  setFirstName(name: string | FirstName): FullName {
    if (!this.#config.bypass) Validators.firstName.validate(name);
    this.#firstName = name instanceof FirstName ? name : new FirstName(name);
    return this;
  }

  setLastName(name: string | LastName): FullName {
    if (!this.#config.bypass) Validators.lastName.validate(name);
    this.#lastName = name instanceof LastName ? name : new LastName(name);
    return this;
  }

  setMiddleName(names: string[] | Name[]): FullName {
    if (!Array.isArray(names)) return this;
    if (!this.#config.bypass) Validators.middleName.validate(names);
    this.#middleName = (names as Array<string | Name>).map((n) => (n instanceof Name ? n : Name.middle(n)));
    return this;
  }

  setSuffix(name: Nullable<string | Name>): FullName {
    if (!name) return this;
    if (!this.#config.bypass) Validators.suffix.validate(name);
    this.#suffix = Name.suffix(name instanceof Name ? name.value : name);
    return this;
  }

  /** Returns true if a namon has been set. */
  has(key: Namon | string): boolean {
    const namon = typeof key === 'string' ? Namon.cast(key) : key;
    if (!namon) return false;
    if (namon.equal(Namon.PREFIX)) return !!this.#prefix;
    if (namon.equal(Namon.SUFFIX)) return !!this.#suffix;
    return namon.equal(Namon.MIDDLE_NAME) ? this.#middleName.length > 0 : true;
  }

  toString(): string {
    if (this.isMono) return (this as unknown as Mononym).value;
    return Array.from(this.toIterable(true)).join(' ');
  }

  /** Returns an `Iterable` of existing `Name`s. */
  *toIterable(flat: boolean = false): Iterable<Name> {
    if (this.#prefix) yield this.#prefix;
    if (flat) {
      yield* this.#firstName.asNames;
      yield* this.#middleName;
      yield* this.#lastName.asNames;
    } else {
      yield this.#firstName;
      yield* this.#middleName;
      yield this.#lastName;
    }
    if (this.#suffix) yield this.#suffix;
  }

  /** Returns the default iterator for this name set (enabling for-of statements). */
  *[Symbol.iterator](): Iterator<Name> {
    yield* this.toIterable(true);
  }
}

/**
 * A single word name or mononym.
 *
 * This is a special case of `FullName` that is used to represent mononyms. This contradicts
 * the original purpose of this library such as shaping and organizing name pieces accordingly.
 *
 * When enabled via `Config.mono`, this becomes the full name of a human. And as a single name,
 * most of the `Namefully` methods become irrelevant.
 */
export class Mononym extends FullName {
  readonly #namon!: string;
  #type!: Namon;

  /**
   * Constructs a mononym from a piece of string.
   * @param {string | Name} name to be used to construct the mononym.
   */
  constructor(name: string | Name, options?: Partial<Config>) {
    super(options ?? { name: 'mononym', mono: true });
    this.#namon = name.toString();
    this.type = name instanceof Name ? name.type : Namon.FIRST_NAME;
  }

  /**
   * Re-assigns which name type is being used to represent the mononym.
   *
   * Ideally, this doesn't really matter as the mononym is always a single piece of name.
   * When used as `string`, it must be a valid `Namon` type or else it will default to
   * `Namon.FIRST_NAME`.
   * @param {string | Namon} type of name to use.
   */
  set type(type: string | Namon) {
    this.#type = typeof type === 'string' ? (Namon.cast(type) ?? Namon.FIRST_NAME) : type;
    this.#build(this.#namon);
  }

  /** The type of name being used to represent the mononym. */
  get type(): Namon {
    return this.#type;
  }

  /** The piece of string treated as a name. */
  get value(): string {
    return this.#namon;
  }

  #build(name: string): void {
    this.setFirstName(ZERO_WIDTH_SPACE).setLastName(ZERO_WIDTH_SPACE).setMiddleName([]).setPrefix(null).setSuffix(null);

    if (this.#type.equal(Namon.FIRST_NAME)) this.setFirstName(name);
    else if (this.#type.equal(Namon.LAST_NAME)) this.setLastName(name);
    else if (this.#type.equal(Namon.MIDDLE_NAME)) this.setMiddleName([name]);
    else if (this.#type.equal(Namon.PREFIX)) this.setPrefix(name);
    else if (this.#type.equal(Namon.SUFFIX)) this.setSuffix(name);
    else throw new NameError(name, 'invalid mononym type');
  }
}
