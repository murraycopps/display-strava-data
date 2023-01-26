import HomePage from "../components/HomePage";
import LandingPage from "../components/LandingPage";
import LoginData from "../scripts/logindata";

export default function Page() {
  return <div>{LoginData.isLoggedIn() ? <HomePage /> : <LandingPage />}</div>;
}
