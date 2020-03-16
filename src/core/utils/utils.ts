/**
 * Utils for the core functionality of `Namefully`
 *
 * Created on March 16, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { NameIndex } from '@models/index';
import { NAME_INDEX } from '@core/index';

/**
 * Re-organizes the existing global indexes for array of name parts
 * @param orderedBy by first or last name
 * @param argLength length of the provided array
 * @param nameIndex global preset of indexing
 */
export function organizeNameIndex(
    orderedBy: 'firstname' | 'lastname',
    argLength: number,
    nameIndex: NameIndex = NAME_INDEX
): NameIndex {
    const out: NameIndex = { ...nameIndex };

    if (orderedBy === 'firstname') {
        switch(argLength) {
            case 2: // first name + last name
                out.firstname = 0;
                out.lastname = 1;
                break;
            case 3: // first name + middle name + last name
                out.firstname = 0;
                out.middlename = 1;
                out.lastname = 2;
                break;
            case 4: // prefix + first name + middle name + last name
                out.prefix = 0;
                out.firstname = 1;
                out.middlename = 2;
                out.lastname = 3;
                break;
            case 5: // prefix + first name + middle name + last name + suffix
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
            case 2: // last name + first name
                out.lastname = 0;
                out.firstname = 1;
                break;
            case 3: // last name + first name + middle name
                out.lastname = 0;
                out.firstname = 1;
                out.middlename = 2;
                break;
            case 4: // prefix + last name + first name + middle name
                out.prefix = 0;
                out.lastname = 1;
                out.firstname = 2;
                out.middlename = 3;
                break;
            case 5: // prefix + last name + first name + middle name + suffix
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
