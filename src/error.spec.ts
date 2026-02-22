import { Config } from './config.js';
import * as Errors from './error.js';
import { FullName } from './fullname.js';
import { FirstName, LastName, Name, JsonName } from './name.js';
import { Namefully } from './namefully.js';
import { Namon } from './types.js';
import { Validators } from './validator.js';

describe('ValidationError', () => {
  const config = Config.merge({ name: 'error_handling', bypass: false });

  test('is thrown when a namon breaks the validation rules', () => {
    expect(() => new Namefully('J4ne Doe', config)).toThrow(Errors.ValidationError);
    expect(() => new Namefully('Jane Do3', config)).toThrow(Errors.ValidationError);
  });

  test('is thrown if part of a first name breaks the validation rules', () => {
    expect(() => new Namefully('J4ne Doe', config)).toThrow(Errors.ValidationError);
    expect(() => new Namefully([new FirstName('Jane', 'M4ry'), new LastName('Doe')], config)).toThrow(
      Errors.ValidationError,
    );
  });

  test('is thrown if any middle name breaks the validation rules', () => {
    expect(() => new Namefully('Jane M4ry Doe', config)).toThrow(Errors.ValidationError);
    expect(() => Validators.middleName.validate([Name.first('ka7e')])).toThrow(Errors.ValidationError);
    expect(() => Validators.middleName.validate([Name.middle('kate;')])).toThrow(Errors.ValidationError);
    expect(() => Validators.middleName.validate(['Mary', 'kate;'])).toThrow(Errors.ValidationError);
    expect(() => Validators.middleName.validate([Name.middle('Jack'), Name.middle('kate;')])).toThrow(
      Errors.ValidationError,
    );
  });

  test('is thrown if any part of a last name breaks the validation rules', () => {
    expect(() => new Namefully('Jane Mary Do3', config)).toThrow(Errors.ValidationError);
    expect(() => new Namefully([new FirstName('Jane'), new LastName('Doe', 'Sm1th')], config)).toThrow(
      Errors.ValidationError,
    );
  });

  test('is thrown if a namon breaks the validation rules', () => {
    expect(() => Validators.prefix.validate(Name.prefix('mr.'))).toThrow(Errors.ValidationError);
    expect(() => Validators.suffix.validate(Name.suffix('PhD '))).toThrow(Errors.ValidationError);
    expect(() => new Namefully([Name.prefix('mr '), new FirstName('John'), new LastName('Doe')], config)).toThrow(
      Errors.ValidationError,
    );
  });

  test('is thrown if the json name values are incorrect', () => {
    expect(() => new Namefully({ firstName: 'J4ne', lastName: 'Doe' }, config)).toThrow(Errors.ValidationError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, ''],
          [Namon.FIRST_NAME, 'Jane'],
          [Namon.LAST_NAME, 'Smith'],
        ]),
      ),
    ).toThrow(Errors.ValidationError);
  });

  test('is thrown if a string list breaks the validation rules', () => {
    expect(() => new Namefully(['j4ne', 'doe'], config)).toThrow(Errors.ValidationError);
  });
});

describe('InputError', () => {
  test('is thrown if the json name keys are not as expected', () => {
    expect(() => new Namefully({} as JsonName)).toThrow(Errors.InputError);
    expect(() => Validators.nama.validate(new Map([[Namon.PREFIX, '']]))).toThrow(Errors.InputError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, 'Mr'],
          [Namon.FIRST_NAME, 'John'],
        ]),
      ),
    ).toThrow(Errors.InputError);
    expect(() =>
      Validators.nama.validate(
        new Map([
          [Namon.PREFIX, 'Mr'],
          [Namon.LAST_NAME, 'Smith'],
        ]),
      ),
    ).toThrow(Errors.InputError);
  });

  test('is thrown if a string list has an unsupported number of entries', () => {
    expect(() => new Namefully([])).toThrow(Errors.InputError);
    expect(() => new Namefully(['jane'])).toThrow(Errors.InputError);
    expect(() => new Namefully(['ms', 'jane', 'jane', 'janet', 'doe', 'III'])).toThrow(Errors.InputError);
  });

  test('is thrown if a name list has an unsupported number of entries', () => {
    const name = Name.first('jane-');
    expect(() => new Namefully([])).toThrow(Errors.InputError);
    expect(() => new Namefully([name])).toThrow(Errors.InputError);
    expect(() => new Namefully([name, name, name, name, name, name])).toThrow(Errors.InputError);
  });

  test('is thrown if the wrong argument is provided for a first name', () => {
    expect(() => Validators.firstName.validate({} as FirstName)).toThrow(Errors.InputError);
  });

  test('is thrown if the wrong argument is provided for a middle name', () => {
    expect(() => Validators.middleName.validate({} as Name[])).toThrow(Errors.InputError);
    expect(() => Validators.namon.validate({} as Name)).toThrow(Errors.InputError);
  });

  test('is thrown if the wrong argument is provided for a last name', () => {
    expect(() => Validators.lastName.validate({} as LastName));
  });

  test('is thrown for unknown input types', () => {
    expect(() => new Namefully(class {} as never)).toThrow(Errors.InputError);
  });
});

describe('NotAllowedError', () => {
  test('is thrown if wrong key params are given when formatting', () => {
    const name = new Namefully('Jane Doe');
    for (const k of ['{', '^', '!', '@', '#', 'a', 'c', 'd']) {
      expect(() => name.format(k)).toThrow(Errors.NotAllowedError);
    }
  });
});

describe('UnknownError', () => {
  test('is thrown if a json name cannot be parsed from FullName', () => {
    expect(() => FullName.parse({} as JsonName)).toThrow(Errors.UnknownError);
  });
});

describe('NameError', () => {
  const name = 'Jane Doe';
  const message = 'Wrong name';

  test('can be created with a message only', () => {
    const error = new Errors.NameError(name, message);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toBe(name);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(Errors.NameErrorType.UNKNOWN);
    expect(error.toString()).toContain(`NameError (${name}): ${message}`);
  });

  test('can be created for wrong input', () => {
    const error = new Errors.InputError({ source: ['Jane', 'Doe'], message: message });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toStrictEqual(['Jane', 'Doe']);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(Errors.NameErrorType.INPUT);
    expect(error.toString()).toContain(`InputError (${name}): ${message}`);
  });

  test('can be created for validation purposes', () => {
    const error = new Errors.ValidationError({
      source: [Name.first('Jane').value, Name.last('Doe').value],
      nameType: 'firstName',
      message: message,
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(Errors.NameErrorType.VALIDATION);
    expect(error.toString()).toContain(`ValidationError (firstName='${name}'): ${message}`);
  });

  test('can be created for unsupported operations', () => {
    const error = new Errors.NotAllowedError({ source: name, operation: 'lower', message: message });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.source).toBe(name);
    expect(error.sourceAsString).toBe(name);
    expect(error.type).toBe(Errors.NameErrorType.NOT_ALLOWED);
    expect(error.toString()).toContain(`NotAllowedError (${name}) - lower: ${message}`);
  });

  test('can be created for unknown use cases', () => {
    const error = new Errors.UnknownError({ source: null, origin: new Error('something') });
    expect(error).toBeInstanceOf(Errors.NameError);
    expect(error.sourceAsString).toBe('<undefined>');
    expect(error.origin).toBeDefined();
    expect(error.type).toBe(Errors.NameErrorType.UNKNOWN);
    expect(error.toString()).toContain(`UnknownError (<undefined>)`);
  });
});
