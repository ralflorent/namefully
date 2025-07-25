import { Config } from './config.js';
import { NameError, UnknownError } from './error.js';
import { FirstName, LastName, Name, JsonName } from './name.js';
import { Nullable, Namon, Title } from './types.js';
import { Validators } from './validator.js';

/**
 * The core component of this utility.
 *
 * This component is comprised of five entities that make it easy to handle a
 * full name set: prefix, first name, middle name, last name, and suffix.
 * This class is intended for internal processes. However, it is understandable
 * that it might be needed at some point for additional purposes. For this reason,
 * it's made available.
 *
 * It is recommended to avoid using this class unless it is highly necessary or
 * a custom parser is used for uncommon use cases. This utility tries to cover
 * as many use cases as possible.
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
   * @param options optional configuration for additional features.
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

  /**
   * Parses a json name into a full name.
   * @param json parsable name element
   * @param config optional configuration for additional features.
   */
  static parse(json: JsonName, config?: Config): FullName {
    try {
      const fullName = new FullName(config);
      fullName.setPrefix(json.prefix);
      fullName.setFirstName(json.firstName);
      fullName.setMiddleName(json.middleName ?? []);
      fullName.setLastName(json.lastName);
      fullName.setSuffix(json.suffix);
      return fullName;
    } catch (error) {
      if (error instanceof NameError) throw error;

      throw new UnknownError({
        source: Object.values(json).join(' '),
        message: 'could not parse JSON content',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  setPrefix(name: Nullable<string | Name>): FullName {
    if (!name) return this;
    if (!this.#config.bypass) Validators.prefix.validate(name);
    const prefix = name instanceof Name ? name.value : name;
    this.#prefix = Name.prefix(this.#config.title === Title.US ? `${prefix}.` : prefix);
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
    this.#middleName = (names as Array<string | Name>).map((name) => (name instanceof Name ? name : Name.middle(name)));
    return this;
  }

  setSuffix(name: Nullable<string | Name>): FullName {
    if (!name) return this;
    if (!this.#config.bypass) Validators.suffix.validate(name);
    this.#suffix = Name.suffix(name instanceof Name ? name.value : name);
    return this;
  }

  /**
   * Returns true if a namon has been set.
   */
  has(namon: Namon): boolean {
    if (namon.equal(Namon.PREFIX)) return !!this.#prefix;
    if (namon.equal(Namon.SUFFIX)) return !!this.#suffix;
    return namon.equal(Namon.MIDDLE_NAME) ? this.#middleName.length > 0 : true;
  }
}
