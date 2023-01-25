import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import LoginData from "../scripts/logindata";
import Link from "next/link";
import { User } from "../types";

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
          `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${url}/data?_id=${response.data.data.insertedId}&approval_prompt=force&scope=activity:read_all,read,profile:read_all,read_all`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white h-screen">
      <form className="run-field-sizing py-6 px-4 bg-gray-700 rounded-lg shadow-lg">
        <label className="block font-bold text-lg mb-4" htmlFor="username">
          Username:
        </label>
        <input
          className="w-full py-2 px-3 rounded-md text-white bg-gray-800 focus:outline-none mb-4 focus:shadow-outline-blue"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block font-bold text-lg mb-4" htmlFor="password">
          Password:
        </label>
        <input
          className="w-full mb-4 py-2 px-3 rounded-md text-white bg-gray-800 focus:outline-none focus:shadow-outline-blue"
          type="password"
          name="password"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <button
          className="w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleClick}
        >
          Create Account
        </button>
      </form>
      <Link
        className="mt-4 run-field-sizing py-2 px-4 rounded-md text-center bg-gray-700 hover:bg-gray-600 text-white font-bold focus:outline-none focus:shadow-outline"
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
  };
}
