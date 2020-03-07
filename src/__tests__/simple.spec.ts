import { Greeter } from  '../index';

test('Simple test', () => {
    expect(Greeter('Ralph')).toBe('Hello Ralph');
});