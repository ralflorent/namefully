/**
 * Unit tests for Namefully
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from '../src/index';

describe('Namefully', () => {

    const prefix = 'Mr'
    const firstname = 'John'
    const middlename = 'Joe'
    const lastname = 'Smith'
    const suffix = 'PhD'
    const fullname = [
        prefix,
        firstname,
        middlename,
        lastname,
        suffix
    ].join(' ')
    const name = new Namefully(fullname)

    test('should create an instance using literal string', () => {
        expect(name).toBeInstanceOf(Namefully)
    })

    test('should return expected first name', () => {
        expect(name.getFirstname()).toEqual(firstname)
    })

    test('should return expected last name', () => {
        expect(name.getLastname()).toEqual(lastname)
    })

    test('should return expected middle name', () => {
        expect(name.getMiddlenames().join(' ')).toEqual(middlename)
    })

    test('should return expected prefix', () => {
        expect(name.getPrefix()).toEqual(prefix)
    })

    test('should return expected suffix', () => {
        expect(name.getSuffix()).toEqual(suffix)
    })

    // TODO: to be continued...

})