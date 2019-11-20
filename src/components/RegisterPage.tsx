import React, { useState, useCallback, useRef } from 'react';
import { Button, Input, TextField } from '@material-ui/core';
import useApiRequest from '../hooks/useApiRequest';
import Router from 'next/dist/next-server/server/router';

export default function RegisterPage() {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    confirmPassword: null,
  });
  const wasSubmit = useRef(false);

  const addError = useCallback((key, error) => {
    setErrors({
      ...errors,
      [key]: error,
    })
  }, [errors]);

  const [registerRequest, startRegisterRequest] = useApiRequest(
    async () => new Promise(res => setTimeout(res, 100)),
  );

  const validate = () => {
    let hasErrors: Number = Object.values(errors).filter(Boolean).length;
    const localErrors: any = {};

    if (!state.password.trim() || !state.confirmPassword.trim()) {
      hasErrors = 1;
      localErrors.confirmPassword = 'Password empty';
    } else if (state.password !== state.confirmPassword) {
      hasErrors = 1;
      localErrors.confirmPassword = 'Passwords does not match';
    }

    if (!state.firstName.trim()) {
      hasErrors = 1;
      localErrors.firstName = 'First name is empty';
    }

    if (!state.lastName.trim()) {
      hasErrors = 1;
      localErrors.lastName = 'Last name is empty';
    }

    if (!state.email.trim()) {
      hasErrors = 1;
      localErrors.email = 'Email is empty';
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state.email)) {
      hasErrors = 1;
      localErrors.email = 'Email is invalid';
    }

    setErrors(localErrors);

    return hasErrors;
  }

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const hasErrors = validate();
    wasSubmit.current = true;

    if (hasErrors) {
      return;
    }

    startRegisterRequest();
  }, []);

  const handleChangeValue = ({ target: { name, value } }) => {
    setState({
      ...state,
      [name]: value,
    });
    if (wasSubmit.current) {
      validate();
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="form"
      >
        <TextField
          name="firstName"
          label="First Name"
          className="field"
          error={errors.firstName}
          helperText={errors.firstName}
          onChange={handleChangeValue}
          value={state.firstName}
        />
        <TextField
          name="lastName"
          label="Last Name"
          className="field"
          error={errors.lastName}
          helperText={errors.lastName}
          onChange={handleChangeValue}
          value={state.lastName}
        />
        <TextField
          type="email"
          name="email"
          label="Email"
          className="field"
          error={errors.email}
          helperText={errors.email}
          onChange={handleChangeValue}
          value={state.email}
        />
        <TextField
          name="password"
          type="password"
          className="field"
          label="Password"
          error={errors.confirmPassword}
          helperText={errors.confirmPassword}
          onChange={handleChangeValue}
          value={state.password}
        />
        <TextField
          type="password"
          className="field"
          name="confirmPassword"
          label="Confirm Password"
          error={errors.confirmPassword}
          helperText={errors.confirmPassword}
          onChange={handleChangeValue}
          value={state.confirmPassword}
        />
        <Button
          type="submit"
          variant="contained"
        >
          Register
      </Button>
      </form>
      <style jsx global>{`
        .form {
          width: 20rem;
          display: flex;
          flex-direction: column;
        }

        .field {
          margin-bottom: 3rem !important;
        }
      `}</style>
    </>
  );
}
