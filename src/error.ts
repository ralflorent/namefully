import { Name } from './name'
import { Nullable } from './types'
import { isNameArray, isStringArray } from './utils'

type NameSource = Nullable<string | string[] | Name[]>

interface ErrorMessage {
    source: NameSource
    message?: string
}

/**
 * The error types supported by `Namefully`.
 */
export enum NameErrorType {
    /**
     * Thrown when a name entry/argument is incorrect.
     *
     * For example, a name should have a minimum of 2 characters, so an empty
     * string or a string of one character would cause this kind of error.
     */
    INPUT,

    /**
     * Thrown when the name components do not match the validation rules if the
     * `Config.bypass` is not flagged up. This bypass option skips the validation
     * rules.
     *
     * See also: `ValidationError`
     */
    VALIDATION,

    /**
     * Thrown by not allowed operations such as in NameBuilder or name formatting.
     *
     * See also: `NotAllowedError`, `Namefully.format`.
     */
    NOT_ALLOWED,

    /**
     * Thrown by any other unknown sources or unexpected situation.
     */
    UNKNOWN,
}

/**
 * Base class for all name-related errors.
 *
 * A custom error is intended to convey information to the user about a failure,
 * so that it can be addressed programmatically.
 *
 * A name handling failure is not considered a native error that should cause a
 * program failure. Au contraire, it is expected that a programmer using this utility
 * would consider validating a name using its own business rules. That is not
 * this utility's job to guess those rules. So, the predefined `ValidationRules`
 * obey some common validation techniques when it comes to sanitizing a person
 * name. For this reason, the [Config.bypass] is set to `true` by default,
 * indicating that those predefined rules should be skipped for the sake of the
 * program.
 *
 * A programmer may leverage `Parser` to indicate business-tailored rules if he
 * or she wants this utility to perform those safety checks behind the scenes.
 *
 * A name error intends to provide useful information about what causes the error
 * and let the user take initiative on what happens next to the given name:
 * reconstructing it or skipping it.
 */
export class NameError extends Error {
    /**
     * Creates an error with a message describing the issue for a name source.
     * @param source name input that caused the error
     * @param message a message describing the failure.
     * @param type of `NameErrorType`
     */
    constructor(readonly source: NameSource, message?: string, readonly type: NameErrorType = NameErrorType.UNKNOWN) {
        super(message)
        this.name = 'NameError'
    }

    /**
     * The actual source input which caused the error.
     */
    get sourceAsString(): string {
        let input = ''
        if (!this.source) input = '<undefined>'
        if (typeof this.source === 'string') input = this.source
        if (isNameArray(this.source)) input = (this.source as Name[]).map((n) => n.toString()).join(' ')
        if (isStringArray(this.source)) input = (this.source as string[]).join(' ')
        return input
    }

    /**
     * Whether a message describing the failure exists.
     */
    get hasMessage(): boolean {
        return this.message && this.message.trim().length > 0
    }

    /**
     * Returns a string representation of the error.
     */
    toString(): string {
        let report = `${this.name} (${this.sourceAsString})`
        if (this.hasMessage) report = `${report}: ${this.message}`
        return report
    }
}

/**
 * An error thrown when a name source input is incorrect.
 *
 * A `Name` is a name for this utility under certain criteria (i.e., 2+ chars),
 * hence, a wrong input will cause this kind of error. Another common reason
 * may be a wrong key in a Json name parsing mechanism.
 *
 * Keep in mind that this error is different from a `ValidationError`.
 */
export class InputError extends NameError {
    /**
     * Creates a new `InputError` with an optional error `message`.
     *
     * The name source is by nature a string content, maybe wrapped up in a different
     * type. This string value may be extracted to form the following output:
     *   "InputError (stringName)",
     *   "InputError (stringName): message".
     */
    constructor(error: ErrorMessage) {
        super(error.source, error.message, NameErrorType.INPUT)
        this.name = 'InputError'
    }
}

/**
 * An error thrown to indicate that a name fails the validation rules.
 */
export class ValidationError extends NameError {
    /**
     * Name of the invalid `nameType` if available.
     */
    readonly nameType: string

    /**
     * Creates error containing the invalid `nameType` and a `message` that
     * briefly describes the problem if provided.
     *
     * For example, a validation error can be interpreted as:
     *     "ValidationError (nameType='stringName')",
     *     "ValidationError (nameType='stringName'): message"
     */
    constructor(error: ErrorMessage & { nameType: string }) {
        super(error.source, error.message, NameErrorType.VALIDATION)
        this.nameType = error.nameType
        this.name = 'ValidationError'
    }

    toString(): string {
        let report = `${this.name} (${this.nameType}='${this.sourceAsString}')`
        if (this.hasMessage) report = `${report}: ${this.message}`
        return report
    }
}

/**
 * Thrown by not allowed operations such as in name formatting.
 *
 * For example, this will occur when trying to format a name accordingly using
 * a non-supported key.
 */
export class NotAllowedError extends NameError {
    /**
     * The revoked operation name.
     */
    readonly operation: string

    /**
     * Creates a new `NotAllowedError` with an optional error `message` and the
     * `operation` name.
     *
     * For example, an error of this kind can be interpreted as:
     *     "NotAllowedError (stringName)",
     *     "NotAllowedError (stringName) - operationName",
     *     "NotAllowedError (stringName) - operationName: message"
     */
    constructor(error: ErrorMessage & { operation: string }) {
        super(error.source, error.message, NameErrorType.NOT_ALLOWED)
        this.operation = error.operation
        this.name = 'NotAllowedError'
    }

    toString(): string {
        let report = `${this.name} (${this.sourceAsString})`
        if (this.operation && this.operation.trim().length > 0) report = `${report} - ${this.operation}`
        if (this.hasMessage) report = `${report}: ${this.message}`
        return report
    }
}

/**
 * A fallback error thrown by any unknown sources or unexpected failure that are
 * not of `NameError`.
 *
 * In this particular case, an `origin` remains useful as it provides details
 * on the sources and the true nature of the unexpected error.
 * At this point, deciding whether to exit the program or not depends on the
 * programmer.
 */
export class UnknownError extends NameError {
    /**
     * The possible unknown error, with trace revealing its source and reason.
     */
    readonly origin?: Error

    /**
     * Creates a new `UnknownError` with an optional error `message`.
     * Optionally, the original error revealing the true nature of the failure.
     */
    constructor(error: ErrorMessage & { error?: Error }) {
        super(error.source, error.message, NameErrorType.UNKNOWN)
        this.origin = error.error
        this.name = 'UnknownError'
    }

    toString(): string {
        let report = super.toString()
        if (this.origin) report += `\n${this.origin.toString()}`
        return report
    }
}
