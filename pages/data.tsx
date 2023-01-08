import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoginData from "../scripts/logindata";

const API_URL = "https://www.strava.com/api/v3";

interface Query {
  code: string;
}

interface Props {
  query: Query;
}

export async function getServerSideProps(
  context: any
): Promise<{ props: Props }> {
  return {
    props: {
      query: context.query,
    },
  };
}

function AuthCallbackPage({ query }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (LoginData.isLoggedIn()) {
        router.push("/");
        return;
    }
    async function fetchData() {
      console.log(query.code);
      try {
        const response = await axios.post(
          `https://www.strava.com/api/v3/oauth/token`,
          {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: query.code,
            grant_type: "authorization_code",
          }
        );
        const { access_token } = response.data;
        // Store the access token in a cookie or in a server-side session

        LoginData.Login(access_token);
        console.log(access_token);

        router.push("/");
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return <div>Authenticating...</div>;
}

export default AuthCallbackPage;
