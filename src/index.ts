/**
 * Welcome to namefully!
 *
 * `namefully` is a JavaScript utility for handling personal names.
 *
 * Sources
 * - repo: https://github.com/ralflorent/namefully
 * - docs: https://namefully.netlify.app
 * - npm: https://npmjs.com/package/namefully
 * - jsr: https://jsr.io/@ralflorent/namefully
 *
 * @license MIT
 */
import namefully from './namefully';

export * from './builder';
export * from './config';
export { VERSION as version } from './constants';
export * from './error';
export * from './full-name';
export * from './name';
export * from './namefully';
export { Parser } from './parser';
export * from './types';
export { NameIndex } from './utils';

export default namefully;
