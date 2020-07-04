# Use cases

This part of the utility intends to explain how to use `namefully` and what to
expect the output to be.

## Name cases

Considering the distinct ways of instantiating `Namefully`, we evaluate the
following name cases to evaluate many use cases:

```ts
import { Config, Nama, Name, Firstname, Lastname, Separator, Namon } from 'namefully'

export interface NameCase {
    raw: string | string[] | Name[] | Nama
    options: Partial<Config>
}

export const NAMECASES: NameCase[] = [
    {
        raw: 'Keira Knightley',
        options: {},
    },
    {
        raw: ['George', 'Walker', 'Bush'],
        options: {},
    },
    {
        raw: [
            new Firstname('Emilia'),
            new Name('Isobel', Namon.MIDDLE_NAME),
            new Name('Euphemia', Namon.MIDDLE_NAME),
            new Name('Rose', Namon.MIDDLE_NAME),
            new Lastname('Clarke')
        ],
        options: {}
    },
    {
        raw: [
            new Firstname('Daniel', 'Michael', 'Blake'),
            new Lastname('Day-Lewis')
        ],
        options: {}
    },
    {
        raw: 'Obama Barack',
        options: {  orderedBy: 'lastname' }
    },
    {
        raw: { prefix: 'Dr', firstname: 'Albert', lastname: 'Einstein' },
        options: { titling: 'us' }
    },
    {
        raw: { firstname: 'Fabrice', lastname: 'Piazza', suffix: 'PhD' },
        options: { ending: true }
    },
    {
        raw: 'Thiago, Da Silva',
        options: { separator: Separator.COMMA }
    },
    {
        raw: [ new Firstname('Shakira', 'Isabel'), new Lastname('Mebarak', 'Ripoll') ],
        options: { lastnameFormat: 'mother' }
    },
    {
        raw: { prefix: 'Mme', firstname: 'Marine', lastname: 'Le Pen', suffix: 'M.Sc.' },
        options: { bypass: true, ending: true, titling: 'us' }
    },
]
```

Run the following command:

```bash
npm run usecases
```

Or

```bash
npm run uc
```

## Outputs

### Shortening a full name

```text
+==============================================================================+
| USE CASE: shorten the full name                                              |
+==============================================================================+
full name   : Keira Knightley
first name  : Keira
last name   : Knightley
short name  : Keira Knightley
----------------------------------------------------------------------------
full name   : George Walker Bush
first name  : George
last name   : Bush
short name  : George Bush
----------------------------------------------------------------------------
full name   : Emilia Isobel Euphemia Rose Clarke
first name  : Emilia
last name   : Clarke
short name  : Emilia Clarke
----------------------------------------------------------------------------
full name   : Daniel Michael Blake Day-Lewis
first name  : Daniel Michael Blake
last name   : Day-Lewis
short name  : Daniel Day-Lewis
----------------------------------------------------------------------------
full name   : Obama Barack
first name  : Barack
last name   : Obama
short name  : Obama Barack
----------------------------------------------------------------------------
full name   : Dr. Albert Einstein
first name  : Albert
last name   : Einstein
short name  : Albert Einstein
----------------------------------------------------------------------------
full name   : Fabrice Piazza, PhD
first name  : Fabrice
last name   : Piazza
short name  : Fabrice Piazza
----------------------------------------------------------------------------
full name   : Thiago Da Silva
first name  : Thiago
last name   : Da Silva
short name  : Thiago Da Silva
----------------------------------------------------------------------------
full name   : Shakira Isabel Ripoll
first name  : Shakira Isabel
last name   : Ripoll
short name  : Shakira Ripoll
----------------------------------------------------------------------------
full name   : Mme. Marine Le Pen, M.Sc.
first name  : Marine
last name   : Le Pen
short name  : Marine Le Pen
----------------------------------------------------------------------------
```

### Formatting a full name as desired

```text
+==============================================================================+
| USE CASE: format the name as desired                                         |
+==============================================================================+
full name     : Keira Knightley
by default    : KNIGHTLEY, Keira
short name    : Keira Knightley
long name     : Keira Knightley
[LN], [fn]    : KNIGHTLEY, Keira
----------------------------------------------------------------------------
full name     : George Walker Bush
by default    : BUSH, George Walker
short name    : George Bush
long name     : George Walker Bush
[LN], [fn]    : BUSH, George
----------------------------------------------------------------------------
full name     : Emilia Isobel Euphemia Rose Clarke
by default    : CLARKE, Emilia Isobel Euphemia Rose
short name    : Emilia Clarke
long name     : Emilia Isobel Euphemia Rose Clarke
[LN], [fn]    : CLARKE, Emilia
----------------------------------------------------------------------------
full name     : Daniel Michael Blake Day-Lewis
by default    : DAY-LEWIS, Daniel Michael Blake
short name    : Daniel Day-Lewis
long name     : Daniel Michael Blake Day-Lewis
[LN], [fn]    : DAY-LEWIS, Daniel Michael Blake
----------------------------------------------------------------------------
full name     : Obama Barack
by default    : OBAMA, Barack
short name    : Obama Barack
long name     : Obama Barack
[LN], [fn]    : OBAMA, Barack
----------------------------------------------------------------------------
full name     : Dr. Albert Einstein
by default    : Dr. EINSTEIN, Albert
short name    : Albert Einstein
long name     : Albert Einstein
[LN], [fn]    : EINSTEIN, Albert
----------------------------------------------------------------------------
full name     : Fabrice Piazza, PhD
by default    : PIAZZA, Fabrice, PhD
short name    : Fabrice Piazza
long name     : Fabrice Piazza
[LN], [fn]    : PIAZZA, Fabrice
----------------------------------------------------------------------------
full name     : Thiago Da Silva
by default    : DA SILVA, Thiago
short name    : Thiago Da Silva
long name     : Thiago Da Silva
[LN], [fn]    : DA SILVA, Thiago
----------------------------------------------------------------------------
full name     : Shakira Isabel Ripoll
by default    : RIPOLL, Shakira Isabel
short name    : Shakira Ripoll
long name     : Shakira Isabel Ripoll
[LN], [fn]    : RIPOLL, Shakira Isabel
----------------------------------------------------------------------------
full name     : Mme. Marine Le Pen, M.Sc.
by default    : Mme. LE PEN, Marine, M.Sc.
short name    : Marine Le Pen
long name     : Marine Le Pen
[LN], [fn]    : LE PEN, Marine
----------------------------------------------------------------------------
```

### Compressing a full name using different variants

```text
+==============================================================================+
| USE CASE: zip the full name using different variants                         |
+==============================================================================+
full name    : Keira Knightley
by default   : Keira Knightley
by firstname : K. Knightley
by lastname  : Keira K.
by middlename: Keira Knightley
by firstmid  : K. Knightley
by midlast   : Keira K.
----------------------------------------------------------------------------
full name    : George Walker Bush
by default   : George W. Bush
by firstname : G. Walker Bush
by lastname  : George Walker B.
by middlename: George W. Bush
by firstmid  : G. W. Bush
by midlast   : George W. B.
----------------------------------------------------------------------------
full name    : Emilia Isobel Euphemia Rose Clarke
by default   : Emilia I.E.R. Clarke
by firstname : E. Isobel Euphemia Rose Clarke
by lastname  : Emilia Isobel Euphemia Rose C.
by middlename: Emilia I.E.R. Clarke
by firstmid  : E. I.E.R. Clarke
by midlast   : Emilia I.E.R. C.
----------------------------------------------------------------------------
full name    : Daniel Michael Blake Day-Lewis
by default   : Daniel Michael Blake Day-Lewis
by firstname : D. Day-Lewis
by lastname  : Daniel Michael Blake D.
by middlename: Daniel Michael Blake Day-Lewis
by firstmid  : D. Day-Lewis
by midlast   : Daniel Michael Blake D.
----------------------------------------------------------------------------
full name    : Obama Barack
by default   : Obama Barack
by firstname : Obama B.
by lastname  : O. Barack
by middlename: Obama Barack
by firstmid  : Obama B.
by midlast   : O. Barack
----------------------------------------------------------------------------
full name    : Dr. Albert Einstein
by default   : Albert Einstein
by firstname : A. Einstein
by lastname  : Albert E.
by middlename: Albert Einstein
by firstmid  : A. Einstein
by midlast   : Albert E.
----------------------------------------------------------------------------
full name    : Fabrice Piazza, PhD
by default   : Fabrice Piazza
by firstname : F. Piazza
by lastname  : Fabrice P.
by middlename: Fabrice Piazza
by firstmid  : F. Piazza
by midlast   : Fabrice P.
----------------------------------------------------------------------------
full name    : Thiago Da Silva
by default   : Thiago Da Silva
by firstname : T. Da Silva
by lastname  : Thiago D.
by middlename: Thiago Da Silva
by firstmid  : T. Da Silva
by midlast   : Thiago D.
----------------------------------------------------------------------------
full name    : Shakira Isabel Ripoll
by default   : Shakira Isabel Ripoll
by firstname : S. Ripoll
by lastname  : Shakira Isabel R.
by middlename: Shakira Isabel Ripoll
by firstmid  : S. Ripoll
by midlast   : Shakira Isabel R.
----------------------------------------------------------------------------
full name    : Mme. Marine Le Pen, M.Sc.
by default   : Marine Le Pen
by firstname : M. Le Pen
by lastname  : Marine L.
by middlename: Marine Le Pen
by firstmid  : M. Le Pen
by midlast   : Marine L.
----------------------------------------------------------------------------
```

[Back to Top](#use-cases)