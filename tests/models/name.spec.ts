/**
 * Unit tests for the models
 *
 * Created on April 13, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { Namon, Name } from '../../src/index';

describe('name', () => {

    let name: Name;

    beforeEach(() => {
        name = new Name('John', Namon.MIDDLE_NAME)
    })

    test('should create an instance of type name', () => {
        expect(name).toBeInstanceOf(Name)
        expect(name.namon).toBeDefined()
        expect(name.type).toBeDefined()
    })

    test('should describe only the name', () => {
        const summary = name.describe()
        expect(summary.count).toEqual(4)
        expect(summary.tostring()).toContain('count    : 4')
    })

    test('should return only the initials of the name', () => {
        expect(name.getInitials()).toStrictEqual(['J'])
    })

    test('should create an instance with the initial capitalized', () => {
        const n = new Name('jackson', Namon.LAST_NAME, 'initial')
        expect(n.getInitials()).toStrictEqual(['J'])
        expect(n.namon).toEqual('Jackson')
    })

    test('should create an instance with all capitalized', () => {
        const n = new Name('rick', Namon.FIRST_NAME, 'all')
        expect(n.getInitials()).toStrictEqual(['R'])
        expect(n.namon).toEqual('RICK')
    })

    test('should capitalize the name afterward', () => {
        expect(name.capitalize().namon).toEqual('John')
        expect(name.capitalize('all').namon).toEqual('JOHN')
    })

    test('should decapitalize the name afterward', () => {
        const n = new Name('MORTY', Namon.FIRST_NAME)
        expect(n.decapitalize().namon).toEqual('mORTY')
        expect(n.decapitalize('all').namon).toEqual('morty')
    })

    test('should reset the name afterward', () => {
        const n = new Name('morty', Namon.FIRST_NAME, 'initial')
        expect(n.namon).toEqual('Morty')
        expect(n.reset().namon).toEqual('morty')
    })

    test('should normalize the name afterward', () => {
        expect(
            new Name('ESTRELLA', Namon.LAST_NAME).normalize().namon
        ).toEqual('Estrella')
    })

    test('should return an ascii representation', () => {
        expect(name.ascii()).toEqual([74, 111, 104, 110])
        expect(name.ascii(['o'])).toEqual([74, 104, 110])
    })

    test('should return a password (hash-like content)', () => {
        expect(name.passwd()).toBeDefined()
    })
})
