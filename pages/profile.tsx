import React, { Component } from "react";
import Layout from "../components/Layout";
import { getUserProfile, authInitialProps } from "../lib/auth";

interface ProfileProps {
  auth?: {
    user?: {
      name?: string;
      email?: string;
      type?: string;
    };
  };
}

interface ProfileState {
  user: string | Record<string, any>;
}

export default class Profile extends Component<ProfileProps, ProfileState> {
  state: ProfileState = {
    user: "Loading profile...",
  };

  async componentDidMount() {
    const user = await getUserProfile();
    this.setState({ user });
  }

  render() {
    return (
      <Layout title="Profile" {...this.props}>
        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
      </Layout>
    );
  }

  static getInitialProps = authInitialProps(true); // Require authentication
}
