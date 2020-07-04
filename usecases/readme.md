# Use cases

This part of the utility intends to explain how to use `namefully` and what to
expect the output to be.

## Name cases

Considering the diverse ways of instantiating `Namefully`, we use the following
name cases to evaluate many use cases:

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

### Miscellaneous use cases

```text
+==============================================================================+
| USE CASE: use of title cases                                                 |
+==============================================================================+
full name   : Keira Knightley
lower case  : keira knightley
upper case  : KEIRA KNIGHTLEY
camel case  : keiraKnightley
pascal case : KeiraKnightley
snake case  : keira_knightley
hyphen case : keira-knightley
dot case    : keira.knightley
toggle case : kEIRA kNIGHTLEY
----------------------------------------------------------------------------
full name   : George Walker Bush
lower case  : george walker bush
upper case  : GEORGE WALKER BUSH
camel case  : georgeWalkerBush
pascal case : GeorgeWalkerBush
snake case  : george_walker_bush
hyphen case : george-walker-bush
dot case    : george.walker.bush
toggle case : gEORGE wALKER bUSH
----------------------------------------------------------------------------
full name   : Emilia Isobel Euphemia Rose Clarke
lower case  : emilia isobel euphemia rose clarke
upper case  : EMILIA ISOBEL EUPHEMIA ROSE CLARKE
camel case  : emiliaIsobelEuphemiaRoseClarke
pascal case : EmiliaIsobelEuphemiaRoseClarke
snake case  : emilia_isobel_euphemia_rose_clarke
hyphen case : emilia-isobel-euphemia-rose-clarke
dot case    : emilia.isobel.euphemia.rose.clarke
toggle case : eMILIA iSOBEL eUPHEMIA rOSE cLARKE
----------------------------------------------------------------------------
full name   : Daniel Michael Blake Day-Lewis
lower case  : daniel michael blake day-lewis
upper case  : DANIEL MICHAEL BLAKE DAY-LEWIS
camel case  : danielMichaelBlakeDayLewis
pascal case : DanielMichaelBlakeDayLewis
snake case  : daniel_michael_blake_day_lewis
hyphen case : daniel-michael-blake-day-lewis
dot case    : daniel.michael.blake.day.lewis
toggle case : dANIEL mICHAEL bLAKE dAY-lEWIS
----------------------------------------------------------------------------
full name   : Obama Barack
lower case  : obama barack
upper case  : OBAMA BARACK
camel case  : obamaBarack
pascal case : ObamaBarack
snake case  : obama_barack
hyphen case : obama-barack
dot case    : obama.barack
toggle case : oBAMA bARACK
----------------------------------------------------------------------------
full name   : Dr. Albert Einstein
lower case  : albert einstein
upper case  : ALBERT EINSTEIN
camel case  : albertEinstein
pascal case : AlbertEinstein
snake case  : albert_einstein
hyphen case : albert-einstein
dot case    : albert.einstein
toggle case : aLBERT eINSTEIN
----------------------------------------------------------------------------
full name   : Fabrice Piazza, PhD
lower case  : fabrice piazza
upper case  : FABRICE PIAZZA
camel case  : fabricePiazza
pascal case : FabricePiazza
snake case  : fabrice_piazza
hyphen case : fabrice-piazza
dot case    : fabrice.piazza
toggle case : fABRICE pIAZZA
----------------------------------------------------------------------------
full name   : Thiago Da Silva
lower case  : thiago da silva
upper case  : THIAGO DA SILVA
camel case  : thiagoDaSilva
pascal case : ThiagoDaSilva
snake case  : thiago_da_silva
hyphen case : thiago-da-silva
dot case    : thiago.da.silva
toggle case : tHIAGO dA sILVA
----------------------------------------------------------------------------
full name   : Shakira Isabel Ripoll
lower case  : shakira isabel ripoll
upper case  : SHAKIRA ISABEL RIPOLL
camel case  : shakiraIsabelRipoll
pascal case : ShakiraIsabelRipoll
snake case  : shakira_isabel_ripoll
hyphen case : shakira-isabel-ripoll
dot case    : shakira.isabel.ripoll
toggle case : sHAKIRA iSABEL rIPOLL
----------------------------------------------------------------------------
full name   : Mme. Marine Le Pen, M.Sc.
lower case  : marine le pen
upper case  : MARINE LE PEN
camel case  : marineLePen
pascal case : MarineLePen
snake case  : marine_le_pen
hyphen case : marine-le-pen
dot case    : marine.le.pen
toggle case : mARINE lE pEN
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: generate a password representation                                 |
+==============================================================================+
full name  : Keira Knightley
password   : %E|r@2KNiGH7lE|
----------------------------------------------------------------------------
full name  : George Walker Bush
password   : &Eo78e![|]4|_%37[BUsH
----------------------------------------------------------------------------
full name  : Emilia Isobel Euphemia Rose Clarke
password   : e^^1|_--@.--s.b31*E|_||)hE>>iA7r0s3}<|_4rKE
----------------------------------------------------------------------------
full name  : Daniel Michael Blake Day-Lewis
password   : d4!=!e1:^^!(#4E!*B1ak38(|a82|_*[|]!5
----------------------------------------------------------------------------
full name  : Obama Barack
password   : .BA^^a@6a&ac|<
----------------------------------------------------------------------------
full name  : Dr. Albert Einstein
password   : A1bER[73!n$7E!++
----------------------------------------------------------------------------
full name  : Fabrice Piazza, PhD
password   : FaBrI(39P--@z!=a
----------------------------------------------------------------------------
full name  : Thiago Da Silva
password   : Th|a8*}d@}$Il^@
----------------------------------------------------------------------------
full name  : Shakira Isabel Ripoll
password   : S#a%17@}|5@B*l@R!P.l1
----------------------------------------------------------------------------
full name  : Mme. Marine Le Pen, M.Sc.
password   : ^^A&|++**LE%|>3n
----------------------------------------------------------------------------
```

[Back to Top](#use-cases)
