# Always Check

This is a really tiny package made for one purpose: getting rid of exceptions.
Instead, just wrap them in a *check()* function, and you will get a *Type | Error*

# Usage
```bash
npm install always-check
```
Consider a simple fetch request to retrieve some data from an API. You are not sure whether your fetch request will not fail, and even later, you are not sure that you will retrieve json data successfully. So, just check it!

```typescript
import {check, checkAsync} from 'always-check'

const url = "https://fakeApi.com"
const res = await checkAsync(async() => await fetch(url))
// now res is Response | Error
if (res instanceOf Error) {
  // handle the error
  console.log(res.message)
  console.log(res.cause) // it will be the full original error object caught in the catch clause
  return
}
const data = await checkAsync(async() => await res.json()) // here res is Response for sure since we checked for the error
if (data instanceOf Error) {
  console.log(data.message)
  return
}

// You can also throw from your custom function and check for it:

function divideNumbers(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

const result = check(divideNumbers, 5, 0)
if (result instanceOf Error) {
  console.log(result.message) // will print Error: Division by zero is not allowed
}
```

The package provides two functions:
  - check() for synchronous code.
  - checkAsync() for asynchronous code.

Both functions accept another function as an argument and arbitrary number of other arguments which are arguments to your function.
Both function return either expected Type or an Error (checkAsync returns promise, of course)

# Why do you need a separate package for just two simple wrapping functions??
I was interested in implementing the error handling used by Go and Ballerina in TypeScript for my projects.
Instead of linking the project locally here and there, I decided to upload this to npm for convenience.
