import { useState } from 'react';

export default function useApiRequest(request, onSuccess?): [any, Function, Function] {
  const initialState = {
    result: null,
    error: null,
    processing: null,
  };
  const [values, setValue] = useState(initialState);

  const startRequest = async (...args) => {
    setValue({
      ...initialState,
      processing: true,
    });

    try {
      const result = await request(...args);

      setValue({
        ...values,
        result: result || {},
        error: null,
        processing: false,
      });

      if (onSuccess) {
        onSuccess(result || {}, ...args);
      }
    } catch (err) {
      setValue({
        ...initialState,
        error: err,
        processing: false,
      });
    }
  };

  const setResult = (result) => {
    setValue({
      ...values,
      result,
    });
  };

  const reset = () => setValue(initialState);

  return [{ ...values, reset }, startRequest, setResult];
}
