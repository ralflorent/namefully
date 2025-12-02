import { InputError } from './error.js';
import { FirstName, LastName, Name } from './name.js';
import { CapsRange, Namon, Surname } from './types.js';

describe('Name', () => {
  let name: Name;

  beforeEach(() => (name = Name.middle('John')));

  test('throws an exception if a name has less than 1 characters', () => {
    expect(() => Name.first('')).toThrow(InputError);
    expect(() => new FirstName('John', '')).toThrow(InputError);
    expect(() => new LastName('Smith', '')).toThrow(InputError);
  });

  test('creates a name marked with a specific type', () => {
    expect(name.value).toBe('John');
    expect(name.length).toBe(4);
    expect(name.toString()).toBe('John');
    expect(name.type).toBe(Namon.MIDDLE_NAME);
    expect(name.isPrefix).toBe(false);
    expect(name.isFirstName).toBe(false);
    expect(name.isMiddleName).toBe(true);
    expect(name.isLastName).toBe(false);
    expect(name.isSuffix).toBe(false);
  });

  test('creates a name with its initial capitalized', () => {
    expect(new Name('ben', Namon.FIRST_NAME, CapsRange.INITIAL).toString()).toBe('Ben');
  });

  test('creates a name fully capitalized', () => {
    expect(new Name('rick', Namon.FIRST_NAME, CapsRange.ALL).toString()).toBe('RICK');
  });

  test('.equal() returns true if both names are equal', () => {
    expect(name.equal(Name.middle('John'))).toBe(true);
    expect(name.equal(Name.middle('Johnx'))).toBe(false);
    expect(name.equal(Name.prefix('John'))).toBe(false);
  });

  test('.initials() returns only the initials of the name', () => {
    expect(name.initials()).toStrictEqual(['J']);
  });

  test('.caps() capitalizes the name afterwards', () => {
    expect(name.caps().toString()).toBe('John');
    expect(name.caps(CapsRange.ALL).toString()).toBe('JOHN');
  });

  test('.decaps() de-capitalizes the name afterwards', () => {
    const n = Name.first('MORTY');
    expect(n.decaps().toString()).toBe('mORTY');
    expect(n.decaps(CapsRange.ALL).toString()).toBe('morty');
  });
});

describe('FirstName', () => {
  let firstName: FirstName;

  beforeAll(() => (firstName = new FirstName('John', 'Ben', 'Carl')));

  test('creates a first name', () => {
    var name = new FirstName('John');
    expect(name.toString()).toBe('John');
    expect(name.more).toStrictEqual([]);
    expect(name.type).toBe(Namon.FIRST_NAME);
    expect(name.length).toBe(4);
  });

  test('creates a first name with additional parts', () => {
    expect(firstName.toString()).toBe('John');
    expect(firstName.more).toStrictEqual(['Ben', 'Carl']);
    expect(firstName.type).toBe(Namon.FIRST_NAME);
  });

  test('.hasMore indicates if a first name has more than 1 name part', () => {
    expect(firstName.hasMore).toBe(true);
    expect(new FirstName('John').hasMore).toBe(false);
  });

  test('.copyWith() makes a copy of the first name with specific parts', () => {
    const copy = firstName.copyWith({ first: 'Jacky', more: ['Bob'] });
    expect(copy.toString()).toBe('Jacky');
    expect(copy.more).toStrictEqual(['Bob']);
    expect(copy.type).toBe(Namon.FIRST_NAME);
  });

  test('.asNames returns the name parts as a pile of [Name]s', () => {
    const names = firstName.asNames;
    expect(names.length).toBe(3);
    expect(names[0].toString()).toBe('John');
    expect(names[1].toString()).toBe('Ben');
    expect(names[2].toString()).toBe('Carl');
    for (const name of names) {
      expect(name).toBeInstanceOf(Name);
      expect(name.type).toBe(Namon.FIRST_NAME);
    }
  });

  test('.toString() returns a string version of the first name', () => {
    expect(firstName.toString()).toBe('John');
    expect(firstName.toString(true)).toBe('John Ben Carl');
  });

  test('.initials() returns only the initials of the specified parts', () => {
    expect(firstName.initials()).toStrictEqual(['J']);
    expect(firstName.initials(true)).toStrictEqual(['J', 'B', 'C']);
  });

  test('.caps() capitalizes a first name afterwards', () => {
    const name = new FirstName('john', 'ben', 'carl');
    expect(name.caps().toString()).toBe('John');
    expect(name.caps().toString(true)).toBe('John Ben Carl');
  });

  test('.caps() capitalizes all parts of a first name afterwards', () => {
    expect(firstName.caps(CapsRange.ALL).toString()).toBe('JOHN');
    expect(firstName.caps(CapsRange.ALL).toString(true)).toBe('JOHN BEN CARL');
  });

  test('.decaps() de-capitalizes a first name afterwards', () => {
    const name = new FirstName('JOHN', 'BEN', 'CARL');
    expect(name.decaps().toString()).toBe('jOHN');
    expect(name.decaps().toString(true)).toBe('jOHN bEN cARL');
  });

  test('.decaps() de-capitalizes all parts of a first name afterwards', () => {
    const name = new FirstName('JOHN', 'BEN', 'CARL');
    expect(name.decaps(CapsRange.ALL).toString()).toBe('john');
    expect(name.decaps(CapsRange.ALL).toString(true)).toBe('john ben carl');
  });
});

describe('LastName', () => {
  let lastName: LastName;

  beforeEach(() => (lastName = new LastName('Smith', 'Doe')));

  test('creates a last name with a father surname only', () => {
    const name = new LastName('Smith');
    expect(name.father).toBe('Smith');
    expect(name.hasMother).toBe(false);
    expect(name.mother).toBeUndefined();
    expect(name.toString(Surname.MOTHER)).toBe('');
    expect(name.type).toBe(Namon.LAST_NAME);
    expect(name.length).toBe(5);
  });

  test('creates a last name with both father and mother surnames', () => {
    expect(lastName.father).toBe('Smith');
    expect(lastName.hasMother).toBe(true);
    expect(lastName.length).toBe(8);
    expect(lastName.toString(Surname.MOTHER)).toBe('Doe');
    expect(lastName.type).toBe(Namon.LAST_NAME);
  });

  test('creates a last name with a [Surname.MOTHER] format', () => {
    expect(new LastName('Smith', 'Doe', Surname.MOTHER).toString()).toBe('Doe');
  });

  test('creates a last name with a [Surname.HYPHENATED] format', () => {
    expect(new LastName('Smith', 'Doe', Surname.HYPHENATED).toString()).toBe('Smith-Doe');
  });

  test('creates a last name with a [Surname.ALL] format', () => {
    expect(new LastName('Smith', 'Doe', Surname.ALL).toString()).toBe('Smith Doe');
  });

  test('.asNames returns the name parts as a pile of [Name]s', () => {
    const names = lastName.asNames;
    expect(names.length).toBe(2);
    expect(names[0].toString()).toBe('Smith');
    expect(names[1].toString()).toBe('Doe');
    for (const name of names) {
      expect(name).toBeInstanceOf(Name);
      expect(name.type).toBe(Namon.LAST_NAME);
    }
  });

  test('.toString() outputs a last name with a specific format', () => {
    expect(lastName.toString()).toBe('Smith');
    expect(lastName.toString(Surname.MOTHER)).toBe('Doe');
    expect(lastName.toString(Surname.HYPHENATED)).toBe('Smith-Doe');
    expect(lastName.toString(Surname.ALL)).toBe('Smith Doe');
  });

  test('.initials() returns only the initials of the specified parts', () => {
    expect(lastName.initials()).toStrictEqual(['S']);
    expect(lastName.initials(Surname.MOTHER)).toStrictEqual(['D']);
    expect(lastName.initials(Surname.HYPHENATED)).toStrictEqual(['S', 'D']);
    expect(lastName.initials(Surname.ALL)).toStrictEqual(['S', 'D']);
  });

  test('.caps() capitalizes a last name afterwards', () => {
    const name = new LastName('sánchez');
    expect(name.caps().toString()).toBe('Sánchez');
    expect(name.caps(CapsRange.ALL).toString()).toBe('SÁNCHEZ');
  });

  test('.caps() capitalizes all parts of the last name afterwards', () => {
    expect(lastName.caps(CapsRange.ALL).toString()).toBe('SMITH');
    expect(lastName.caps(CapsRange.ALL).toString(Surname.ALL)).toBe('SMITH DOE');
  });

  test('.decaps() de-capitalizes the last name afterwards', () => {
    const name = new LastName('SMITH', 'DOE');
    expect(name.decaps().toString()).toBe('sMITH');
    expect(name.decaps().toString(Surname.ALL)).toBe('sMITH dOE');
  });

  test('.decaps() de-capitalizes all parts of a last name afterwards', () => {
    const name = new LastName('SMITH', 'DOE');
    expect(name.decaps(CapsRange.ALL).toString()).toBe('smith');
    expect(name.decaps(CapsRange.ALL).toString(Surname.ALL)).toBe('smith doe');
  });

  test('.copyWith() makes a copy of the last name with specific parts', () => {
    let copy = lastName.copyWith({ father: 'Moss' });
    expect(copy.father).toBe('Moss');
    expect(copy.hasMother).toBe(true);
    expect(copy.length).toBe(7);
    expect(copy.toString(Surname.MOTHER)).toBe('Doe');
    expect(copy.type).toBe(Namon.LAST_NAME);

    copy = lastName.copyWith({ mother: 'Kruger' });
    expect(copy.father).toBe('Smith');
    expect(copy.hasMother).toBe(true);
    expect(copy.length).toBe(11);
    expect(copy.toString(Surname.MOTHER)).toBe('Kruger');
    expect(copy.type).toBe(Namon.LAST_NAME);
  });
});
