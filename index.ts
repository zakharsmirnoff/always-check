async function checkAsync<Args extends any[], Type>(
  fnToCheck: (...args: Args) => Promise<Type>,
  ...args: Args
): Promise<Type | Error> {
  try {
    const result = await fnToCheck(...args);
    return result;
  } catch (e) {
    return new Error(String(e), { cause: fnToCheck.name });
  }
}

function check<Args extends any[], Type>(
  fnToCheck: (...args: Args) => Type,
  ...args: Args
): Type | Error {
  try {
    const result = fnToCheck(...args);
    return result;
  } catch (e) {
    return new Error(String(e), { cause: fnToCheck.name });
  }
}

export { check, checkAsync };
