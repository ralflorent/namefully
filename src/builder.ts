import { Name } from './name';
import { Namefully } from './namefully';
import { Config } from './config';
import { ArrayNameValidator } from './validator';

type VoidCallback = () => void;
type Callback<Type, Return> = (value: Type) => Return;

/**
 * A generic builder class that provides common functionality for building instances.
 */
abstract class Builder<T, I> {
  protected queue: T[] = [];
  protected instance: I | null = null;

  constructor(
    protected readonly prebuild?: VoidCallback,
    protected readonly postbuild?: Callback<I, void>,
    protected readonly preclear?: Callback<I, void>,
    protected readonly postclear?: VoidCallback,
  ) {}

  /** Gets the current size of the builder. */
  get size(): number {
    return this.queue.length;
  }

  /** Removes and returns the first element of the queue. */
  removeFirst(): T | undefined {
    return this.queue.length > 0 ? this.queue.shift() : undefined;
  }

  /** Removes and returns the last element of the queue. */
  removeLast(): T | undefined {
    return this.queue.length > 0 ? this.queue.pop() : undefined;
  }

  /** Adds a value at the beginning of the queue. */
  addFirst(value: T): void {
    this.queue.unshift(value);
  }

  /** Adds a value at the end of the queue. */
  addLast(value: T): void {
    this.queue.push(value);
  }

  /** Adds a value at the end of the queue. */
  add(...values: T[]): void {
    this.queue.push(...values);
  }

  /** Removes a single instance of a value from the queue. */
  remove(value: T): boolean {
    const index = this.queue.indexOf(value);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /** Removes all elements matched by the test function from the queue. */
  removeWhere(callback: Callback<T, boolean>): void {
    this.queue = this.queue.filter((item) => !callback(item));
  }

  /** Removes all elements not matched by the test function from the queue. */
  retainWhere(callback: Callback<T, boolean>): void {
    this.queue = this.queue.filter(callback);
  }

  /** Removes all elements in the queue. */
  clear(): void {
    if (this.instance !== null) this.preclear?.(this.instance);

    this.queue = [];
    this.postclear?.();
    this.instance = null;
  }

  /** Builds the desired instance with optional parameters. */
  abstract build(options?: Partial<Config>): I;
}

/**
 * An on-the-fly name builder.
 *
 * The builder uses a lazy-building method while capturing all necessary Names
 * to finally construct a complete Namefully instance.
 *
 * @example
 * const builder = NameBuilder.of([Name.first('Thomas'), Name.last('Edison')]);
 * builder.add(Name.middle('Alva'));
 * console.log(builder.build()); // 'Thomas Alva Edison'
 */
export class NameBuilder extends Builder<Name, Namefully> {
  private constructor(
    names: Name[],
    prebuild?: VoidCallback,
    postbuild?: Callback<Namefully, void>,
    preclear?: Callback<Namefully, void>,
    postclear?: VoidCallback,
  ) {
    super(prebuild, postbuild, preclear, postclear);
    this.add(...names);
  }

  /** Creates a base builder from one Name to construct Namefully later. */
  static create(name?: Name): NameBuilder {
    return new NameBuilder(name ? [name] : []);
  }

  /** Creates a base builder from many Names to construct Namefully later. */
  static of(...initialNames: Name[]): NameBuilder {
    return new NameBuilder(initialNames);
  }

  /** Creates a base builder from many Names with lifecycle hooks. */
  static use({
    names,
    prebuild,
    postbuild,
    preclear,
    postclear,
  }: {
    names?: Name[];
    prebuild?: VoidCallback;
    postbuild?: Callback<Namefully, void>;
    preclear?: Callback<Namefully, void>;
    postclear?: VoidCallback;
  }): NameBuilder {
    return new NameBuilder(names ?? [], prebuild, postbuild, preclear, postclear);
  }

  /**
   * Builds an instance of Namefully from the previously collected names.
   *
   * Regardless of how the names are added, both first and last names must exist
   * to complete a fine build. Otherwise, it throws a NameException.
   */
  build(config?: Partial<Config>): Namefully {
    this.prebuild?.();

    const names = [...this.queue];
    ArrayNameValidator.create().validate(names);

    this.instance = new Namefully(names, config);
    this.postbuild?.(this.instance);

    return this.instance;
  }
}
