import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import LoginData from "../scripts/logindata";

export default function LoginPage({clientID, url}: { clientID: string, url: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([] as any);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    // get list of users from server
    axios
      .get(`${url}/api/users`)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleClick() {
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
              `https://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${url}/data?_id=${response.data.data.insertedId}&approval_prompt=force&scope=activity:read_all`
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
    <div>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="button" onClick={handleClick}>
          {newUser ? "Create Account" : "Login"}
        </button>
      </form>

      <button type="button" onClick={() => setNewUser(!newUser)}>
        {newUser ? "Login" : "Create Account"}
      </button>
    </div>
  );
}

export function getServerSideProps(context: any) {
  const host = context.req.headers.host;
  const url = host.includes("localhost") ? "http://" : "https://";
  const fullUrl = url + host;
  return {
    props: {
      clientID: process.env.STRAVA_CLIENT_ID,
      url: fullUrl
    },
  };
}
