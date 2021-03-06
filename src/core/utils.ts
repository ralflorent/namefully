/**
 * Utils for the core functionalities of `Namefully`
 *
 * Created on March 16, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { NameIndex, NameOrder, Separator, NameType } from '../models';
import {
    NAME_INDEX,
    RESTRICTED_CHARS,
    PASSWORD_MAPPER,
    FIRST_LAST_NAME_INDEX,
    LAST_FIRST_NAME_INDEX,
    FIRST_MIDDLE_LAST_NAME_INDEX,
    LAST_FIRST_MIDDLE_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_LAST_FIRST_MIDDLE_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX,
    PREFIX_LAST_FIRST_MIDDLE_SUFFIX_NAME_INDEX,
} from '../core';

/**
 * Capitalizes a string
 * @param str string value
 * @param {'initial' | 'all'} [option] how to capitalize it
 */
export function capitalize(str: string, option: 'initial' | 'all' = 'initial'): string {
    if (!str) return '';
    const initial = str[0].toUpperCase();
    const rest = str.slice(1).toLowerCase();
    return option === 'initial' ? initial.concat(rest) : str.toUpperCase();
}

/**
 * De-capitalizes a string
 * @param str string value
 * @param {'initial' | 'all'} [option] how to decapitalize it
 */
export function decapitalize(str: string, option: 'initial' | 'all' = 'initial'): string {
    if (!str) return '';
    const initial = str[0].toLowerCase();
    const rest = str.slice(1);
    return option === 'initial' ? initial.concat(rest) : str.toLowerCase();
}

/**
 * Toggles a string representation
 * @param str string value to toggle
 */
export function toggleCase(str: string): string {
    const chars = [];
    for (const c of str) {
        if (c === c.toUpperCase()) {
            chars.push(c.toLowerCase())
        } else {
            chars.push(c.toUpperCase())
        }
    }
    return chars.join(Separator.EMPTY);
}

/**
 * Reorganizes the existing global indexes for array of name parts
 * @param orderedBy by first or last name
 * @param argLength length of the provided array
 * @param nameIndex global preset of indexing
 */
export function organizeNameIndex(
    orderedBy: NameOrder,
    argLength: number,
    nameIndex: NameIndex = NAME_INDEX
): NameIndex {
    const out: NameIndex = { ...nameIndex };

    if (orderedBy === 'firstname') {
        switch(argLength) {
            case FIRST_LAST_NAME_INDEX: // first name + last name
                out.firstname = 0;
                out.lastname = 1;
                break;
            case FIRST_MIDDLE_LAST_NAME_INDEX: // first name + middle name + last name
                out.firstname = 0;
                out.middlename = 1;
                out.lastname = 2;
                break;
            case PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX: // prefix + first name + middle name + last name
                out.prefix = 0;
                out.firstname = 1;
                out.middlename = 2;
                out.lastname = 3;
                break;
            case PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX: // prefix + first name + middle name + last name + suffix
                out.prefix = 0;
                out.firstname = 1;
                out.middlename = 2;
                out.lastname = 3;
                out.suffix = 4;
                break;
        }
    }
    else {
        switch(argLength) {
            case LAST_FIRST_NAME_INDEX: // last name + first name
                out.lastname = 0;
                out.firstname = 1;
                break;
            case LAST_FIRST_MIDDLE_NAME_INDEX: // last name + first name + middle name
                out.lastname = 0;
                out.firstname = 1;
                out.middlename = 2;
                break;
            case PREFIX_LAST_FIRST_MIDDLE_NAME_INDEX: // prefix + last name + first name + middle name
                out.prefix = 0;
                out.lastname = 1;
                out.firstname = 2;
                out.middlename = 3;
                break;
            case PREFIX_LAST_FIRST_MIDDLE_SUFFIX_NAME_INDEX: // prefix + last name + first name + middle name + suffix
                out.prefix = 0;
                out.lastname = 1;
                out.firstname = 2;
                out.middlename = 3;
                out.suffix = 4;
                break;
        }
    }
    return out;
}

/**
 * Makes it easy to manipulate shortcuts for this `NameType`
 * @param type name type
 */
export function allowShortNameType(type: NameType): NameType {
    switch(type) {
        case 'firstname': case 'fn': return 'firstname';
        case 'lastname': case 'ln': return 'lastname';
        case 'middlename': case 'mn': return 'middlename';
        default:
            return type;
    }
}

/**
 * Makes it easy to manipulate shortcuts for this `NameOrder`
 * @param type name type
 */
export function allowShortNameOrder(type: NameOrder): NameOrder {
    switch(type) {
        case 'firstname': case 'fn': return 'firstname';
        case 'lastname': case 'ln': return 'lastname';
        default:
            return type;
    }
}

/**
 * Converts to ascii characters (using UTF-16)
 * @param str string content
 * @param restrictions unneeded content to skip
 */
export function convertToAscii(
    str: string,
    restrictions: string[] = [...RESTRICTED_CHARS]
): number[] {
    return str
        .split(Separator.EMPTY)
        .filter(c => restrictions.indexOf(c) === -1)
        .map(c => c.charCodeAt(0));
}

/**
 * Generates a password
 * @param str string content
 */
export function generatePassword(str: string): string {
    const mapper = PASSWORD_MAPPER;

    const password = str
        .split(Separator.EMPTY)
        .map(char => {
            if (mapper.has(char.toLowerCase()))
                return mapper.get(char.toLowerCase()).random();
            return mapper.get('$').random();
        })
        .join(Separator.EMPTY);
    return password;
}
