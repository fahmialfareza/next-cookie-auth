import axios from "axios";
import Router from "next/router";
import { IncomingMessage, ServerResponse } from "http";

axios.defaults.withCredentials = true;

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

// Define a type for the user data
interface User {
  name?: string;
  email?: string;
  type?: string;
}

interface Auth {
  user: User | {};
}

// Get token from server-side cookies
export const getServerSideToken = (req: IncomingMessage): Auth => {
  const { signedCookies = {} } = req as any; // Express adds `signedCookies` to the `req` object
  if (!signedCookies.token) {
    return { user: {} };
  }
  return { user: signedCookies.token };
};

// Get token from client-side global window variable
export const getClientSideToken = (): Auth => {
  if (typeof window !== "undefined") {
    const user = (window as any)[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

// Generate script to add user data to the client-side
export const getUserScript = (user: User): string => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

// Redirect user to login if they are not authenticated
export const authInitialProps =
  (isProtectedRoute: boolean) =>
  ({ req, res }: { req?: IncomingMessage; res?: ServerResponse }) => {
    const auth = req ? getServerSideToken(req) : getClientSideToken();
    const currentPath = req ? req.url : window.location.pathname;
    const user = auth.user as User;
    const isAnonymous = !user || user.type !== "authenticated";

    if (isProtectedRoute && isAnonymous && currentPath !== "/login") {
      return redirectUser(res, "/login");
    }

    return { auth };
  };

// Redirect user based on server-side or client-side environment
const redirectUser = (res?: ServerResponse, path?: string): {} => {
  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
    return {};
  }
  Router.replace(path || "/login");
  return {};
};

// Login user by setting global user variable
export const loginUser = async (
  email: string,
  password: string
): Promise<void> => {
  const { data } = await axios.post("/api/login", { email, password });
  if (typeof window !== "undefined") {
    (window as any)[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

// Logout user by clearing global user variable
export const logoutUser = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    (window as any)[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await axios.post("/api/logout");
  Router.push("/login");
};

// Fetch user profile data
export const getUserProfile = async (): Promise<User> => {
  const { data } = await axios.get("/api/profile");
  return data;
};
