import { Name } from '../src/name';
import { CapsRange, NameOrder, Separator } from '../src/types';
import { capitalize, decapitalize, isNameArray, isStringArray, NameIndex, toggleCase } from '../src/utils';

describe('Utils', () => {
  test('NameIndex.when() provides the name indexes from a list of names when ordered by first name', () => {
    let indexes = NameIndex.when(NameOrder.FIRST_NAME);
    expect(indexes.firstName).toEqual(0);
    expect(indexes.lastName).toEqual(1);

    indexes = NameIndex.when(NameOrder.FIRST_NAME, 3);
    expect(indexes.firstName).toEqual(0);
    expect(indexes.middleName).toEqual(1);
    expect(indexes.lastName).toEqual(2);

    indexes = NameIndex.when(NameOrder.FIRST_NAME, 4);
    expect(indexes.prefix).toEqual(0);
    expect(indexes.firstName).toEqual(1);
    expect(indexes.middleName).toEqual(2);
    expect(indexes.lastName).toEqual(3);

    indexes = NameIndex.when(NameOrder.FIRST_NAME, 5);
    expect(indexes.prefix).toEqual(0);
    expect(indexes.firstName).toEqual(1);
    expect(indexes.middleName).toEqual(2);
    expect(indexes.lastName).toEqual(3);
    expect(indexes.suffix).toEqual(4);
  });

  test('NameIndex.when() provides the name indexes from a list of names when ordered by last name', () => {
    let indexes = NameIndex.when(NameOrder.LAST_NAME, 2);
    expect(indexes.lastName).toEqual(0);
    expect(indexes.firstName).toEqual(1);

    indexes = NameIndex.when(NameOrder.LAST_NAME, 3);
    expect(indexes.lastName).toEqual(0);
    expect(indexes.firstName).toEqual(1);
    expect(indexes.middleName).toEqual(2);

    indexes = NameIndex.when(NameOrder.LAST_NAME, 4);
    expect(indexes.prefix).toEqual(0);
    expect(indexes.lastName).toEqual(1);
    expect(indexes.firstName).toEqual(2);
    expect(indexes.middleName).toEqual(3);

    indexes = NameIndex.when(NameOrder.LAST_NAME, 5);
    expect(indexes.prefix).toEqual(0);
    expect(indexes.lastName).toEqual(1);
    expect(indexes.firstName).toEqual(2);
    expect(indexes.middleName).toEqual(3);
    expect(indexes.suffix).toEqual(4);
  });

  test('NameIndex.when() provides a base indexing for wrong counts', () => {
    let indexes = NameIndex.when(NameOrder.FIRST_NAME, 0);
    expect(indexes.firstName).toEqual(0);
    expect(indexes.lastName).toEqual(1);
    expect(indexes.prefix).toEqual(-1);
    expect(indexes.middleName).toEqual(-1);
    expect(indexes.suffix).toEqual(-1);

    indexes = NameIndex.when(NameOrder.LAST_NAME, 0);
    expect(indexes.firstName).toEqual(0);
    expect(indexes.lastName).toEqual(1);
    expect(indexes.prefix).toEqual(-1);
    expect(indexes.middleName).toEqual(-1);
    expect(indexes.suffix).toEqual(-1);

    expect(NameIndex.min).toEqual(2);
    expect(NameIndex.max).toEqual(5);
  });

  test('.capitalize() capitalizes a string accordingly', () => {
    expect(capitalize('')).toEqual('');
    expect(capitalize('stRiNg')).toEqual('String');
    expect(capitalize('stRiNg', CapsRange.INITIAL)).toEqual('String');
    expect(capitalize('StRiNg', CapsRange.ALL)).toEqual('STRING');
    expect(capitalize('StRiNg', CapsRange.NONE)).toEqual('StRiNg');
  });

  test('.decapitalize() de-capitalizes a string accordingly', () => {
    expect(decapitalize('')).toEqual('');
    expect(decapitalize('StRiNg')).toEqual('stRiNg');
    expect(decapitalize('StRiNg', CapsRange.INITIAL)).toEqual('stRiNg');
    expect(decapitalize('StRiNg', CapsRange.ALL)).toEqual('string');
    expect(decapitalize('StRiNg', CapsRange.NONE)).toEqual('StRiNg');
  });

  test('.toggleCase() toggles a string accordingly', () => {
    expect(toggleCase('toggle')).toEqual('TOGGLE');
    expect(toggleCase('toGGlE')).toEqual('TOggLe');
  });

  test('.isStringArray() checks if an object is of type string[]', () => {
    expect(isStringArray(['1', '2', '3'])).toBe(true);
    expect(isStringArray(['1', '2', 3])).toBe(false);
    expect(isStringArray([1, 2, 3])).toBe(false);
    expect(isStringArray([])).toBe(false);
  });

  test('.isNameArray() checks if an object is of type Name[]', () => {
    expect(isNameArray([Name.last('Doe'), Name.last('Yen')])).toBe(true);
    expect(isNameArray([Name.last('Doe'), {}])).toBe(false);
    expect(isNameArray([])).toBe(false);
  });
});

describe('Separator', () => {
  test('should have some explicit tokens', () => {
    const tokens = [',', ':', '"', '', '-', '.', ';', "'", ' ', '_'];
    expect(Separator.tokens.length).toEqual(tokens.length);
    expect(Separator.tokens).toEqual(tokens);

    expect(Separator.PERIOD.token).toEqual('.');
    expect(Separator.PERIOD.name).toEqual('period');
    expect(Separator.PERIOD.toString()).toEqual('Separator.period');
  });
});
