/**
 * Testing typescript
 *
 * Created on March 03, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

import { Namefully } from './namefully';

const nf = new Namefully('Joe Bidden');

console.log(`Initials of ${nf.fullname}: ${nf.initials()}`);