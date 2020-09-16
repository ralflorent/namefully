/**
 * All the enums are listed here
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/**
 * Enum `Namon` contains the finite set of a representative piece of a name
 * @readonly
 * @enum {string}
 * The word `Namon` is the singular form used to refer to a chunk|part|piece of
 * a name. And the plural form is `Nama`. (Same idea as in criterion/criteria)
 */
export enum Namon {
    PREFIX = 'prefix',
    LAST_NAME = 'lastname',
    MIDDLE_NAME = 'middlename',
    FIRST_NAME = 'firstname',
    SUFFIX = 'suffix',
}

/**
 * Enum `Alphabet` for the list of writing systems
 * @readonly
 * @enum {string}
 */
export enum Alphabet {
    LATIN = 'Latin',
    CYRILLIC = 'Cyrillic',
    GREEK = 'Greek',
    ARMENIAN = 'Armenian',
    GEORGIAN = 'Georgian',
    HANGUL = 'Hangul',
}

/**
 * Enum for the prefix values
 * @readonly
 * @enum {string}
 * American and Canadian English follow slightly different rules for abbreviated
 * titles than British and Australian English. In North American English, titles
 * before a name require a period: `Mr., Mrs., Ms., Dr.` In British and Australian
 * English, no full stops are used in these abbreviations.
 */
export enum Prefix {
    FIRT_LIEUTENANT = '1st Lt',
    ADMIRAL = 'Adm',
    ATTORNEY = 'Atty',
    BROTHER = 'Brother', // Religious
    CAPTAIN = 'Capt',
    CHIEF = 'Chief',
    COMMANDER = 'Cmdr',
    COLONEL = 'Col',
    UNI_DEAN = 'Dean',
    DOCTOR = 'Dr',
    ELDER = 'Elder', // Religious
    FATHER = 'Father', // Religious
    GENERAL = 'Gen',
    HONORABLE = 'Hon',
    LIEUTENANT_COLONEL = 'Lt Col',
    MAJOR = 'Maj',
    MASTER_SERGEANT = 'MSgt',
    MISTER = 'Mr',
    MARRIED_WOMAN = 'Mrs',
    SINGLE_WOMAN = 'Ms',
    PRINCE = 'Prince',
    PROFESSOR = 'Prof',
    RABBI = 'Rabbi', // Religious
    REVEREND = 'Rev', // Religious
    SISTER = 'Sister'
}

/**
 * Enum for the suffix values
 * @readonly
 * @enum {string}
 */
export enum Suffix {
    THE_SECOND = 'II',
    THE_THIRD = 'III',
    THE_FOURTH = 'IV',
    CERT_PUB_ACCOUNTANT = 'CPA',
    DOCTOR_DENTAL_MED = 'DDS',
    ESQUIRE = 'Esq',
    JURIST_DOCTOR = 'JD',
    JUNIOR = 'Jr',
    DOCTOR_OF_LAWS = 'LLD',
    DOCTORATE = 'PhD',
    RETIRED_ARMED_FORCES = 'Ret',
    REGISTERED_NURSE = 'RN',
    SENIOR = 'Sr',
    DOCTOR_OF_OSTEO = 'DO'
}

/**
 * Enum for the separator values representing some of the ASCII characters
 * @readonly
 * @enum {string}
 */
export enum Separator {
    COLON = ':',
    COMMA = ',',
    EMPTY = '',
    HYPHEN = '-',
    PERIOD = '.',
    SPACE = ' ',
    SINGLE_QUOTE = `'`,
    DOUBLE_QUOTE = '"',
    UNDERSCORE = '_',
}
