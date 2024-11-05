import { NextPage } from "next";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import { authInitialProps } from "../lib/auth";

interface LoginProps {
  auth?: {
    user?: {
      name?: string;
      email?: string;
      type?: string;
    };
  };
}

const Login: NextPage<LoginProps> = (props) => {
  return (
    <Layout title="Login" {...props}>
      <LoginForm />
    </Layout>
  );
};

Login.getInitialProps = authInitialProps(false); // Set to `true` if the route is protected

export default Login;
