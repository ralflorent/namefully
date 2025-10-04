import { NameOrder, CapsRange } from './types.js';
import { MIN_NUMBER_OF_NAME_PARTS, MAX_NUMBER_OF_NAME_PARTS } from './constants.js';

/**
 * A set of values to handle specific positions for list of names.
 *
 * As for list of names, this helps to follow a specific order based on the
 * count of elements. It is expected that the list has to be between two and
 * five elements. Also, the order of appearance set in the configuration
 * influences how the parsing is carried out.
 *
 * Ordered by first name, the parser works as follows:
 * - 2 elements: firstName lastName
 * - 3 elements: firstName middleName lastName
 * - 4 elements: prefix firstName middleName lastName
 * - 5 elements: prefix firstName middleName lastName suffix
 *
 * Ordered by last name, the parser works as follows:
 * - 2 elements: lastName firstName
 * - 3 elements: lastName firstName middleName
 * - 4 elements: prefix lastName firstName middleName
 * - 5 elements: prefix lastName firstName middleName suffix
 *
 * For example, `Jane Smith` (ordered by first name) is expected to be indexed:
 * `['Jane', 'Smith']`.
 */
export class NameIndex {
  /** The minimum number of parts in a list of names. */
  static get min(): number {
    return MIN_NUMBER_OF_NAME_PARTS;
  }

  /** The maximum number of parts in a list of names. */
  static get max(): number {
    return MAX_NUMBER_OF_NAME_PARTS;
  }

  protected constructor(
    readonly prefix: number,
    readonly firstName: number,
    readonly middleName: number,
    readonly lastName: number,
    readonly suffix: number,
  ) {}

  /** The default or base indexing: firstName lastName. */
  static base(): NameIndex {
    return new NameIndex(-1, 0, -1, 1, -1);
  }

  /**
   * Gets the name index for a list of names based on the `count` of elements
   * and their `order` of appearance.
   */
  static when(order: NameOrder, count = 2): NameIndex {
    if (order === NameOrder.FIRST_NAME) {
      switch (count) {
        case 2: // first name + last name
          return new NameIndex(-1, 0, -1, 1, -1);
        case 3: // first name + middle name + last name
          return new NameIndex(-1, 0, 1, 2, -1);
        case 4: // prefix + first name + middle name + last name
          return new NameIndex(0, 1, 2, 3, -1);
        case 5: // prefix + first name + middle name + last name + suffix
          return new NameIndex(0, 1, 2, 3, 4);
        default:
          return NameIndex.base();
      }
    } else {
      switch (count) {
        case 2: // last name + first name
          return new NameIndex(-1, 1, -1, 0, -1);
        case 3: // last name + first name + middle name
          return new NameIndex(-1, 1, 2, 0, -1);
        case 4: // prefix + last name + first name + middle name
          return new NameIndex(0, 2, 3, 1, -1);
        case 5: // prefix + last name + first name + middle name + suffix
          return new NameIndex(0, 2, 3, 1, 4);
        default:
          return NameIndex.base();
      }
    }
  }

  static only({ prefix = -1, firstName, middleName = -1, lastName, suffix = -1 }: Record<string, number>): NameIndex {
    return new NameIndex(prefix, firstName, middleName, lastName, suffix);
  }

  toJson(): Record<string, number> {
    return {
      prefix: this.prefix,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      suffix: this.suffix,
    };
  }
  json = this.toJson;
}

/** Capitalizes a string via a `CapsRange` option. */
export function capitalize(str: string, range: CapsRange = CapsRange.INITIAL): string {
  if (!str || range === CapsRange.NONE) return str;
  const initial = str[0].toUpperCase();
  const rest = str.slice(1).toLowerCase();
  return range === CapsRange.INITIAL ? initial.concat(rest) : str.toUpperCase();
}

/** Decapitalizes a string via a `CapsRange` option. */
export function decapitalize(str: string, range: CapsRange = CapsRange.INITIAL): string {
  if (!str || range === CapsRange.NONE) return str;
  const initial = str[0].toLowerCase();
  const rest = str.slice(1);
  return range === CapsRange.INITIAL ? initial.concat(rest) : str.toLowerCase();
}

/** Toggles a string representation. */
export function toggleCase(str: string): string {
  return str
    .split('')
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join('');
}

export function isStringArray(value?: unknown): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((e) => typeof e === 'string');
}
