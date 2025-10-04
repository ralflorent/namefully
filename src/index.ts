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
import namefully from './namefully.js';

export * from './builder.js';
export * from './config.js';
export { VERSION as version } from './constants.js';
export * from './error.js';
export * from './fullname.js';
export * from './name.js';
export * from './namefully.js';
export { Parser } from './parser.js';
export * from './types.js';
export { NameIndex } from './utils.js';
export default namefully;
