import { FullName } from './fullname.js';
import { Config } from './config.js';
import { NameIndex } from './utils.js';
import { ArrayStringValidator, ArrayNameValidator, NamaValidator } from './validator.js';
import { FirstName, LastName, Name, JsonName } from './name.js';
import { Namon, Nullable, Separator } from './types.js';
import { InputError } from './error.js';

/**
 * A parser signature that helps to organize the names accordingly.
 */
export abstract class Parser<T = unknown> {
  /**
   * Constructs a custom parser accordingly.
   * @param raw data to be parsed
   */
  constructor(public raw: T) {}

  /**
   * Builds a dynamic `Parser` on the fly and throws a `NameError` when unable
   * to do so. The built parser only knows how to operate birth names.
   */
  static build(text: string, index?: NameIndex): Parser {
    const parts = text.trim().split(Separator.SPACE.token);
    const length = parts.length;

    if (index instanceof NameIndex) {
      const names = Object.entries(index.toJson())
        .filter(([, position]) => position > -1 && position < length)
        .map(([key, position]) => new Name(parts[position], Namon.all.get(key)!));
      return new ArrayNameParser(names);
    }

    if (length < 2) {
      throw new InputError({
        source: text,
        message: 'cannot build from invalid input',
      });
    } else if (length === 2 || length === 3) {
      return new StringParser(text);
    } else {
      const last = parts.pop();
      const [first, ...middles] = parts;
      return new ArrayStringParser([first, middles.join(' '), last!]);
    }
  }

  /**
   * Builds asynchronously a dynamic `Parser`.
   */
  static buildAsync(text: string, index?: NameIndex): Promise<Parser> {
    try {
      return Promise.resolve(Parser.build(text, index));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Parses the raw data into a `FullName` while considering some options.
   * @param options additional configuration to apply.
   */
  abstract parse(options?: Partial<Config>): FullName;
}

export class StringParser extends Parser<string> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);
    const names = this.raw.split(config.separator.token);
    return new ArrayStringParser(names).parse(options);
  }
}

export class ArrayStringParser extends Parser<string[]> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);
    const fullName = new FullName(config);

    const raw = this.raw.map((n) => n.trim());
    const index = NameIndex.when(config.orderedBy, raw.length);
    const validator = new ArrayStringValidator(index);

    if (config.bypass) {
      validator.validateIndex(raw);
    } else {
      validator.validate(raw);
    }

    const { firstName, lastName, middleName, prefix, suffix } = index;
    fullName.setFirstName(new FirstName(raw[firstName]));
    fullName.setLastName(new LastName(raw[lastName]));

    if (raw.length >= 3) fullName.setMiddleName(raw[middleName].split(config.separator.token));
    if (raw.length >= 4) fullName.setPrefix(Name.prefix(raw[prefix]));
    if (raw.length === 5) fullName.setSuffix(Name.suffix(raw[suffix]));

    return fullName;
  }
}

export class NamaParser extends Parser<JsonName> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);

    if (config.bypass) {
      NamaValidator.create().validateKeys(this.#asNama());
    } else {
      NamaValidator.create().validate(this.#asNama());
    }

    return FullName.parse(this.raw, config);
  }

  #asNama(): Map<Namon, string> {
    return new Map<Namon, string>(
      Object.entries(this.raw).map(([key, value]) => {
        const namon: Nullable<Namon> = Namon.cast(key);
        if (!namon) {
          throw new InputError({
            source: Object.values(this.raw).join(' '),
            message: `unsupported key "${key}"`,
          });
        }
        return [namon, value as string];
      }),
    );
  }
}

export class ArrayNameParser extends Parser<Name[]> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);
    const fullName = new FullName(config);

    ArrayNameValidator.create().validate(this.raw);

    for (const name of this.raw) {
      if (name.isPrefix) {
        fullName.setPrefix(name);
      } else if (name.isSuffix) {
        fullName.setSuffix(name);
      } else if (name.isFirstName) {
        fullName.setFirstName(name instanceof FirstName ? name : new FirstName(name.value));
      } else if (name.isMiddleName) {
        fullName.middleName.push(name);
      } else if (name.isLastName) {
        const lastName = new LastName(name.value, name instanceof LastName ? name.mother : undefined, config.surname);
        fullName.setLastName(lastName);
      }
    }
    return fullName;
  }
}
