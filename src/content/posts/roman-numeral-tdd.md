---
title: "Convert a Roman numeral into a number with TDD and javascript"
date: 2022-06-03
description: "Solving the classic Roman numeral to number challenge in JavaScript, one failing test at a time."
---

### About the challenge

Convert a Roman numeral into a number is a classic coding challenge! We are going to solve this challenge using TDD.

> Write a function to convert from Roman Numerals to normal numbers.

### First test scenario

Let's get start creating a simple test thats return true:
```js
describe('[Function]: romanNumeralGenerator', () => {
  test('return true', () => {
    expect(romanNumeralGenerator()).toBe(true)
  })
})
```

Then, let's create the function `romanNumeralGenerator()`:

```js
export function romanNumeralGenerator() {
  return true
}
```

Result:

```js
 PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ return true (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Ok! Nothing new so far...

### Second test scenario

Let's do the first valid test. I want receive a valid integer number if I pass only one roman numeral as argument:

```js
test('convert roman number into a number', () => {
  expect(romanNumeralGenerator('X')).toBe(10)
})
```

The test failed
```js
Expected: 10
Received: true

      3 | describe('[Function]: romanNumeralGenerator', () => {
      4 |   test('convert one roman number into a number', () => {
    > 5 |     expect(romanNumeralGenerator('X')).toBe(10)
        |                                        ^
      6 |   })
```

Time to do the first refactor in our function. Let's create a `const` with all the roman numerals and assign their respective values to each number.
```js
const romanNumbers = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
}
```

Now the return of our function will receive the const `romanNumbers` and let's go through the object looking for the value of the argument `romanNumbers[number]`

```js
export function romanNumeralGenerator(number) {
  return romanNumbers[number]
}

console.log(romanNumeralGenerator('X')) // 10
```

Result:
```js
PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ convert one roman number into a number (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### Third test case

What about more than one roman numeral?
```js
test('convert more than one roman number into a number', () => {
  expect(romanNumeralGenerator('XVI')).toBe(16)
})
```

Result:
```js
Expected: 16
Received: undefined

       7 |
       8 |   test('convert more than one roman number into a number', () => {
    >  9 |     expect(romanNumeralGenerator('XVI')).toBe(16)
         |                                          ^
      10 |   })
```

Let's make our function return values when receive more than one digit.
First we use `spread operator` to create an `array` with all values and then we use `map` function to convert each roman value in integer. Then we calculate all converted values. We'll use `reduce` for it.

```js
export function romanNumeralGenerator(number) {
  const convertRomanNumbersToIntegers = [...number].map(romanValue => romanNumbers[romanValue])
  const calculateConvertedRomanValues = convertRomanNumbersToIntegers.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  return calculateConvertedRomanValues
}
```

Result:
```js
PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ convert one roman number into a number (1 ms)
    ✓ convert more than one roman number into a number 😊😊😊

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

### Fourth test scenario

The next step is about how to subtract values in case we have something like this: `IV`, `IX`, `XIV`
```js
test('subtract the value if the next is greater than the current value', () => {
  expect(romanNumeralGenerator('IV')).toBe(4)
  expect(romanNumeralGenerator('IX')).toBe(9)
  expect(romanNumeralGenerator('XIV')).toBe(14)
  expect(romanNumeralGenerator('XXIX')).toBe(29)
})
```

Result:
```js
    ✕ subtract the value if the next is greater than the current value (1 ms)

  ● [Function]: romanNumeralGenerator › subtract the value if the next is greater than the current value

    expect(received).toBe(expected) // Object.is equality

    Expected: 4
    Received: 6 😓😓😓😓

      11 |
      12 |   test('subtract the value if the next is greater than the current value', () => {
    > 13 |     expect(romanNumeralGenerator('IV')).toBe(4)
         |                                         ^
      14 |     expect(romanNumeralGenerator('IX')).toBe(9)
```

We need to check if the next value (inside `calculateConvertedRomanValues`) is greater than the current value, if so, we subtract the current value from the acc. E.g: the next value is 5 and the current one is 1, so, 5 - 1 = 4.

In a `reduce` function we have 4 default arguments `reduce((accumulator, currentValue, index, array)`. First, we will grab the next value, then, the condition to check if next value is greater than the current value and subtract:
```js
export function romanNumeralGenerator(number) {
  const convertRomanNumbersToIntegers = [...number].map(romanValue => romanNumbers[romanValue])

  const calculateConvertedRomanValues = convertRomanNumbersToIntegers.reduce((accumulator, currentValue, index, array) => {
    const nextValue = array[index + 1] // =====> get next value

    if (nextValue > currentValue) { // =====> check next value is greater than currentValue
      return accumulator - currentValue
    }

    return accumulator + currentValue
  }, 0)

  return calculateConvertedRomanValues
}
```

Result:
```js
PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ convert one roman number into a number (1 ms)
    ✓ convert more than one roman number into a number
    ✓ subtract the value if the next is greater than the current value (2 ms) 🚀🚀🚀

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### Bonus

Let's verify if the argument has only valid roman numbers and then transform the value in uppercase.

```js
test('verify each value is a valid roman number', () => {
	expect(romanNumeralGenerator('WRONG')).toBe(`Invalid value! Make sure you are using only roman numbers ${Object.keys(romanNumbers).map(value => value)}`)
})
```

Result:
```js
Expected: "Invalid value! Make sure you are using only roman numbers I,V,X,L,C,D,M"
Received: NaN

      19 |
      20 |   test('verify each value is a valid roman number', () => {
    > 21 |     expect(romanNumeralGenerator('WRONG')).toBe(`Invalid value! Make sure you are using only roman numbers ${Object.keys(romanNumbers).map(value => value)}`)
         |                                            ^
      22 |   })
```

Refactor!
Let's go back to the function and check each value. For the first case, we need verify if `convertRomanNumbersToIntegers` has an `undefined` value cause in the `romanNumbers` we already have all roman numbers available.

```js
export function romanNumeralGenerator(number) {
  const convertRomanNumbersToIntegers = [...number].map(romanValue => romanNumbers[romanValue])

// +++
  if (convertRomanNumbersToIntegers.includes(undefined)) return `Invalid value! Make sure you are using only roman numbers ${Object.keys(romanNumbers).map(value => value)}`
// +++

  const calculateConvertedRomanValues = convertRomanNumbersToIntegers.reduce((accumulator, currentValue, index, array) => {
    const nextValue = array[index + 1] // =====> get next value

    if (nextValue > currentValue) { // =====> check next value is greater than currentValue
      return accumulator - currentValue
    }

    return accumulator + currentValue
  }, 0)

  return calculateConvertedRomanValues
}
```

Test result:
```js
PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ convert one roman number into a number (1 ms)
    ✓ convert more than one roman number into a number
    ✓ subtract the value if the next is greater than the current value (1 ms)
    ✓ verify each value is a valid roman number 😊😊😊

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

Last but not least, let's convert the argument received in the function to uppercase.
```js
test('convert the argument received in the function to uppercase', () => {
  expect(romanNumeralGenerator('xxvi')).toBe(26)
})
```

Test result:
```js
Expected: 26
Received: "Invalid value! Make sure you are using only roman numbers I,V,X,L,C,D,M"

      23 |
      24 |   test('convert the argument received in the function to uppercase', () => {
    > 25 |     expect(romanNumeralGenerator('xxvi')).toBe(26)
         |                                           ^
      26 |   })
      27 | })
```

Refactor!
Let's use `str.toUpperCase()` to do it:
```js
export function romanNumeralGenerator(number) {
// +++
  const transformValuesInUppercase = number.toUpperCase()
// +++

  const convertRomanNumbersToIntegers = [...transformValuesInUppercase].map(romanValue => romanNumbers[romanValue])

  if (convertRomanNumbersToIntegers.includes(undefined)) return `Invalid value! Make sure you are using only roman numbers ${Object.keys(romanNumbers).map(value => value)}`

  const calculateConvertedRomanValues = convertRomanNumbersToIntegers.reduce((accumulator, currentValue, index, array) => {
    const nextValue = array[index + 1] // =====> get next value

    if (nextValue > currentValue) { // =====> check next value is greater than currentValue
      return accumulator - currentValue
    }

    return accumulator + currentValue
  }, 0)

  return calculateConvertedRomanValues
}
```

Test result:
```js
PASS  ./index.test.js
  [Function]: romanNumeralGenerator
    ✓ convert one roman number into a number (1 ms)
    ✓ convert more than one roman number into a number (1 ms)
    ✓ subtract the value if the next is greater than the current value
    ✓ verify each value is a valid roman number
    ✓ convert the argument received in the function to uppercase 😊😊😊😊

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

That's it.
It's was a simple case in how we can start thinking in TDD.
Hope you enjoy it!

Check out [codesandbox](https://codesandbox.io/s/convert-a-roman-numeral-into-a-number-with-tdd-7i4qg9?from-embed)

---

*Originally published on [dev.to](https://dev.to/emunhoz/convert-a-roman-numeral-into-a-number-with-tdd-13d7).*
