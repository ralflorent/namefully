import { MIN_NUMBER_OF_NAME_PARTS, MAX_NUMBER_OF_NAME_PARTS } from './constants.js';
import { InputError, NameError, ValidationError } from './error.js';
import { FirstName, LastName, Name, isNameArray } from './name.js';
import { Namon } from './types.js';
import { NameIndex } from './utils.js';

/**
 * Represents a set of validation rules (regex)
 *
 * This regex is intented to match specific alphabets only as a human name does
 * not contain special characters. `\w` does not cover non-Latin characters. So,
 * it is extended using unicode chars to cover more cases (e.g., Icelandic).
 * It matches as follows:
 *  [a-z]: Latin alphabet from a (index 97) to z (index 122)
 *  [A-Z]: Latin alphabet from A (index 65) to Z (index 90)
 *  [\u00C0-\u00D6]: Latin/German chars from À (index 192) to Ö (index 214)
 *  [\u00D8-\u00f6]: German/Icelandic chars from Ø (index 216) to ö (index 246)
 *  [\u00f8-\u00ff]: German/Icelandic chars from ø (index 248) to ÿ (index 255)
 *  [\u0400-\u04FF]: Cyrillic alphabet from Ѐ (index 1024) to ӿ (index 1279)
 *  [Ά-ωΑ-ώ]: Greek alphabet from Ά (index 902) to ω (index 969)
 */
class ValidationRule {
  static base: RegExp = /[a-zA-Z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\u0400-\u04FFΆ-ωΑ-ώ]/;

  /**
   * Matches one name part (namon) that is of nature:
   * - Latin (English, Spanish, French, etc.)
   * - European (Greek, Cyrillic, Icelandic, German)
   * - hyphenated
   * - with apostrophe
   * - with space
   */
  static namon: RegExp = new RegExp(
    `^${ValidationRule.base.source}+(([' -]${ValidationRule.base.source})?${ValidationRule.base.source}*)*$`,
  );

  /**
   * Matches one name part (namon) that is of nature:
   * - Latin (English, Spanish, French, etc.)
   * - European (Greek, Cyrillic, Icelandic, German)
   * - hyphenated
   * - with apostrophe
   */
  static firstName: RegExp = ValidationRule.namon;

  /**
   * Matches 1+ names part (namon) that are of nature:
   * - Latin (English, Spanish, French, etc.)
   * - European (Greek, Cyrillic, Icelandic, German)
   * - hyphenated
   * - with apostrophe
   * - with space
   */
  static middleName: RegExp = new RegExp(
    `^${ValidationRule.base.source}+(([' -]${ValidationRule.base.source})?${ValidationRule.base.source}*)*$`,
  );

  /**
   * Matches one name part (namon) that is of nature:
   * - Latin (English, Spanish, French, etc.)
   * - European (Greek, Cyrillic, Icelandic, German)
   * - hyphenated
   * - with apostrophe
   * - with space
   */
  static lastName: RegExp = ValidationRule.namon;
}

const toNameSource = (values: unknown[]): string => {
  return isNameArray(values) ? (values as Name[]).map((n: Name) => n.toString()).join(' ') : '';
};

export interface Validator<T> {
  validate(value: T): void;
}

class ArrayValidator<T extends string | Name> implements Validator<T[]> {
  validate(values: T[]): void {
    if (values.length === 0 || values.length < MIN_NUMBER_OF_NAME_PARTS || values.length > MAX_NUMBER_OF_NAME_PARTS) {
      throw new InputError({
        source: values.map((n) => n.toString()),
        message: `expecting a list of ${MIN_NUMBER_OF_NAME_PARTS}-${MIN_NUMBER_OF_NAME_PARTS} elements`,
      });
    }
  }
}

class NamonValidator implements Validator<string | Name> {
  static #validator: NamonValidator;

  static create(): NamonValidator {
    return this.#validator || (this.#validator = new NamonValidator());
  }

  validate(value: string | Name, type?: Namon): void {
    if (value instanceof Name) {
      NameValidator.create().validate(value, type);
    } else if (typeof value === 'string') {
      if (!ValidationRule.namon.test(value)) {
        throw new ValidationError({
          source: value,
          nameType: 'namon',
          message: 'invalid name content failing namon regex',
        });
      }
    } else {
      throw new InputError({ source: typeof value, message: 'expecting types of string or Name' });
    }
  }
}

class FirstNameValidator implements Validator<string | FirstName> {
  static #validator: FirstNameValidator;

  static create(): FirstNameValidator {
    return this.#validator || (this.#validator = new FirstNameValidator());
  }

  validate(value: string | FirstName): void {
    if (value instanceof FirstName) {
      value.asNames.forEach((name) => this.validate(name.value));
    } else if (typeof value === 'string') {
      if (!ValidationRule.firstName.test(value)) {
        throw new ValidationError({
          source: value,
          nameType: 'firstName',
          message: 'invalid name content failing firstName regex',
        });
      }
    } else {
      throw new InputError({ source: typeof value, message: 'expecting types string or FirstName' });
    }
  }
}

class MiddleNameValidator implements Validator<string | string[] | Name[]> {
  static #validator: MiddleNameValidator;

  static create(): MiddleNameValidator {
    return this.#validator || (this.#validator = new MiddleNameValidator());
  }

  validate(value: string | string[] | Name[]): void {
    if (typeof value === 'string') {
      if (!ValidationRule.middleName.test(value)) {
        throw new ValidationError({
          source: value,
          nameType: 'middleName',
          message: 'invalid name content failing middleName regex',
        });
      }
    } else if (Array.isArray(value)) {
      try {
        const validator = NamonValidator.create();
        for (const name of value) validator.validate(name, Namon.MIDDLE_NAME);
      } catch (error: unknown) {
        throw new ValidationError({
          source: toNameSource(value),
          nameType: 'middleName',
          message: (error as NameError)?.message,
        });
      }
    } else {
      throw new InputError({
        source: typeof value,
        message: 'expecting types of string, string[] or Name[]',
      });
    }
  }
}

class LastNameValidator implements Validator<string | LastName> {
  static #validator: LastNameValidator;

  static create(): LastNameValidator {
    return this.#validator || (this.#validator = new LastNameValidator());
  }

  validate(value: string | LastName): void {
    if (value instanceof LastName) {
      value.asNames.forEach((name) => this.validate(name.value));
    } else if (typeof value === 'string') {
      if (!ValidationRule.lastName.test(value)) {
        throw new ValidationError({
          source: value,
          nameType: 'lastName',
          message: 'invalid name content failing lastName regex',
        });
      }
    } else {
      throw new InputError({ source: typeof value, message: 'expecting types string or LastName' });
    }
  }
}

class NameValidator implements Validator<Name> {
  static #validator: NameValidator;

  static create(): NameValidator {
    return this.#validator || (this.#validator = new NameValidator());
  }

  validate(name: Name, type?: Namon): void {
    if (type && name.type !== type) {
      throw new ValidationError({
        source: name.toString(),
        nameType: name.type.toString(),
        message: 'wrong name type; only Namon types are supported',
      });
    }

    if (!ValidationRule.namon.test(name.value)) {
      throw new ValidationError({
        source: name.toString(),
        nameType: name.type.toString(),
        message: 'invalid name content failing namon regex',
      });
    }
  }
}

export class NamaValidator implements Validator<Map<Namon, string>> {
  static #validator: NamaValidator;

  static create(): NamaValidator {
    return this.#validator || (this.#validator = new NamaValidator());
  }

  validate(value: Map<Namon, string>): void {
    this.validateKeys(value);
    Validators.firstName.validate(value.get(Namon.FIRST_NAME)!);
    Validators.lastName.validate(value.get(Namon.LAST_NAME)!);

    if (value.has(Namon.PREFIX)) Validators.namon.validate(value.get(Namon.PREFIX)!);
    if (value.has(Namon.SUFFIX)) Validators.namon.validate(value.get(Namon.SUFFIX)!);
  }

  validateKeys(nama: Map<Namon, string>): void {
    if (!nama.size) {
      throw new InputError({ source: undefined, message: 'Map<k,v> must not be empty' });
    } else if (nama.size < MIN_NUMBER_OF_NAME_PARTS || nama.size > MAX_NUMBER_OF_NAME_PARTS) {
      throw new InputError({
        source: [...nama.values()],
        message: `expecting ${MIN_NUMBER_OF_NAME_PARTS}-${MIN_NUMBER_OF_NAME_PARTS} fields`,
      });
    }

    if (!nama.has(Namon.FIRST_NAME)) {
      throw new InputError({ source: [...nama.values()], message: '"firstName" is a required key' });
    }

    if (!nama.has(Namon.LAST_NAME)) {
      throw new InputError({ source: [...nama.values()], message: '"lastName" is a required key' });
    }
  }
}

export class ArrayStringValidator extends ArrayValidator<string> {
  constructor(readonly index = NameIndex.base()) {
    super();
  }

  validate(values: string[]): void {
    this.validateIndex(values);

    Validators.firstName.validate(values[this.index.firstName]);
    Validators.lastName.validate(values[this.index.lastName]);

    if (values.length >= 3) Validators.middleName.validate(values[this.index.middleName]);
    if (values.length >= 4) Validators.namon.validate(values[this.index.prefix]);
    if (values.length === 5) Validators.namon.validate(values[this.index.suffix]);
  }

  validateIndex(values: string[]): void {
    super.validate(values);
  }
}

export class ArrayNameValidator implements Validator<Name[]> {
  static #validator: ArrayNameValidator;

  static create(): ArrayNameValidator {
    return this.#validator || (this.#validator = new ArrayNameValidator());
  }

  validate(value: Name[]): void {
    if (value.length < MIN_NUMBER_OF_NAME_PARTS) {
      throw new InputError({
        source: toNameSource(value),
        message: `expecting at least ${MIN_NUMBER_OF_NAME_PARTS} elements`,
      });
    }

    if (!this.#hasBasicNames(value)) {
      throw new InputError({
        source: toNameSource(value),
        message: 'both first and last names are required',
      });
    }
  }

  #hasBasicNames(names: Name[]): boolean {
    const accumulator: { [key: string]: string } = {};
    for (const name of names) {
      if (name.isFirstName || name.isLastName) {
        accumulator[name.type.key] = name.toString();
      }
    }
    return Object.keys(accumulator).length === MIN_NUMBER_OF_NAME_PARTS;
  }
}

/** A list of validators for a specific namon. */
export abstract class Validators {
  static namon = NamonValidator.create();
  static nama = NamaValidator.create();
  static prefix = NamonValidator.create();
  static firstName = FirstNameValidator.create();
  static middleName = MiddleNameValidator.create();
  static lastName = LastNameValidator.create();
  static suffix = NamonValidator.create();
}
