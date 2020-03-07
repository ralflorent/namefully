/**
 * Main entry to `Namefully`
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */
export { Namefully } from './namefully';

export const Greeter = (name: string) => `Hello ${name}`;

console.log(Greeter('Ralph'));