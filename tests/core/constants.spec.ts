/**
 * Unit tests for the global constants
 *
 * Created on March 11, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
import { version, CONFIG, Namon, Separator } from '../../src/index';

describe('Constants', () => {

    test('should contain the M.m.p version format', () => {
        const reg = /[0-9]+(\.[0-9]+)*/ // '3.20.0'
        expect(version).toMatch(reg)
    })

    test('should be a config constant with expected default values', () => {
        const defaultConfig = {
            orderedBy: Namon.FIRST_NAME,
            separator: Separator.SPACE
        }
        expect(CONFIG).toBeDefined()
        expect(CONFIG).toMatchObject(defaultConfig)
    })

})