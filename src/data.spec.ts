import { Namefully } from './namefully.js';
import { InputError, UnknownError } from './error.js';
import { Name, FirstName, LastName } from './name.js';
import { deserialize, SerializedName } from './data.js';

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
    test('should deserialize a simple name from object', () => {
      const data: SerializedName = {
        names: {
          firstName: 'John',
          lastName: 'Smith',
        },
        config: {
          name: 'fullName',
          orderedBy: 'firstName',
          separator: ' ',
          title: 'US',
          ending: false,
          bypass: false,
          surname: 'father',
        },
      };

      const name = deserialize(data);
      expect(name.firstName()).toBe('John');
      expect(name.lastName()).toBe('Smith');
      expect(name.full).toBe('John Smith');
    });

    test('should deserialize a name from JSON string', () => {
      const jsonString = JSON.stringify({
        names: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
        config: {
          name: 'fullName',
          orderedBy: 'firstName',
          separator: ' ',
          title: 'US',
          ending: false,
          bypass: false,
          surname: 'father',
        },
      });

      const name = deserialize(jsonString);
      expect(name.firstName()).toBe('Jane');
      expect(name.lastName()).toBe('Doe');
    });

    test('should deserialize a name with prefix and suffix', () => {
      const original = new Namefully([Name.prefix('Mr'), Name.first('John'), Name.last('Smith'), Name.suffix('Jr')]);
      const serialized = original.serialize();

      const name = deserialize(serialized);
      expect(name.prefix).toBe(original.prefix);
      expect(name.suffix).toBe(original.suffix);
    });

    test('should deserialize a name with middle names', () => {
      const data: SerializedName = {
        names: {
          firstName: 'John',
          middleName: ['Michael', 'David'],
          lastName: 'Smith',
        },
        config: {
          name: 'fullName',
          orderedBy: 'firstName',
          separator: ' ',
          title: 'US',
          ending: false,
          bypass: false,
          surname: 'father',
        },
      };

      const name = deserialize(data);
      expect(name.middleName()).toEqual(['Michael', 'David']);
    });

    test('should deserialize a name with multiple first names', () => {
      const data: SerializedName = {
        names: {
          firstName: {
            value: 'John',
            more: ['Michael'],
          },
          lastName: 'Smith',
        },
        config: {
          name: 'fullName',
          orderedBy: 'firstName',
          separator: ' ',
          title: 'US',
          ending: false,
          bypass: false,
          surname: 'father',
        },
      };

      const name = deserialize(data);
      expect(name.firstName(false)).toBe('John');
    });

    test('should deserialize a name with hyphenated last name', () => {
      const data: SerializedName = {
        names: {
          firstName: 'John',
          lastName: {
            father: 'Smith',
            mother: 'Jones',
          },
        },
        config: {
          name: 'fullName',
          orderedBy: 'firstName',
          separator: ' ',
          title: 'US',
          ending: false,
          bypass: false,
          surname: 'father',
        },
      };

      const name = deserialize(data);
      expect(name.lastName()).toBe('Smith');
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
