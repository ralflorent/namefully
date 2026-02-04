import { Namefully } from './namefully.js';
import { InputError, UnknownError } from './error.js';
import { Name, FirstName, LastName } from './name.js';
import { deserialize, SerializedName } from './data.js';
import { Separator, Title, Surname, NameOrder } from './types.js';

describe('JSON serialization', () => {
  describe('serialize', () => {
    test('should serialize a simple name', () => {
      const name = new Namefully('John Smith');
      const serialized = name.serialize();

      expect(serialized).toEqual({
        names: { firstName: 'John', lastName: 'Smith' },
        config: expect.objectContaining({
          name: expect.any(String),
          orderedBy: expect.any(String),
          separator: expect.any(String),
          title: expect.any(String),
          ending: expect.any(Boolean),
          bypass: expect.any(Boolean),
          surname: expect.any(String),
        }),
      });
    });

    test('should serialize a name with prefix and suffix', () => {
      const name = new Namefully([Name.prefix('Mr'), Name.first('John'), Name.last('Smith'), Name.suffix('Jr')]);
      const serialized = name.serialize();

      expect(serialized.names.prefix).toBe('Mr');
      expect(serialized.names.firstName).toBe('John');
      expect(serialized.names.lastName).toBe('Smith');
      expect(serialized.names.suffix).toBe('Jr');
    });

    test('should serialize a name with middle names', () => {
      const name = new Namefully([
        Name.first('John'),
        Name.middle('Michael'),
        Name.middle('David'),
        Name.last('Smith'),
      ]);
      const serialized = name.serialize();

      expect(serialized.names.firstName).toBe('John');
      expect(serialized.names.middleName).toEqual(['Michael', 'David']);
      expect(serialized.names.lastName).toBe('Smith');
    });

    test('should serialize a name with multiple first names', () => {
      const name = new Namefully([new FirstName('John', 'Michael'), Name.last('Smith')]);
      const serialized = name.serialize();

      expect(serialized.names.firstName).toEqual({ value: 'John', more: ['Michael'] });
      expect(serialized.names.lastName).toBe('Smith');
    });

    test('should serialize a name with hyphenated last name', () => {
      const name = new Namefully([Name.first('John'), new LastName('Smith', 'Jones')]);
      const serialized = name.serialize();

      expect(serialized.names.firstName).toBe('John');
      expect(serialized.names.lastName).toEqual({ father: 'Smith', mother: 'Jones' });
    });

    test('should serialize a complex name with all parts', () => {
      const name = new Namefully([
        Name.prefix('Dr'),
        new FirstName('John', 'Michael'),
        Name.middle('David'),
        new LastName('Smith', 'Jones'),
        Name.suffix('PhD'),
      ]);
      const serialized = name.serialize();

      expect(serialized.names.prefix).toBe('Dr');
      expect(serialized.names.firstName).toEqual({ value: 'John', more: ['Michael'] });
      expect(serialized.names.middleName).toEqual(['David']);
      expect(serialized.names.lastName).toEqual({ father: 'Smith', mother: 'Jones' });
      expect(serialized.names.suffix).toBe('PhD');
    });
  });

  describe('deserialize', () => {
    let defaultConfig: SerializedName['config'];

    beforeEach(() => {
      defaultConfig = {
        name: 'defaultConfig',
        orderedBy: 'firstName',
        separator: ' ',
        title: 'US',
        ending: false,
        bypass: true,
        surname: 'father',
      };
    });

    test('should deserialize a simple name from object', () => {
      const name = deserialize({
        names: { firstName: 'John', lastName: 'Smith' },
        config: { ...defaultConfig, name: 'fullName', bypass: false, surname: 'all' },
      });
      expect(name.first).toBe('John');
      expect(name.last).toBe('Smith');
      expect(name.full).toBe('John Smith');
      expect(name.middle).toBeUndefined();
      expect(name.prefix).toBeUndefined();
      expect(name.suffix).toBeUndefined();

      expect(name.config.name).toBe('fullName');
      expect(name.config.orderedBy).toBe('firstName');
      expect(name.config.separator).toBe(Separator.SPACE);
      expect(name.config.title).toBe(Title.US);
      expect(name.config.ending).toBe(false);
      expect(name.config.bypass).toBe(false);
      expect(name.config.surname).toBe(Surname.ALL);
    });

    test('should deserialize a name from JSON string', () => {
      const jsonString = JSON.stringify({
        names: {
          firstName: 'Jane',
          lastName: 'Doe',
          suffix: 'Ph.D',
        },
        config: {
          name: 'byLastName',
          orderedBy: 'lastName',
          separator: ',',
          title: 'UK',
          ending: true,
          bypass: true,
          surname: 'father',
        },
      });

      const name = deserialize(jsonString);
      expect(name.first).toBe('Jane');
      expect(name.last).toBe('Doe');
      expect(name.full).toBe('Doe Jane, Ph.D');
      expect(name.middle).toBeUndefined();
      expect(name.prefix).toBeUndefined();
      expect(name.suffix).toBe('Ph.D');

      expect(name.config.name).toBe('byLastName');
      expect(name.config.orderedBy).toBe(NameOrder.LAST_NAME);
      expect(name.config.separator).toBe(Separator.COMMA);
      expect(name.config.title).toBe(Title.UK);
      expect(name.config.ending).toBe(true);
      expect(name.config.bypass).toBe(true);
      expect(name.config.surname).toBe(Surname.FATHER);
    });

    test('should deserialize a name with prefix and suffix', () => {
      const name = deserialize({
        names: { prefix: 'Mr', firstName: 'John', lastName: 'Smith', suffix: 'Jr' },
        config: defaultConfig,
      });

      expect(name.prefix).toBe('Mr.');
      expect(name.first).toBe('John');
      expect(name.last).toBe('Smith');
      expect(name.suffix).toBe('Jr');
    });

    test('should deserialize a name with middle names', () => {
      const name = deserialize({
        names: { firstName: 'John', middleName: ['Michael', 'David'], lastName: 'Smith' },
        config: defaultConfig,
      });
      expect(name.middleName()).toEqual(['Michael', 'David']);
    });

    test('should deserialize a name with multiple first names', () => {
      const name = deserialize({
        names: { firstName: { value: 'John', more: ['Michael'] }, lastName: 'Smith' },
        config: defaultConfig,
      });
      expect(name.firstName(false)).toBe('John');
      expect(name.firstName(true)).toEqual('John Michael');
    });

    test('should deserialize a name with hyphenated last name', () => {
      const name = deserialize({
        names: {
          firstName: 'John',
          lastName: {
            father: 'Smith',
            mother: 'Jones',
          },
        },
        config: { ...defaultConfig, surname: 'hyphenated' },
      });
      expect(name.first).toBe('John');
      expect(name.last).toBe('Smith-Jones');
      expect(name.full).toBe('John Smith-Jones');
    });

    test('should throw NameError for invalid data', () => {
      expect(() => deserialize(null as any)).toThrow(InputError);
      expect(() => deserialize(undefined as any)).toThrow(InputError);
      expect(() => deserialize(123 as any)).toThrow(InputError);
      expect(() => deserialize('invalid json')).toThrow(UnknownError);
      expect(() => deserialize('{ invalid }')).toThrow(UnknownError);
      expect(() => deserialize({} as any)).toThrow(UnknownError);
    });
  });

  describe('round-trip', () => {
    test('should serialize and deserialize a simple name', () => {
      const original = new Namefully('John Smith', { name: 'round-trip' });
      const serialized = original.serialize();
      const deserialized = deserialize(serialized);

      expect(deserialized.config.name).toBe(original.config.name);
      expect(deserialized.full).toBe(original.full);
      expect(deserialized.firstName()).toBe(original.firstName());
      expect(deserialized.lastName()).toBe(original.lastName());
    });

    test('should serialize and deserialize a complex name', () => {
      const original = new Namefully([
        Name.prefix('Dr'),
        new FirstName('John', 'Michael'),
        Name.middle('David'),
        new LastName('Smith', 'Jones'),
        Name.suffix('PhD'),
      ]);
      const serialized = original.serialize();
      const deserialized = deserialize(serialized);

      expect(deserialized.prefix).toBe(original.prefix);
      expect(deserialized.firstName()).toBe(original.firstName());
      expect(deserialized.middleName()).toEqual(original.middleName());
      expect(deserialized.lastName()).toBe(original.lastName());
      expect(deserialized.suffix).toBe(original.suffix);
    });

    test('should serialize and deserialize from JSON string', () => {
      const original = new Namefully([Name.first('Jane'), Name.last('Doe')]);
      const serialized = original.serialize();
      const jsonString = JSON.stringify(serialized);
      const deserialized = deserialize(jsonString);

      expect(deserialized.full).toBe(original.full);
    });
  });
});
