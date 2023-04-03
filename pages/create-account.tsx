import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { User } from "../scripts/types";

export default function LoginPage({
  clientId,
  clientSecret,
  users,
  url,
}: {
  clientId: string;
  clientSecret: string;
  users: User[];
  url: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    // check if username is used and if it is a new user
    const userExists = users.find(
      (user: { username: string }) => user.username === username
    );

    if (userExists) {
      setErrorMessage("Username already exists");
      return;
    }

    // check if username and password is valid
    if (username.length < 3 || password.length < 3) {
      setErrorMessage(
        "Username and password must be at least 3 characters long"
      );
      return;
    }

    // create new user
    axios
      .post(`${url}/api/users`, {
        username: username,
        password: password,
        goals: [],
      })
      .then((response) => {
        setErrorMessage("Account created");
        router.push(
          `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${url}/data?_id=${response.data.data.insertedId}&approval_prompt=force&scope=activity:read_all,read,profile:read_all,read_all,activity:read_all,activity:read`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-800">
      <form className="px-4 py-6 bg-gray-700 rounded-lg shadow-lg run-field-sizing">
        <label className="block mb-4 text-lg font-bold" htmlFor="username">
          Username:
        </label>
        <input
          className="w-full px-3 py-2 mb-4 text-white bg-gray-800 rounded-md focus:outline-none focus:shadow-outline-blue"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block mb-4 text-lg font-bold" htmlFor="password">
          Password:
        </label>
        <input
          className="w-full px-3 py-2 mb-4 text-white bg-gray-800 rounded-md focus:outline-none focus:shadow-outline-blue"
          type="password"
          name="password"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
        <button
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleClick}
        >
          Create Account
        </button>
      </form>
      <Link
        className="px-4 py-2 mt-4 font-bold text-center text-white bg-gray-700 rounded-md run-field-sizing hover:bg-gray-600 focus:outline-none focus:shadow-outline"
        type="button"
        href="/login"
      >
        Login
      </Link>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const host = context.req.headers.host;
  const url = host.includes("localhost") ? "http://" : "https://";
  const fullUrl = url + host;
  let users = [] as any[];
  await axios
    .get(`${fullUrl}/api/users`)
    .then((response) => {
      users = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });

  return {
    props: {
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      users: users,
      url: fullUrl,
    },
  }
}
