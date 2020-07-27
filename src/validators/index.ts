/**
 * Make all the locals available
 *
 * Created on March 06, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
export * from './common/validation-rule';
export * from './common/validation-type';
export * from './common/validation-error';

export * from './validator';
export { default as NamonValidator } from './namon.validator';
export { default as PrefixValidator } from './prefix.validator';
export { default as SuffixValidator } from './suffix.validator';
export { default as FirstnameValidator } from './firstname.validator';
export { default as LastnameValidator } from './lastname.validator';
export { default as MiddlenameValidator } from './middlename.validator';
export { default as FullnameValidator } from './fullname.validator';
export { default as NamaValidator } from './nama.validator';

export { default as ArrayNameValidator } from './array-name.validator';
export { default as ArrayStringValidator } from './array-string.validator';
export { default as StringNameValidator } from './string-name.validator';
