import { Config } from './config.js';
import { NameError } from './error.js';
import { FirstName, LastName, Name } from './name.js';
import { Namefully } from './namefully.js';
import { NameBuilder } from './builder.js';
import { Flat, NameOrder, NameType, Namon, Separator, Surname, Title } from './types.js';
import { SimpleParser, findNameCase } from './fixtures/helpers.js';
import { NameIndex } from './utils.js';

describe('Namefully', () => {
  describe('(default settings)', () => {
    let name: Namefully;

    beforeEach(() => {
      name = new Namefully('Mr John Ben Smith Ph.D', Config.create('generic'));
    });

    test('.parts returns the name components as a sequence', () => {
      for (const part of name.parts) {
        expect(part).toBeInstanceOf(Name);
      }
      expect(Array.from(name.parts).length).toBe(5);
    });

    test('.[Symbol.iterator]() returns sequence of name parts', () => {
      const parts = name[Symbol.iterator]();
      expect(Name.prefix('Mr').equal(parts.next().value)).toBe(true);
      expect(Name.first('John').equal(parts.next().value)).toBe(true);
      expect(Name.middle('Ben').equal(parts.next().value)).toBe(true);
      expect(Name.last('Smith').equal(parts.next().value)).toBe(true);
      expect(Name.suffix('Ph.D').equal(parts.next().value)).toBe(true);

      const over = parts.next();
      expect(over.done).toBe(true);
      expect(over.value).toBe(undefined);
    });

    test('.has() determines if the full name has a specific namon', () => {
      expect(name.has(Namon.PREFIX)).toBe(true);
      expect(name.has(Namon.SUFFIX)).toBe(true);
      expect(name.has(Namon.MIDDLE_NAME)).toBe(true);
      expect(name.hasMiddle).toBe(true);

      expect(name.has('firstName')).toBe(true);
      expect(name.has('lastName')).toBe(true);
      expect(name.has('middle')).toBe(false); // unknown namon key.
    });

    test('.toString() returns a String version of the full name', () => {
      expect(name.toString()).toBe('Mr John Ben Smith Ph.D');
    });

    test('.equal() checks whether two names are equal from a raw-string perspective', () => {
      const names = [Name.prefix('Mr'), new FirstName('John', 'Ben'), new LastName('Smith'), Name.suffix('Ph.D')];
      expect(name.equal(new Namefully(names))).toBe(true);
      expect(name.equal(new Namefully(names.slice(1)))).toBe(false);
    });

    test('.deepEqual() checks whether two names are equal from a component perspective', () => {
      const name1 = new Namefully('John Ben Smith');
      const name2 = new Namefully([new FirstName('John', 'Ben'), new LastName('Smith')]);
      expect(name1.equal(name2)).toBe(true);
      expect(name1.deepEqual(name2)).toBe(false);
    });

    test('get(). gets the raw form of a name', () => {
      expect(name.config).toBeDefined();
      expect(name.get(Namon.PREFIX)).toBeInstanceOf(Name);
      expect(name.get(Namon.FIRST_NAME)).toBeInstanceOf(FirstName);
      expect(name.get(Namon.LAST_NAME)).toBeInstanceOf(LastName);
      expect(name.get(Namon.SUFFIX)).toBeInstanceOf(Name);

      const middles = name.get(Namon.MIDDLE_NAME) as Name[];
      middles.forEach((n) => expect(n).toBeInstanceOf(Name));

      expect(name.get('prefix')).toBeInstanceOf(Name);
      expect(name.get('firstName')).toBeInstanceOf(FirstName);
      expect(name.get('lastName')).toBeInstanceOf(LastName);
      expect(name.get('suffix')).toBeInstanceOf(Name);
    });

    test('.json() returns a json version of the full name', () => {
      expect(name.json()).toStrictEqual({
        prefix: 'Mr',
        firstName: 'John',
        middleName: ['Ben'],
        lastName: 'Smith',
        suffix: 'Ph.D',
      });
    });

    test('.format() formats a full name as desired', () => {
      expect(name.format('short')).toBe('John Smith');
      expect(name.format('long')).toBe('John Ben Smith');
      expect(name.format('public')).toBe('John S');
      expect(name.format('official')).toBe('Mr SMITH, John Ben Ph.D');

      expect(name.format('B')).toBe('JOHN BEN SMITH');
      expect(name.format('F')).toBe('JOHN');
      expect(name.format('L')).toBe('SMITH');
      expect(name.format('M')).toBe('BEN');
      expect(name.format('O')).toBe('MR SMITH, JOHN BEN PH.D');
      expect(name.format('P')).toBe('MR');
      expect(name.format('S')).toBe('PH.D');

      expect(name.format('b')).toBe('John Ben Smith');
      expect(name.format('f')).toBe('John');
      expect(name.format('l')).toBe('Smith');
      expect(name.format('m')).toBe('Ben');
      expect(name.format('o')).toBe('Mr SMITH, John Ben Ph.D');
      expect(name.format('p')).toBe('Mr');
      expect(name.format('s')).toBe('Ph.D');

      expect(name.format('f $l')).toBe('John S');
      expect(name.format('f $l.')).toBe('John S.');
      expect(name.format('f $m. l')).toBe('John B. Smith');
      expect(name.format('$F.$M.$L')).toBe('J.B.S');
      expect(name.format('$p')).toBe('');

      expect(new Namefully('John Smith').format('o')).toBe('SMITH, John');
    });

    test('converts a birth name to a specific capitalization case', () => {
      expect(name.toLowerCase()).toBe('john ben smith');
      expect(name.toUpperCase()).toBe('JOHN BEN SMITH');
      expect(name.toCamelCase()).toBe('johnBenSmith');
      expect(name.toPascalCase()).toBe('JohnBenSmith');
      expect(name.toSnakeCase()).toBe('john_ben_smith');
      expect(name.toHyphenCase()).toBe('john-ben-smith');
      expect(name.toDotCase()).toBe('john.ben.smith');
      expect(name.toToggleCase()).toBe('jOHN bEN sMITH');
    });

    test('.split() splits the birth name according to a pattern', () => {
      expect(name.split()).toStrictEqual(['John', 'Ben', 'Smith']);
    });

    test('.join() joins each piece of the birth name with a separator', () => {
      expect(name.join('+')).toBe('John+Ben+Smith');
    });

    test('.flip() flips the name order from the current config', () => {
      name.flip(); // was before ordered by firstName.
      expect(name.birth).toBe('Smith John Ben');
      expect(name.first).toBe('John');
      expect(name.last).toBe('Smith');
      name.flip(); // flip back to the firstName name order.
    });
  });

  describe('(by first name)', () => {
    let name: Namefully;

    beforeEach(() => {
      name = new Namefully(
        'Mr John Ben Smith Ph.D',
        Config.merge({ name: 'byFirstName', orderedBy: NameOrder.FIRST_NAME }),
      );
    });

    test('creates a full name', () => {
      expect(name.prefix).toBe('Mr');
      expect(name.first).toBe('John');
      expect(name.middle).toBe('Ben');
      expect(name.last).toBe('Smith');
      expect(name.suffix).toBe('Ph.D');
      expect(name.birth).toBe('John Ben Smith');
      expect(name.short).toBe('John Smith');
      expect(name.long).toBe('John Ben Smith');
      expect(name.public).toBe('John S');
      expect(name.salutation).toBe('Mr Smith');
      expect(name.full).toBe('Mr John Ben Smith Ph.D');
      expect(name.fullName()).toBe('Mr John Ben Smith Ph.D');
      expect(name.fullName(NameOrder.LAST_NAME)).toBe('Mr Smith John Ben Ph.D');
      expect(name.birthName()).toBe('John Ben Smith');
      expect(name.birthName(NameOrder.LAST_NAME)).toBe('Smith John Ben');
    });

    test('.initials() returns the initials of the full name', () => {
      expect(name.initials()).toStrictEqual(['J', 'B', 'S']);
      expect(name.initials({ orderedBy: NameOrder.LAST_NAME })).toStrictEqual(['S', 'J', 'B']);
      expect(name.initials({ only: NameType.FIRST_NAME })).toStrictEqual(['J']);
      expect(name.initials({ only: NameType.MIDDLE_NAME })).toStrictEqual(['B']);
      expect(name.initials({ only: NameType.LAST_NAME })).toStrictEqual(['S']);
      expect(name.initials({ asJson: true })).toStrictEqual({ firstName: ['J'], middleName: ['B'], lastName: ['S'] });
    });

    test('.shorten() shortens a full name to a first and last name', () => {
      expect(name.shorten()).toBe('John Smith');
      expect(name.shorten(NameOrder.LAST_NAME)).toBe('Smith John');
    });

    test('.flatten() flattens a full name based on specs', () => {
      const shortName = new Namefully('John Smith');
      expect(name.flatten({ limit: 10, by: Flat.MIDDLE_NAME })).toBe('John B. Smith');
      expect(name.flatten({ limit: 10, by: Flat.MIDDLE_NAME, withPeriod: false })).toBe('John B Smith');
      expect(shortName.flatten({ limit: 10, by: Flat.MIDDLE_NAME, withPeriod: false })).toBe('John Smith');
      expect(shortName.flatten({ limit: 8, by: Flat.FIRST_MID })).toBe('J. Smith');

      expect(name.flatten({ limit: 10, recursive: true })).toBe('John B. S.');
      expect(name.flatten({ limit: 5, recursive: true })).toBe('J. B. S.');
      expect(name.flatten({ limit: 10, recursive: true, withPeriod: false })).toBe('John Ben S');
    });

    test('.zip() flattens a full name', () => {
      expect(name.zip()).toBe('John B. S.');
      expect(name.zip(Flat.FIRST_NAME)).toBe('J. Ben Smith');
      expect(name.zip(Flat.MIDDLE_NAME)).toBe('John B. Smith');
      expect(name.zip(Flat.LAST_NAME)).toBe('John Ben S.');
      expect(name.zip(Flat.FIRST_MID)).toBe('J. B. Smith');
      expect(name.zip(Flat.MID_LAST)).toBe('John B. S.');
      expect(name.zip(Flat.ALL)).toBe('J. B. S.');
    });
  });

  describe('(by last name)', () => {
    let name: Namefully;

    beforeEach(() => {
      name = new Namefully(
        'Mr Smith John Ben Ph.D',
        Config.merge({ name: 'byLastName', orderedBy: NameOrder.LAST_NAME }),
      );
    });

    test('creates a full name', () => {
      expect(name.prefix).toBe('Mr');
      expect(name.first).toBe('John');
      expect(name.middle).toBe('Ben');
      expect(name.last).toBe('Smith');
      expect(name.suffix).toBe('Ph.D');
      expect(name.birth).toBe('Smith John Ben');
      expect(name.short).toBe('Smith John');
      expect(name.long).toBe('Smith John Ben');
      expect(name.public).toBe('John S');
      expect(name.salutation).toBe('Mr Smith');
      expect(name.full).toBe('Mr Smith John Ben Ph.D');
      expect(name.fullName()).toBe('Mr Smith John Ben Ph.D');
      expect(name.fullName(NameOrder.FIRST_NAME)).toBe('Mr John Ben Smith Ph.D');
      expect(name.birthName()).toBe('Smith John Ben');
      expect(name.birthName(NameOrder.FIRST_NAME)).toBe('John Ben Smith');
    });

    test('.initials() returns the initials of the full name', () => {
      expect(name.initials()).toStrictEqual(['S', 'J', 'B']);
      expect(name.initials({ orderedBy: NameOrder.FIRST_NAME })).toStrictEqual(['J', 'B', 'S']);
      expect(name.initials({ only: NameType.FIRST_NAME })).toStrictEqual(['J']);
      expect(name.initials({ only: NameType.MIDDLE_NAME })).toStrictEqual(['B']);
      expect(name.initials({ only: NameType.LAST_NAME })).toStrictEqual(['S']);
      expect(name.initials({ asJson: true })).toStrictEqual({ firstName: ['J'], middleName: ['B'], lastName: ['S'] });
    });

    test('.shorten() shortens a full name to a first and last name', () => {
      expect(name.shorten()).toBe('Smith John');
      expect(name.shorten(NameOrder.FIRST_NAME)).toBe('John Smith');
    });

    test('.flatten() flattens a full name based on specs', () => {
      const shortName = new Namefully('Smith John', Config.create('byLastName'));
      expect(name.flatten({ limit: 10, by: Flat.MIDDLE_NAME })).toBe('Smith John B.');
      expect(name.flatten({ limit: 10, by: Flat.MIDDLE_NAME, withPeriod: false })).toBe('Smith John B');
      expect(shortName.flatten({ limit: 10, by: Flat.MIDDLE_NAME, withPeriod: false })).toBe('Smith John');
      expect(shortName.flatten({ limit: 8, by: Flat.FIRST_MID, withPeriod: true })).toBe('Smith J.');
    });

    test('.zip() flattens a full name', () => {
      expect(name.zip()).toBe('S. John B.');
      expect(name.zip(Flat.MID_LAST, false)).toBe('S John B');
      expect(name.zip(Flat.FIRST_NAME)).toBe('Smith J. Ben');
      expect(name.zip(Flat.MIDDLE_NAME)).toBe('Smith John B.');
      expect(name.zip(Flat.LAST_NAME)).toBe('S. John Ben');
      expect(name.zip(Flat.FIRST_MID)).toBe('Smith J. B.');
      expect(name.zip(Flat.MID_LAST)).toBe('S. John B.');
      expect(name.zip(Flat.ALL)).toBe('S. J. B.');
    });
  });

  describe('can be instantiated with', () => {
    test('string', () => {
      expect(new Namefully('John Smith').toString()).toBe('John Smith');
    });

    test('string[]', () => {
      expect(new Namefully(['John', 'Smith']).toString()).toBe('John Smith');
    });

    test('json', () => {
      expect(new Namefully({ firstName: 'John', lastName: 'Smith' }).toString()).toBe('John Smith');
    });

    test('Name[]', () => {
      const names = [new FirstName('John'), new LastName('Smith')];
      expect(new Namefully(names).toString()).toBe('John Smith');
      expect(new Namefully([Name.first('John'), Name.last('Smith'), Name.suffix('Ph.D')]).birth).toBe('John Smith');
    });

    test('NameBuilder', () => {
      const builder = NameBuilder.create();
      builder.add(Name.first('John'), Name.last('Smith'), Name.suffix('Ph.D'));
      expect(builder.build().birth).toBe('John Smith');
    });

    test('Parser<T> (Custom Parser)', () => {
      expect(new Namefully(new SimpleParser('John#Smith'), Config.create('simpleParser')).toString()).toBe(
        'John Smith',
      );
    });

    test('tryParse()', () => {
      expect(Namefully.tryParse('John')).toBeUndefined();

      let parsed = Namefully.tryParse('John Smith');
      expect(parsed).toBeDefined();
      expect(parsed?.short).toBe('John Smith');
      expect(parsed?.first).toBe('John');
      expect(parsed?.last).toBe('Smith');
      expect(parsed?.middle).toBeUndefined();

      parsed = Namefully.tryParse('John Ben Smith');
      expect(parsed).toBeDefined();
      expect(parsed?.short).toBe('John Smith');
      expect(parsed?.first).toBe('John');
      expect(parsed?.last).toBe('Smith');
      expect(parsed?.middle).toBe('Ben');

      parsed = Namefully.tryParse('John Some Other Name Parts Smith');
      expect(parsed).toBeDefined();
      expect(parsed?.short).toBe('John Smith');
      expect(parsed?.first).toBe('John');
      expect(parsed?.last).toBe('Smith');
      expect(parsed?.middle).toBe('Some');
      expect(parsed?.middleName().join(' ')).toBe('Some Other Name Parts');

      parsed = Namefully.tryParse(
        'John "Nickname" Smith Ph.D',
        NameIndex.only({ firstName: 0, lastName: 2, suffix: 3 }),
      );
      expect(parsed).toBeDefined();
      expect(parsed?.short).toBe('John Smith');
      expect(parsed?.first).toBe('John');
      expect(parsed?.last).toBe('Smith');
      expect(parsed?.suffix).toBe('Ph.D');
      expect(parsed?.middle).toBeUndefined();
    });

    test('parse()', async () => {
      let parsed = await Namefully.parse('John Smith');
      expect(parsed.short).toBe('John Smith');
      expect(parsed.first).toBe('John');
      expect(parsed.last).toBe('Smith');
      expect(parsed.middle).toBeUndefined();

      parsed = await Namefully.parse('John Ben Smith');
      expect(parsed.short).toBe('John Smith');
      expect(parsed.first).toBe('John');
      expect(parsed.last).toBe('Smith');
      expect(parsed.middle).toBe('Ben');

      parsed = await Namefully.parse('John Some Other Name Parts Smith');
      expect(parsed).toBeDefined();
      expect(parsed.short).toBe('John Smith');
      expect(parsed.first).toBe('John');
      expect(parsed.last).toBe('Smith');
      expect(parsed.middle).toBe('Some');
      expect(parsed.middleName().join(' ')).toBe('Some Other Name Parts');

      await expect(Namefully.parse('John')).rejects.toThrow(NameError);
    });
  });

  describe('can be built with a name', () => {
    test('ordered by lastName', () => {
      const name = findNameCase('byLastName');
      expect(name.toString()).toBe('Obama Barack');
      expect(name.firstName()).toBe('Barack');
      expect(name.lastName()).toBe('Obama');
    });

    test('containing many first names', () => {
      const name = findNameCase('manyFirstNames');
      expect(name.toString()).toBe('Daniel Michael Blake Day-Lewis');
      expect(name.firstName(false)).toBe('Daniel');
      expect(name.firstName()).toBe('Daniel Michael Blake');
      expect(name.hasMiddle).toBe(false);
    });

    test('containing many middle names', () => {
      const name = findNameCase('manyMiddleNames');
      expect(name.toString()).toBe('Emilia Isobel Euphemia Rose Clarke');
      expect(name.hasMiddle).toBe(true);
      expect(name.middleName()).toStrictEqual(['Isobel', 'Euphemia', 'Rose']);
    });

    test('containing many last names', () => {
      const name = findNameCase('manyLastNames');
      expect(name.toString()).toBe('Shakira Isabel Ripoll');
      expect(name.lastName()).toBe('Ripoll');
      expect(name.lastName(Surname.ALL)).toBe('Mebarak Ripoll');
    });

    test('containing a US title', () => {
      const name = findNameCase('withTitling');
      expect(name.toString()).toBe('Dr. Albert Einstein');
      expect(name.prefix).toBe('Dr.');
    });

    test('separated by commas', () => {
      const name = findNameCase('withSeparator');
      expect(name.toString()).toBe('Thiago Da Silva');
      expect(name.lastName()).toBe('Da Silva');
    });

    test('containing a suffix', () => {
      const name = findNameCase('withEnding');
      expect(name.toString()).toBe('Fabrice Piazza, Ph.D');
      expect(name.birthName()).toBe('Fabrice Piazza');
      expect(name.suffix).toBe('Ph.D');
    });

    test('with validation rules', () => {
      expect(() => findNameCase('noBypass')).toThrow(NameError);
      expect(() => new Namefully('Mr John Joe Sm1th', Config.create('noBypass'))).toThrow(NameError);
      expect(() => new Namefully('Mr John Joe Smith Ph+', Config.create('noBypass'))).toThrow(NameError);
    });
  });

  describe('Config', () => {
    test('creates a default configuration', () => {
      expect(Config.create()).toEqual(
        expect.objectContaining({
          name: 'default',
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: true,
          ending: false,
          surname: Surname.FATHER,
        }),
      );
    });

    test('merges a configuration with partial options', () => {
      expect(
        Config.merge({
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.COLON,
          title: Title.US,
          surname: Surname.HYPHENATED,
          ending: true,
        }),
      ).toEqual(
        expect.objectContaining({
          name: 'default',
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.COLON,
          title: Title.US,
          bypass: true,
          ending: true,
          surname: Surname.HYPHENATED,
        }),
      );
    });

    test('can create more than 1 configuration when necessary', () => {
      const defaultConfig = Config.create('defaultConfig');
      const otherConfig = Config.merge({
        name: 'otherConfig',
        orderedBy: NameOrder.LAST_NAME,
        surname: Surname.MOTHER,
        bypass: false,
      });

      // Check the default config is not altered by the other config.
      expect(defaultConfig).toEqual(
        expect.objectContaining({
          name: 'defaultConfig',
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: true,
          ending: false,
          surname: Surname.FATHER,
        }),
      );

      // Check the other config is set as defined.
      expect(otherConfig).toEqual(
        expect.objectContaining({
          name: 'otherConfig',
          orderedBy: NameOrder.LAST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: false,
          ending: false,
          surname: Surname.MOTHER,
        }),
      );
    });

    test('can create a copy from an existing configuration', () => {
      const config = Config.create('config');
      const copyConfig = config.copyWith({
        name: 'config', // can be omitted.
        orderedBy: NameOrder.LAST_NAME,
        surname: Surname.MOTHER,
        bypass: false,
      });
      const cloneCopyConfig = copyConfig.clone();

      // Check that the copied config is set as defined.
      expect(copyConfig).toEqual(
        expect.objectContaining({
          name: 'config_copy',
          orderedBy: NameOrder.LAST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: false,
          ending: false,
          surname: Surname.MOTHER,
        }),
      );

      // Check that the clone copy config is same as the copy config.
      expect(cloneCopyConfig).toEqual(
        expect.objectContaining({
          name: 'config_copy_copy',
          orderedBy: NameOrder.LAST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: false,
          ending: false,
          surname: Surname.MOTHER,
        }),
      );

      // Check that the config is not altered by the copy config.
      expect(config).toEqual(
        expect.objectContaining({
          name: 'config',
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: true,
          ending: false,
          surname: Surname.FATHER,
        }),
      );

      // Resets the copy config to the default.
      copyConfig.reset();
      expect(copyConfig).toEqual(
        expect.objectContaining({
          name: 'config_copy',
          orderedBy: NameOrder.FIRST_NAME,
          separator: Separator.SPACE,
          title: Title.UK,
          bypass: true,
          ending: false,
          surname: Surname.FATHER,
        }),
      );
    });
  });
});
