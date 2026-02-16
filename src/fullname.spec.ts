import { FirstName, LastName, Name } from './name.js';
import { NameError, ValidationError } from './error.js';
import { FullName } from './fullname.js';
import { Config } from './config.js';
import { Namon } from './types.js';

describe('FullName', () => {
  let prefix: Name;
  let firstName: FirstName;
  let middleName: Name[];
  let lastName: LastName;
  let suffix: Name;
  let fullName: FullName;

  beforeEach(() => {
    prefix = Name.prefix('Mr');
    firstName = new FirstName('John');
    middleName = [Name.middle('Ben'), Name.middle('Carl')];
    lastName = new LastName('Smith');
    suffix = Name.suffix('Ph.D');
  });

  test('creates a full name from a json name', () => {
    expect(() => FullName.parse({ firstName: '', lastName: 'Smith' })).toThrow(NameError);
    fullName = FullName.parse({
      prefix: 'Mr',
      firstName: 'John',
      middleName: ['Ben', 'Carl'],
      lastName: 'Smith',
      suffix: 'Ph.D',
    });

    runExpectations(fullName);

    fullName = FullName.parse({
      prefix: 'Mr',
      firstName: { value: 'John', more: ['David'] },
      middleName: 'Michael',
      lastName: { father: 'Smith', mother: 'Jones' },
      suffix: 'Ph.D',
    });

    expect(fullName.prefix?.toString()).toBe('Mr');
    expect(fullName.firstName.toString()).toBe('John');
    expect(fullName.firstName.toString(true)).toBe('John David');
    expect(fullName.middleName.map((n) => n.toString()).join(' ')).toBe('Michael');
    expect(fullName.lastName.toString()).toBe('Smith');
    expect(fullName.lastName.toString('all')).toBe('Smith Jones');
    expect(fullName.suffix?.toString()).toBe('Ph.D');
  });

  test('builds a full name as it goes', () => {
    fullName = new FullName()
      .setPrefix(prefix)
      .setFirstName(firstName)
      .setMiddleName(middleName)
      .setLastName(lastName)
      .setSuffix(suffix);

    runExpectations(fullName);
  });

  test('enforces validation rules if needed when building a full name', () => {
    try {
      fullName = new FullName(Config.merge({ name: 'noBypass', bypass: false }))
        .setFirstName(new FirstName('2Pac')) // name with digits is invalid
        .setLastName(new LastName('Shakur'));

      fail('Expected NameError to be thrown');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(NameError);
      expect((error as NameError).name).toContain('ValidationError');
      expect((error as NameError).source).toContain('2Pac');
      expect((error as ValidationError).nameType).toBe('firstName');
    }
  });

  test('creates a full name as it goes from raw strings', () => {
    fullName = new FullName()
      .setPrefix('Mr')
      .setFirstName('John')
      .setMiddleName(['Ben', 'Carl'])
      .setLastName('Smith')
      .setSuffix('Ph.D');

    runExpectations(fullName);
  });

  test('.has() indicates whether a full name has a specific namon', () => {
    fullName = new FullName().setPrefix('Ms').setFirstName('Jane').setLastName('Doe');

    expect(fullName.has(Namon.PREFIX)).toBe(true);
    expect(fullName.has(Namon.FIRST_NAME)).toBe(true);
    expect(fullName.has(Namon.MIDDLE_NAME)).toBe(false);
    expect(fullName.has(Namon.LAST_NAME)).toBe(true);
    expect(fullName.has(Namon.SUFFIX)).toBe(false);
  });

  test('.toIterable() returns sequence of name parts', () => {
    fullName = new FullName()
      .setPrefix(prefix)
      .setFirstName(firstName)
      .setMiddleName(middleName)
      .setLastName(lastName)
      .setSuffix(suffix);

    const parts = fullName[Symbol.iterator]();
    expect(Name.prefix('Mr').equal(parts.next().value)).toBe(true);
    expect(Name.first('John').equal(parts.next().value)).toBe(true);
    expect(Name.middle('Ben').equal(parts.next().value)).toBe(true);
    expect(Name.middle('Carl').equal(parts.next().value)).toBe(true);
    expect(Name.last('Smith').equal(parts.next().value)).toBe(true);
    expect(Name.suffix('Ph.D').equal(parts.next().value)).toBe(true);

    const over = parts.next();
    expect(over.done).toBe(true);
    expect(over.value).toBe(undefined);
  });
});

function runExpectations(fullName: FullName) {
  expect(fullName.prefix).toBeInstanceOf(Name);
  expect(fullName.firstName).toBeInstanceOf(FirstName);
  fullName.middleName.forEach((name) => expect(name).toBeInstanceOf(Name));
  expect(fullName.lastName).toBeInstanceOf(LastName);
  expect(fullName.suffix).toBeInstanceOf(Name);

  expect(fullName.prefix?.toString()).toBe('Mr');
  expect(fullName.firstName.toString()).toBe('John');
  expect(fullName.middleName.map((n) => n.toString()).join(' ')).toBe('Ben Carl');
  expect(fullName.lastName.toString()).toBe('Smith');
  expect(fullName.suffix?.toString()).toBe('Ph.D');
}
