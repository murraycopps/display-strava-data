import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import LoginData from "../scripts/logindata";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([] as any);

  useEffect(() => {
    // get list of users from server
    axios
      .get("http://localhost:3000/api/users")
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
    if (user) {
        router.push(
          `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/data&approval_prompt=force&scope=activity:read_all`
        );
      LoginData.Login(user.accessToken);
      router.push("/");
    } else {
      setErrorMessage("Invalid username or password");
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
          Login
        </button>
      </form>
    </div>
  );
}
