import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoginData from "../scripts/logindata";

interface Props {
  query: {
    code: string;
    _id: string;
  };
  clientID: string;
  clientSecret: string;
  url: string;
}

export async function getServerSideProps(
  context: any
): Promise<{ props: Props }> {
  const host = context.req.headers.host;
  const url = host.includes("localhost") ? "http://" : "https://";
  const fullUrl = url + host;
  return {
    props: {
      query: context.query,
      clientID: process.env.STRAVA_CLIENT_ID || "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET || "",
      url: fullUrl,
    },
  };
}

function AuthCallbackPage({ query, clientID, clientSecret, url }: Props) {
  const router = useRouter();
  const { _id } = query;
  console.log(_id);

  useEffect(() => {
    if (LoginData.isLoggedIn()) {
      console.log("already logged in");
      router.push("/");
      return;
    }
    async function fetchData() {
      try {
        const response = await axios.post(
          `https://www.strava.com/api/v3/oauth/token`,
          {
            client_id: clientID,
            client_secret: clientSecret,
            code: query.code,
            grant_type: "authorization_code",
          }
        );
        const { access_token, refresh_token, expires_at } = response.data;
        console.log(response.data)
        console.log(new Date(response.data.expires_at * 1000).toLocaleString())

        const updated = await axios.put(`${url}/api/users`, {
          _id: _id,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
        });

        LoginData.Login(access_token, updated.data.data[0].username);

        router.push("/");
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-bold text-white">Authenticating...</div>
    </div>
  )
}

export default AuthCallbackPage;
