import next from "next";
import express, { Request, Response } from "express";
import axios from "axios";
import cookieParser from "cookie-parser";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const AUTH_USER_TYPE = "authenticated";
const COOKIE_SECRET = "asldkfjals23ljk";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true,
};

// Define a User type
interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

// Define a type for the authenticated user data
interface AuthenticatedUser {
  name: string;
  email: string;
  type: string;
}

// Authentication function with type annotations
const authenticate = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  const { data } = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data.find((user) => user.email === email && user.website === password);
};

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(cookieParser(COOKIE_SECRET));

  // Login endpoint
  // @ts-ignore
  server.post("/api/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authenticate(email, password);
    if (!user) {
      return res.status(403).send("Invalid email or password");
    }
    const userData: AuthenticatedUser = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE,
    };
    res.cookie("token", userData, COOKIE_OPTIONS);
    res.json(userData);
  });

  // Logout endpoint
  server.post("/api/logout", (req: Request, res: Response) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.sendStatus(204);
  });

  // Profile endpoint
  // @ts-ignore
  server.get("/api/profile", async (req: Request, res: Response) => {
    const { signedCookies = {} } = req;
    const token = signedCookies.token as AuthenticatedUser | undefined;
    if (token && token.email) {
      const { data } = await axios.get<User[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      const userProfile = data.find((user) => user.email === token.email);
      return res.json({ user: userProfile });
    }
    res.sendStatus(404);
  });

  // Next.js request handler
  server.get("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`Listening on PORT ${port}`);
  });
});
