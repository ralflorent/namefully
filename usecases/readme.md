# Use cases

This part of the utility intends to explain how to use `namefully` and what to
expect the output to be.

Run the following command:

```bash
npm run usecases
```

## Examples

Given the following name: **Daniel Michael Blake Day-Lewis**

```text
+==============================================================================+
| USE CASE: Describe the full name                                             |
+==============================================================================+
Descriptive statistics for "Daniel Michael Blake Day-Lewis"
count    : 27
frequency: 4
top      : L
unique   : 15
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: Describe the first name                                            |
+==============================================================================+
Descriptive statistics for "Daniel"
count    : 6
frequency: 1
top      : L
unique   : 6
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: Describe the middle name                                           |
+==============================================================================+
Descriptive statistics for "Michael Blake"
count    : 12
frequency: 2
top      : L
unique   : 9
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: Describe the last name                                             |
+==============================================================================+
Descriptive statistics for "Day-Lewis"
count    : 9
frequency: 1
top      : S
unique   : 9
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: shorten the full name                                              |
+==============================================================================+
full name       : Daniel Michael Blake Day-Lewis
typical name    : Daniel Day-Lewis
----------------------------------------------------------------------------

The compressed name <D. Michael Blake Day-Lewis> still surpasses the set limit 20
The compressed name <Daniel Michael Blake D.> still surpasses the set limit 20
+==============================================================================+
| USE CASE: compress the full name using different variants                    |
+==============================================================================+
full name    : Daniel Michael Blake Day-Lewis
by default   : Daniel M. Day-Lewis
by limit 20  : Daniel M. Day-Lewis
by firstname : D. Michael Blake Day-Lewis
by lastname  : Daniel Michael Blake D.
by middlename: Daniel M. Day-Lewis
by firstmid  : D. M. Day-Lewis
by midlast   : Daniel M. D.
----------------------------------------------------------------------------

+==============================================================================+
| USE CASE: format the name as desired                                         |
+==============================================================================+
full name     : Daniel Michael Blake Day-Lewis
by default    : Daniel Michael Blake Day-Lewis
[fn] [ln]     : Daniel Day-Lewis
[LN], [fn]    : DAY-LEWIS, Daniel
[ln]_[mn]_[fn]: Daniel_Michael Blake_Day-Lewis
[LN]-[MN] [FN]: DANIEL-MICHAEL BLAKE DAY-LEWIS
----------------------------------------------------------------------------
```
