import { NextPage } from "next";
import Layout from "../components/Layout";
import Link from "next/link";
import { authInitialProps } from "../lib/auth";

interface IndexProps {
  auth?: {
    user?: {
      name?: string;
      email?: string;
      type?: string;
    };
  };
}

const Index: NextPage<IndexProps> = (props) => {
  return (
    <Layout title="Home" {...props}>
      <Link href="/profile">
        <a>Go to profile</a>
      </Link>
    </Layout>
  );
};

Index.getInitialProps = authInitialProps(false); // Set to `true` if the route is protected

export default Index;
