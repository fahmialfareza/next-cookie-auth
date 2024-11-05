import React, { ChangeEvent, FormEvent } from "react";
import { loginUser } from "../lib/auth";
import Router from "next/router";

interface LoginFormState {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
}

class LoginForm extends React.Component<{}, LoginFormState> {
  state: LoginFormState = {
    email: "Rey.Padberg@karina.biz",
    password: "ambrose.net",
    error: "",
    isLoading: false,
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    } as unknown as Pick<LoginFormState, keyof LoginFormState>);
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;

    event.preventDefault();
    this.setState({ error: "", isLoading: true });
    loginUser(email, password)
      .then(() => {
        Router.push("/profile");
      })
      .catch(this.showError);
  };

  showError = (err: any) => {
    console.error(err);
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, isLoading: false });
  };

  render() {
    const { email, password, error, isLoading } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={this.handleChange}
          />
        </div>
        <button disabled={isLoading} type="submit">
          {isLoading ? "Sending" : "Submit"}
        </button>
        {error && <div>{error}</div>}
      </form>
    );
  }
}

export default LoginForm;
