import { Config } from './config.js';
import { InputError, NameError, NameErrorType, NotAllowedError, UnknownError, ValidationError } from './error.js';
import { FullName } from './fullname.js';
import { FirstName, LastName, Name, JsonName } from './name.js';
import { Namefully } from './namefully.js';
import { Namon } from './types.js';
import { Validators } from './validator.js';

describe('ValidationError', () => {
  const config = Config.merge({ name: 'error_handling', bypass: false });

  test('is thrown when a namon breaks the validation rules', () => {
    expect(() => new Namefully('J4ne Doe', config)).toThrow(ValidationError);
    expect(() => new Namefully('Jane Do3', config)).toThrow(ValidationError);
  });

  test('is thrown if part of a first name breaks the validation rules', () => {
    expect(() => new Namefully('J4ne Doe', config)).toThrow(ValidationError);
    expect(() => new Namefully([new FirstName('Jane', 'M4ry'), new LastName('Doe')], config)).toThrow(ValidationError);
  });

  test('is thrown if any middle name breaks the validation rules', () => {
    expect(() => new Namefully('Jane M4ry Doe', config)).toThrow(ValidationError);
    expect(() => Validators.middleName.validate([Name.first('ka7e')])).toThrow(ValidationError);
    expect(() => Validators.middleName.validate([Name.middle('kate;')])).toThrow(ValidationError);
    expect(() => Validators.middleName.validate(['Mary', 'kate;'])).toThrow(ValidationError);
    expect(() => Validators.middleName.validate([Name.middle('Jack'), Name.middle('kate;')])).toThrow(ValidationError);
  });

  test('is thrown if any part of a last name breaks the validation rules', () => {
    expect(() => new Namefully('Jane Mary Do3', config)).toThrow(ValidationError);
    expect(() => new Namefully([new FirstName('Jane'), new LastName('Doe', 'Sm1th')], config)).toThrow(ValidationError);
  });

  test('is thrown if a namon breaks the validation rules', () => {
    expect(() => Validators.prefix.validate(Name.prefix('mr.'))).toThrow(ValidationError);
    expect(() => Validators.suffix.validate(Name.suffix('PhD '))).toThrow(ValidationError);
    expect(() => new Namefully([Name.prefix('mr '), new FirstName('John'), new LastName('Doe')], config)).toThrow(
      ValidationError,
    );
  });

  test('is thrown if the json name values are incorrect', () => {
    expect(() => new Namefully({ firstName: 'J4ne', lastName: 'Doe' }, config)).toThrow(ValidationError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, ''],
          [Namon.FIRST_NAME, 'Jane'],
          [Namon.LAST_NAME, 'Smith'],
        ]),
      ),
    ).toThrow(ValidationError);
  });

  test('is thrown if a string list breaks the validation rules', () => {
    expect(() => new Namefully(['j4ne', 'doe'], config)).toThrow(ValidationError);
  });
});

describe('InputError', () => {
  test('is thrown if the json name keys are not as expected', () => {
    expect(() => new Namefully({} as JsonName)).toThrow(InputError);
    expect(() => Validators.nama.validate(new Map([[Namon.PREFIX, '']]))).toThrow(InputError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, 'Mr'],
          [Namon.FIRST_NAME, 'John'],
        ]),
      ),
    ).toThrow(InputError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, 'Mr'],
          [Namon.LAST_NAME, 'Smith'],
        ]),
      ),
    ).toThrow(InputError);
  });

  test('is thrown if a string list has an unsupported number of entries', () => {
    expect(() => new Namefully([])).toThrow(InputError);
    expect(() => new Namefully(['jane'])).toThrow(InputError);
    expect(() => new Namefully(['ms', 'jane', 'jane', 'janet', 'doe', 'III'])).toThrow(InputError);
  });

  test('is thrown if a name list has an unsupported number of entries', () => {
    const name = Name.first('jane-');
    expect(() => new Namefully([])).toThrow(InputError);
    expect(() => new Namefully([name])).toThrow(InputError);
    expect(() => new Namefully([name, name, name, name, name, name])).toThrow(InputError);
  });

  test('is thrown if the wrong argument is provided for a first name', () => {
    expect(() => Validators.firstName.validate({} as FirstName)).toThrow(InputError);
  });

  test('is thrown if the wrong argument is provided for a middle name', () => {
    expect(() => Validators.middleName.validate({} as Name[])).toThrow(InputError);
    expect(() => Validators.namon.validate({} as Name)).toThrow(InputError);
  });

  test('is thrown if the wrong argument is provided for a last name', () => {
    expect(() => Validators.lastName.validate({} as LastName));
  });
});

describe('NotAllowedError', () => {
  test('is thrown if wrong key params are given when formatting', () => {
    const name = new Namefully('Jane Doe');
    for (const k of ['[', '{', '^', '!', '@', '#', 'a', 'c', 'd']) {
      expect(() => name.format(k)).toThrow(NotAllowedError);
    }
  });
});

describe('UnknownError', () => {
  test('is thrown if a json name cannot be parsed from FullName', () => {
    expect(() => FullName.parse({} as JsonName)).toThrow(UnknownError);
  });
});

describe('NameError', () => {
  const name = 'Jane Doe';
  const message = 'Wrong name';

  test('can be created with a message only', () => {
    const error = new NameError(name, message);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toBe(name);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(NameErrorType.UNKNOWN);
    expect(error.toString()).toContain(`NameError (${name}): ${message}`);
  });

  test('can be created for wrong input', () => {
    const error = new InputError({ source: ['Jane', 'Doe'], message: message });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toStrictEqual(['Jane', 'Doe']);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(NameErrorType.INPUT);
    expect(error.toString()).toContain(`InputError (${name}): ${message}`);
  });

  test('can be created for validation purposes', () => {
    const error = new ValidationError({
      source: [Name.first('Jane').value, Name.last('Doe').value],
      nameType: 'firstName',
      message: message,
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(NameErrorType.VALIDATION);
    expect(error.toString()).toContain(`ValidationError (firstName='${name}'): ${message}`);
  });

  test('can be created for unsupported operations', () => {
    const error = new NotAllowedError({ source: name, operation: 'lower', message: message });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toBe(name);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(NameErrorType.NOT_ALLOWED);
    expect(error.toString()).toContain(`NotAllowedError (${name}) - lower: ${message}`);
  });

  test('can be created for unknown use cases', () => {
    const error = new UnknownError({ source: null, error: new Error('something') });
    expect(error).toBeInstanceOf(NameError);
    expect(error.sourceAsString).toBe('<undefined>');
    expect(error.origin).toBeDefined();
    expect(error.type).toBe(NameErrorType.UNKNOWN);
    expect(error.toString()).toContain(`UnknownError (<undefined>)`);
  });
});
