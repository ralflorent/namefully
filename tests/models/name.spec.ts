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

    test('should return a lowercased string name', () => {
        expect(name.lower()).toEqual('john')
        expect(name.upper()).toEqual('JOHN')
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
})
