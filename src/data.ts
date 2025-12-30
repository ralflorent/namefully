import { NameBuilder } from './builder.js';
import { Name, FirstName, LastName } from './name.js';
import { type Namefully, NameOptions } from './namefully.js';
import { InputError, NameError, UnknownError } from './error.js';

/** Serialized representation of a Namefully instance. */
export interface SerializedName {
  /** The name data (with its hierarchy intact). */
  names: {
    prefix?: string;
    firstName: string | { value: string; more?: string[] };
    middleName?: string[];
    lastName: string | { father: string; mother?: string };
    suffix?: string;
  };
  /** The configuration data. */
  config: {
    name: string;
    orderedBy: string;
    separator: string;
    title: string;
    ending: boolean;
    bypass: boolean;
    surname: string;
  };
}

/**
 * Deserializes a JSON object into a Namefully instance.
 *
 * This is the inverse operation of `serialize()`, reconstructing a Namefully
 * instance from a previously serialized JSON object, preserving the name hierarchy.
 *
 * @param {SerializedName | string} data the serialized Namefully data (from `serialize()`
 * or compatible format).
 * @returns a new Namefully instance.
 *
 * @throws {NameError} if the data cannot be parsed or is invalid.
 */
export function deserialize(data: SerializedName | string): Namefully {
  try {
    const parsed: SerializedName = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsed || typeof parsed !== 'object') {
      throw new InputError({
        source: String(data),
        message: 'invalid serialized data; must be an object or a string',
      });
    }

    const { names, config } = parsed;
    const { firstName: fn, lastName: ln, middleName: mn, prefix: px, suffix: sx } = names;
    const builder = NameBuilder.of();

    if (px) builder.add(Name.prefix(px));
    if (sx) builder.add(Name.suffix(sx));
    if (mn) builder.add(...mn.map((n) => Name.middle(n)));

    builder.add(typeof fn === 'string' ? Name.first(fn) : new FirstName(fn.value, ...(fn.more ?? [])));
    builder.add(typeof ln === 'string' ? Name.last(ln) : new LastName(ln.father, ln.mother));

    return builder.build(config as unknown as NameOptions);
  } catch (error) {
    if (error instanceof NameError) throw error;

    throw new UnknownError({
      source: String(data),
      message: 'could not deserialize data',
      origin: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
