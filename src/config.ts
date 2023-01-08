import { NameOrder, Separator, Title, Surname } from './types'

const defaultName = 'default'
const copyAlias = '_copy'

/**
 * The Configuration to use across the other components.
 *
 * The multiton pattern is used to handle configurations across the `namefully`
 * setup. This adds consistency when building other components such as `FirstName`,
 * `LastName`, or `Name` of distinct types that may be of particular shapes.
 *
 * For example, a person's `FullName` may appear by:
 * - NameOrder.FIRST_NAME: `Jon Snow` or
 * - NameOrder.LAST_NAME: `Snow Jon`.
 *
 * `Config` makes it easy to set up a specific configuration for `Namefully`
 * and reuse it through other instances or components along the way. If a new
 * `Config` is needed, a named configuration may be created. It is actually
 * advised to use named `Config.create(name)` instead as it may help mitigate issues
 * and avoid confusion and ambiguity in the future. Plus, a named configuration
 * explains its purpose.
 *
 * ```ts
 * const defaultConfig = Config.create();
 * const mergedConfig = Config.merge({ name: 'other', title: Title.US });
 * const copyConfig = mergedConfig.copyWith({ ending: true });
 * ```
 *
 * Additionally, a configuration may be merged with or copied from an existing
 * configuration, prioritizing the new one's values, as shown in the example
 * above.
 */
export class Config {
    /**
     * Cache for multiple instances.
     */
    private static cache = new Map<string, Config>()

    /**
     * The order of appearance of a full name.
     */
    get orderedBy(): NameOrder {
        return this._orderedBy
    }

    /**
     * The token used to indicate how to split string values.
     */
    get separator(): Separator {
        return this._separator
    }

    /**
     * The abbreviation type to indicate whether or not to add period to a prefix
     * using the American or British way.
     */
    get title(): Title {
        return this._title
    }

    /**
     * The option indicating if an ending suffix is used in a formal way.
     */
    get ending(): boolean {
        return this._ending
    }

    /**
     * A bypass of the validation rules with this option. This option is ideal
     * to avoid checking their validity.
     */
    get bypass(): boolean {
        return this._bypass
    }

    /**
     * An option indicating how to format a surname.
     *
     * The supported formats are:
     * - `FATHER` name only
     * - `MOTHER` name only
     * - `HYPHENATED`, joining both father and mother names with a hyphen
     * - `ALL`, joining both father and mother names with a space.
     *
     * Note that this option can be set when creating a `LastName`. As this can
     * become ambiguous at the time of handling it, the value set in this is
     * prioritized and viewed as the source of truth for future considerations.
     */
    get surname(): Surname {
        return this._surname
    }

    /**
     * The name of the cached configuration.
     */
    get name(): string {
        return this._name
    }

    private constructor(
        private _name: string,
        private _orderedBy = NameOrder.FIRST_NAME,
        private _separator = Separator.SPACE,
        private _title = Title.UK,
        private _ending = false,
        private _bypass = true,
        private _surname = Surname.FATHER,
    ) {}

    /**
     * Returns a named configuration with default values.
     * @param name describing its purpose.
     */
    static create(name = defaultName): Config {
        if (!Config.cache.has(name)) {
            Config.cache.set(name, new this(name))
        }
        return Config.cache.get(name)
    }

    /**
     * Returns a combined version of the existing values of the default configuration
     * and the provided optional values of another configuration.
     * @param other partial config to be combined with.
     */
    static merge(other?: Partial<Config>): Config {
        if (!other) {
            return Config.create()
        } else {
            const config = Config.create(other.name)
            config._orderedBy = other.orderedBy ?? config.orderedBy
            config._separator = other.separator ?? config.separator
            config._title = other.title ?? config.title
            config._ending = other.ending ?? config.ending
            config._bypass = other.bypass ?? config.bypass
            config._surname = other.surname ?? config.surname
            return config
        }
    }

    /**
     * Returns a copy of this configuration merged with the provided values.
     *
     * The word `_copy` is added to the existing config's name to create the new
     * config's name if the name already exists for previous configurations. This
     * is useful to maintain the uniqueness of each configuration. For example,
     * if the new copy is made from the default configuration, this new copy will
     * be named `default_copy`.
     */
    copyWith(options: Partial<Config> = {}): Config {
        const { name, orderedBy, separator, title, ending, bypass, surname } = options
        const config = Config.create(this.genNewName(name ?? this.name + copyAlias))
        config._orderedBy = orderedBy ?? this.orderedBy
        config._separator = separator ?? this.separator
        config._title = title ?? this.title
        config._ending = ending ?? this.ending
        config._bypass = bypass ?? this.bypass
        config._surname = surname ?? this.surname
        return config
    }

    /**
     * Makes an exact copy of the current configuration.
     */
    clone(): Config {
        return this.copyWith()
    }

    /**
     * Resets the configuration by setting it back to its default values.
     */
    reset(): void {
        this._orderedBy = NameOrder.FIRST_NAME
        this._separator = Separator.SPACE
        this._title = Title.UK
        this._ending = false
        this._bypass = true
        this._surname = Surname.FATHER
        Config.cache.set(this.name, this)
    }

    /**
     * Alters the name order between the first and last name, and rearrange the
     * order of appearance of a name set.
     */
    updateOrder(order: NameOrder): void {
        if (order && order !== this._orderedBy) {
            Config.cache.get(this.name)._orderedBy = order
        }
    }

    /**
     * Generates a unique new name.
     */
    private genNewName(name: string): string {
        return name === this.name || Config.cache.has(name) ? this.genNewName(name + copyAlias) : name
    }
}
