import { Config } from './config.js';
import { NameIndex } from './utils.js';
import { InputError } from './error.js';
import { FullName, Mononym } from './fullname.js';
import { Namon, Nullable, Separator } from './types.js';
import { FirstName, LastName, Name, JsonName } from './name.js';
import { ArrayStringValidator, ArrayNameValidator, Validators } from './validator.js';

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
   * Parses raw data into a `FullName` while applying some options.
   * @param options for additional configuration to apply.
   */
  abstract parse(options?: Partial<Config>): FullName;

  /**
   * Builds a dynamic `Parser` on the fly and throws a `NameError` when unable
   * to do so. The built parser only knows how to operate birth names.
   */
  static build(text: string, index?: NameIndex): Parser {
    const parts = text.trim().split(Separator.SPACE.token);
    const length = parts.length;

    if (index instanceof NameIndex) {
      const names = Object.entries(index.json())
        .filter(([, position]) => position > -1 && position < length)
        .map(([key, position]) => new Name(parts[position], Namon.all.get(key)!));
      return new ArrayNameParser(names);
    }

    if (length < 2) {
      throw new InputError({ source: text, message: 'expecting at least 2 name parts' });
    } else if (length === 2 || length === 3) {
      return new StringParser(text);
    } else {
      const last = parts.pop();
      const [first, ...middles] = parts;
      return new ArrayStringParser([first, middles.join(' '), last!]);
    }
  }

  /** Builds asynchronously a dynamic `Parser`. */
  static buildAsync(text: string, index?: NameIndex): Promise<Parser> {
    try {
      return Promise.resolve(Parser.build(text, index));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export class StringParser extends Parser<string> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);
    const names = this.raw.split(config.separator.token);
    return new ArrayStringParser(names).parse(config);
  }
}

export class ArrayStringParser extends Parser<string[]> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);

    if (this.raw.length === 1 && config.mono) {
      return new MonoParser(this.raw[0]).parse(config);
    }

    const raw = this.raw.map((n) => n.trim());
    const index = NameIndex.when(config.orderedBy, raw.length);
    const validator = new ArrayStringValidator(index);

    if (config.bypass) {
      validator.validateIndex(raw);
    } else {
      validator.validate(raw);
    }

    const { firstName, lastName, middleName, prefix, suffix } = index;
    const fullName = new FullName(config)
      .setFirstName(new FirstName(raw[firstName]))
      .setLastName(new LastName(raw[lastName]));

    if (raw.length >= 3) fullName.setMiddleName(raw[middleName].split(config.separator.token));
    if (raw.length >= 4) fullName.setPrefix(Name.prefix(raw[prefix]));
    if (raw.length === 5) fullName.setSuffix(Name.suffix(raw[suffix]));

    return fullName;
  }
}

export class NamaParser extends Parser<JsonName> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);
    const names = new Map<Namon, string>(
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

    if (config.bypass) {
      Validators.nama.validateKeys(names);
    } else {
      Validators.nama.validate(names);
    }

    return FullName.parse(this.raw, config);
  }
}

export class ArrayNameParser extends Parser<Name[]> {
  parse(options: Partial<Config>): FullName {
    const config = Config.merge(options);

    if (this.raw.length === 1 && config.mono) {
      return new MonoParser(this.raw[0]).parse(options);
    } else {
      ArrayNameValidator.create().validate(this.raw);
    }

    const fullName = new FullName(config);
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
        const mother = name instanceof LastName ? name.mother : undefined;
        fullName.setLastName(new LastName(name.value, mother, config.surname));
      }
    }
    return fullName;
  }
}

export class MonoParser extends Parser<string | Name> {
  parse(options: Partial<Config>): Mononym {
    const config = Config.merge(options);

    if (config.bypass) Validators.namon.validate(this.raw);

    const type = config.mono instanceof Namon ? config.mono : Namon.FIRST_NAME;
    const name = this.raw instanceof Name ? this.raw : new Name(this.raw.trim(), type);
    return new Mononym(name, config);
  }
}
