import { IConfig } from './config.js';
import { InputError } from './error.js';
import { capitalize, decapitalize } from './utils.js';
import { CapsRange, Namon, Surname, TypeMatcher } from './types.js';

/** Representation of a string type name with some extra capabilities. */
export class Name {
  #namon!: string;
  protected initial!: string;
  protected capsRange: CapsRange;

  /**
   * Creates augmented names by adding extra functionality to a string name.
   * @param {Namon} type must be indicated to categorize the name so it can be
   * treated accordingly.
   * @param {CapsRange} capsRange determines how the name should be capitalized initially.
   */
  constructor(
    value: string,
    readonly type: Namon,
    capsRange?: CapsRange,
  ) {
    this.capsRange = capsRange ?? CapsRange.INITIAL;
    this.value = value;
    if (capsRange) this.caps(capsRange);
  }

  set value(newValue: string) {
    this.validate(newValue);
    this.#namon = newValue;
    this.initial = newValue[0];
  }

  /** The piece of string treated as a name. */
  get value(): string {
    return this.#namon;
  }

  /** The length of the name. */
  get length(): number {
    return this.#namon.length;
  }

  /** Whether the name is a prefix. */
  get isPrefix(): boolean {
    return this.type === Namon.PREFIX;
  }

  /** Whether the name is a first name. */
  get isFirstName(): boolean {
    return this.type === Namon.FIRST_NAME;
  }

  /** Whether the name is a middle name. */
  get isMiddleName(): boolean {
    return this.type === Namon.MIDDLE_NAME;
  }

  /** Whether the name is a last name. */
  get isLastName(): boolean {
    return this.type === Namon.LAST_NAME;
  }

  /** Whether the name is a suffix. */
  get isSuffix(): boolean {
    return this.type === Namon.SUFFIX;
  }

  /** Creates a prefix. */
  static prefix(value: string): Name {
    return new Name(value, Namon.PREFIX);
  }

  /** Creates a first name. */
  static first(value: string): Name {
    return new Name(value, Namon.FIRST_NAME);
  }

  /** Creates a middle name. */
  static middle(value: string): Name {
    return new Name(value, Namon.MIDDLE_NAME);
  }

  /** Creates a last name. */
  static last(value: string): Name {
    return new Name(value, Namon.LAST_NAME);
  }

  /** Creates a suffix. */
  static suffix(value: string): Name {
    return new Name(value, Namon.SUFFIX);
  }

  /** Gets the initials (first character) of this name. */
  initials(): string[] {
    return [this.initial];
  }

  /** String representation of this object. */
  toString(): string {
    return this.#namon;
  }

  /** Returns true if the other is equal to this name. */
  equal(other: Name | unknown): boolean {
    return other instanceof Name && other.value === this.value && other.type === this.type;
  }

  /** Capitalizes the name. */
  caps(range?: CapsRange): Name {
    this.value = capitalize(this.#namon, range ?? this.capsRange);
    return this;
  }

  /** De-capitalizes the name. */
  decaps(range?: CapsRange): Name {
    this.value = decapitalize(this.#namon, range ?? this.capsRange);
    return this;
  }

  protected validate(name?: string): void {
    if (typeof name === 'string' && name.trim().length < 1) {
      throw new InputError({ source: name, message: 'must be 1+ characters' });
    }
  }
}

/** Representation of a first name with some extra functionality. */
export class FirstName extends Name {
  #more: string[];

  /**
   * Creates an extended version of `Name` and flags it as a first name `type`.
   *
   * Some may consider `more` additional name parts of a given name as their
   * first names, but not as their middle names. Though it may mean the same,
   * `more` provides the freedom to do it as it pleases.
   */
  constructor(value: string, ...more: string[]) {
    super(value, Namon.FIRST_NAME);
    more.forEach(this.validate);
    this.#more = more;
  }

  /** Determines whether a first name has `more` name parts. */
  get hasMore(): boolean {
    return this.#more.length > 0;
  }

  get length(): number {
    return super.length + (this.hasMore ? this.#more.reduce((acc, n) => acc + n).length : 0);
  }

  /** Returns a combined version of the `value` and `more` if any. */
  get asNames(): Name[] {
    const names: Name[] = [Name.first(this.value)];
    if (this.hasMore) names.push(...this.#more.map(Name.first));
    return names;
  }

  /** The additional name parts of the first name. */
  get more(): string[] {
    return this.#more;
  }

  toString(withMore = false): string {
    return withMore && this.hasMore ? `${this.value} ${this.#more.join(' ')}`.trim() : this.value;
  }

  initials(withMore = false): string[] {
    const inits: string[] = [this.initial];
    if (withMore && this.hasMore) inits.push(...this.#more.map((n) => n[0]));
    return inits;
  }

  caps(range?: CapsRange): FirstName {
    range = range || this.capsRange;
    this.value = capitalize(this.value, range);
    if (this.hasMore) this.#more = this.#more.map((n) => capitalize(n, range));
    return this;
  }

  decaps(range?: CapsRange): FirstName {
    range = range || this.capsRange;
    this.value = decapitalize(this.value, range);
    if (this.hasMore) this.#more = this.#more.map((n) => decapitalize(n, range));
    return this;
  }

  /** Makes a copy of the current name. */
  copyWith(values?: { first?: string; more?: string[] }): FirstName {
    return new FirstName(values?.first ?? this.value, ...(values?.more ?? this.#more));
  }
}

/** Representation of a last name with some extra functionality. */
export class LastName extends Name {
  #mother?: string;
  format!: Surname;

  /**
   * Creates an extended version of `Name` and flags it as a last name `type`.
   *
   * Some people may keep their @param mother's surname and want to keep a clear cut
   * from their @param father's surname. However, there are no clear rules about it.
   */
  constructor(father: string, mother?: string, format?: IConfig['surname']) {
    super(father, Namon.LAST_NAME);
    this.validate(mother);
    this.#mother = mother;
    this.format = TypeMatcher.surname(format ?? '', Surname.FATHER);
  }

  /** The surname inherited from the father side. */
  get father(): string {
    return this.value;
  }

  /** The surname inherited from the mother side. */
  get mother(): string | undefined {
    return this.#mother;
  }

  /** Returns `true` if the mother's surname is defined. */
  get hasMother(): boolean {
    return !!this.#mother;
  }

  get length(): number {
    return super.length + (this.#mother?.length ?? 0);
  }

  /** Returns a combined version of the `father` and `mother` if any. */
  get asNames(): Name[] {
    const names: Name[] = [Name.last(this.value)];
    if (this.#mother) names.push(Name.last(this.#mother));
    return names;
  }

  toString(format?: Surname): string {
    format = format ?? this.format;
    switch (format) {
      case Surname.FATHER:
        return this.value;
      case Surname.MOTHER:
        return this.mother ?? '';
      case Surname.HYPHENATED:
        return this.hasMother ? `${this.value}-${this.#mother}` : this.value;
      case Surname.ALL:
        return this.hasMother ? `${this.value} ${this.#mother}` : this.value;
    }
  }

  initials(format?: IConfig['surname']): string[] {
    const inits: string[] = [];
    format = TypeMatcher.surname(format ?? this.format);
    switch (format) {
      case Surname.HYPHENATED:
      case Surname.ALL:
        inits.push(this.initial);
        if (this.#mother) inits.push(this.#mother[0]);
        break;
      case Surname.MOTHER:
        if (this.#mother) inits.push(this.#mother[0]);
        break;
      default:
        inits.push(this.initial);
    }
    return inits;
  }

  caps(range?: CapsRange): LastName {
    range ??= this.capsRange;
    this.value = capitalize(this.value, range);
    if (this.hasMother) this.#mother = capitalize(this.#mother!, range);
    return this;
  }

  decaps(range?: CapsRange): LastName {
    range ??= this.capsRange;
    this.value = decapitalize(this.value, range);
    if (this.hasMother) this.#mother = decapitalize(this.#mother!, range);
    return this;
  }

  /** Makes a copy of the current name. */
  copyWith(values?: { father?: string; mother?: string; format?: IConfig['surname'] }): LastName {
    return new LastName(values?.father ?? this.value, values?.mother ?? this.mother, values?.format ?? this.format);
  }
}

export function isNameArray(value?: unknown): value is Name[] {
  return Array.isArray(value) && value.length > 0 && value.every((e) => e instanceof Name);
}

/** JSON signature for `FullName` data. */
export interface JsonName {
  prefix?: string;
  firstName: string;
  middleName?: string[];
  lastName: string;
  suffix?: string;
}
