import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import LoginData from "../scripts/logindata";

export default function LoginPage({
  clientId,
  clientSecret,
  users,
  url,
}: {
  clientId: string;
  clientSecret: string;
  users: any[];
  url: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newUser, setNewUser] = useState(false);

  async function handleClick() {
    // check if username and password are valid
    const user = users.find(
      (user: { username: string; password: string }) =>
        user.username === username && user.password === password
    );

    // check if username is used and if it is a new user
    const userExists = users.find(
      (user: { username: string }) => user.username === username
    );

    if (newUser && userExists) {
      setErrorMessage("Username already exists");
      return;
    }

    if (user) {
      // check if user.expiresAt is in the past
      console.log(new Date(user.expiresAt * 1000).toLocaleString())
      if (new Date(user.expiresAt * 1000) < new Date()) {
        // refresh token
        const response = await axios.post(
          `https://www.strava.com/api/v3/oauth/token`,
          {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "refresh_token",
            refresh_token: user.refreshToken,
          }
        );
        const { access_token, refresh_token, expires_at } = response.data;
        console.log(response.data);
        console.log(new Date(response.data.expires_at * 1000).toLocaleString());


        axios.put(`${url}/api/users`, {
          _id: user._id,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
        });

        LoginData.Login(access_token);

        router.push("/");
        return
      }
      LoginData.Login(user.accessToken);

      router.push("/");
    } else {
      if (newUser) {
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
      } else {
        setErrorMessage("Incorrect username or password");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white h-screen">
      <form className="w-1/3 py-6 px-4 bg-gray-700 rounded-lg shadow-lg">
        <label className="block font-bold text-lg mb-2" htmlFor="username">
          Username:
        </label>
        <input
          className="w-full py-2 px-3 rounded-md text-white bg-gray-800 focus:outline-none mb-2 focus:shadow-outline-blue"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block font-bold text-lg mb-2" htmlFor="password">
          Password:
        </label>
        <input
          className="w-full mb-2 py-2 px-3 rounded-md text-white bg-gray-800 focus:outline-none focus:shadow-outline-blue"
          type="password"
          name="password"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <button
          className="w-full py-2 px-4 rounded-md bg-blue-500 text-white font-bold focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleClick}
        >
          {newUser ? "Create Account" : "Login"}
        </button>
      </form>

      <button
        className="mt-4 w-1/3 py-2 px-4 rounded-md bg-gray-600 text-white font-bold focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => setNewUser(!newUser)}
      >
        {newUser ? "Login" : "Create Account"}
      </button>
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
