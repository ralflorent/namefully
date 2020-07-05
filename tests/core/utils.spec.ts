/**
 * Unit tests for Utils
 *
 * Created on July 02, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import {
    capitalize,
    decapitalize,
    toggleCase,
    allowShortNameType,
    allowShortNameOrder,
    NameIndex,
    organizeNameIndex,
    FIRST_LAST_NAME_INDEX,
    LAST_FIRST_NAME_INDEX,
    FIRST_MIDDLE_LAST_NAME_INDEX,
    LAST_FIRST_MIDDLE_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX,
    PREFIX_LAST_FIRST_MIDDLE_NAME_INDEX,
    PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX,
    PREFIX_LAST_FIRST_MIDDLE_SUFFIX_NAME_INDEX,
} from '../../src/index';

describe('Utils', () => {

    let indexes: NameIndex;

    test('should organize index ordered by firstname', () => {
        indexes = organizeNameIndex('firstname', FIRST_LAST_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ firstname: 0, lastname: 1 })
        )

        indexes = organizeNameIndex('firstname', FIRST_MIDDLE_LAST_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ firstname: 0, middlename: 1, lastname: 2 })
        )

        indexes = organizeNameIndex('firstname', PREFIX_FIRST_MIDDLE_LAST_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ prefix: 0, firstname: 1, middlename: 2, lastname: 3 })
        )

        indexes = organizeNameIndex('firstname', PREFIX_FIRST_MIDDLE_LAST_SUFFIX_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ prefix: 0, firstname: 1, middlename: 2, lastname: 3, suffix: 4 })
        )
    })

    test('should organize index ordered by lastname', () => {
        indexes = organizeNameIndex('lastname', LAST_FIRST_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ lastname: 0, firstname: 1 })
        )

        indexes = organizeNameIndex('lastname', LAST_FIRST_MIDDLE_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ lastname: 0, firstname: 1, middlename: 2 })
        )

        indexes = organizeNameIndex('lastname', PREFIX_LAST_FIRST_MIDDLE_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ prefix: 0, lastname: 1, firstname: 2, middlename: 3 })
        )

        indexes = organizeNameIndex('lastname', PREFIX_LAST_FIRST_MIDDLE_SUFFIX_NAME_INDEX)
        expect(indexes).toEqual(
            expect.objectContaining({ prefix: 0, lastname: 1, firstname: 2, middlename: 3, suffix: 4 })
        )
    })

    test('should allow shortcut for NameOrder', () => {
        expect(allowShortNameOrder('fn')).toEqual('firstname')
        expect(allowShortNameOrder('ln')).toEqual('lastname')
        expect(allowShortNameOrder(undefined)).toBeUndefined()
    })

    test('should allow shortcut for NameType', () => {
        expect(allowShortNameType('fn')).toEqual('firstname')
        expect(allowShortNameType('ln')).toEqual('lastname')
        expect(allowShortNameType('mn')).toEqual('middlename')
        expect(allowShortNameType(undefined)).toBeUndefined()
    })

    test('should capitalize a string accordingly', () => {
        expect(capitalize(undefined)).toEqual('')
        expect(capitalize('string')).toEqual('String')
        expect(capitalize('string', 'initial')).toEqual('String')
        expect(capitalize('string', 'all')).toEqual('STRING')
    })

    test('should decapitalize a string accordingly', () => {
        expect(decapitalize(undefined)).toEqual('')
        expect(decapitalize('STRING')).toEqual('sTRING')
        expect(decapitalize('STRING', 'initial')).toEqual('sTRING')
        expect(decapitalize('STRING', 'all')).toEqual('string')
    })

    test('should toggle a string accordingly', () => {
        expect(toggleCase('hello')).toEqual('HELLO')
        expect(toggleCase('HeLlO')).toEqual('hElLo')
    })

})
