import { useEffect, useState } from "react";
import HomePage from "../components/HomePage";
import LandingPage from "../components/LandingPage";
import LoginData from "../scripts/LoginData";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(LoginData.isLoggedIn());

  useEffect(() => {
    LoginData.getStorage();
    setLoggedIn(LoginData.isLoggedIn());
  }, []);
  
  return <div>{loggedIn ? <HomePage /> : <LandingPage />}</div>;
}
