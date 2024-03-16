import { useState } from "react";

type QueryParamFormat<T> = {
  parse: (v: string) => T;
  stringify: (v: T) => string;
};
export const QUERY_PARAM_FORMATS = {
  boolean: {
    parse: (v) => !(v == null || v === "false"),
    stringify: (v) => JSON.stringify(v),
  } as QueryParamFormat<boolean>,
  integer: {
    parse: (v) => {
      const parsed = parseInt(v, 10);
      if (Number.isNaN(parsed)) {
        debugger;
        throw new Error("invalid int when parsing: " + v);
      }
      return parsed;
    },
    stringify: (v) => v.toString(),
  } as QueryParamFormat<number>,
  string: {
    parse: (v) => v,
    stringify: (v) => v,
  } as QueryParamFormat<string>,
};

export default function useQueryParam<T>(
  param: string,
  initialValue: T,
  format: QueryParamFormat<T>
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from url by param
      const item = new URL(window.location.href).searchParams.get(param);
      // Parse stored json or if none return initialValue
      return item != null ? format.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to query params.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof value === "function" ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);

      const url = new URL(window.location.href);
      url.searchParams.set(param, format.stringify(valueToStore));
      window.history.replaceState(null, "", url.toString());
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
