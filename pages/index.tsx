import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoginData from "../scripts/logindata";

export async function getStaticProps() {
  return {
    props: {
      clientId: process.env.STRAVA_CLIENT_ID || "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET || "",
    },
  };
}

type Props = {
  clientId: string;
  clientSecret: string;
};

export default function HomePage({ clientId, clientSecret }: Props) {
  const router = useRouter();

  const [data, setData] = useState(null as any);
  const [activities, setActivities] = useState([] as any);
  const [stats, setStats] = useState(null as any);
  const [showYear, setShowYear] = useState(false);
  const [showShoes, setShowShoes] = useState(false);

  const accessToken = LoginData.getAccessToken();

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      router.push("/login");
      return;
    }
    const cachedData = localStorage.getItem("data");
    const cachedActivities = localStorage.getItem("activities");
    const cachedStats = localStorage.getItem("stats");
    const expirationTime = localStorage.getItem("expirationTime");

    if (
      cachedData &&
      cachedActivities &&
      cachedStats &&
      expirationTime &&
      Date.now() < +expirationTime
    ) {
      setData(JSON.parse(cachedData));
      setStats(JSON.parse(cachedStats));
      setActivities(JSON.parse(cachedActivities));
      return;
    }

    async function fetchData() {
      try {
        const response = await axios.get(
          `https://www.strava.com/api/v3/athlete`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(response.data);
        localStorage.setItem("data", JSON.stringify(response.data));
        getStats(response.data.id);
        console.log(response.data);
      } catch (error: any) {
        console.log(error);
      }
    }

    async function getLoggedInAthleteActivities(page: number, perPage: number) {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      };

      const params = {
        page,
        per_page: perPage,
      };

      try {
        const response = await axios.get(
          `https://www.strava.com/api/v3/athlete/activities`,
          {
            headers,
            params,
          }
        );
        const { data } = response;

        setActivities(data);
        localStorage.setItem("activities", JSON.stringify(data));
        console.log(data);
      } catch (error: any) {
        console.log(error);
      }
    }

    async function getStats(id: string) {
      try {
        const response = await axios.get(
          `https://www.strava.com/api/v3/athletes/${id}/stats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStats(response.data);
        localStorage.setItem("stats", JSON.stringify(response.data));
      } catch (error: any) {
        console.log(error);
      }
    }

    getLoggedInAthleteActivities(1, 30);
    fetchData();
    const newExpirationTime = Date.now() + 240 * 1000; // 15 minutes from now
    localStorage.setItem("expirationTime", newExpirationTime.toString());
  }, []);

  if (!LoginData.isLoggedIn()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-white">Redirecting...</div>
      </div>
    );
  }

  if (!data || !stats || !activities) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-xl font-bold mt-4 text-center text-white">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center bg-gray-800 text-white">
      <div className="bg-gray-700 run-field-sizing p-8 flex flex-row justify-between flex-wrap mt-8 rounded-md">
        <h1 className="text-3xl font-bold text-center w-full mb-8">
          Strava Data
        </h1>
        <div className="flex flex-col justify-evenly">
          <p>First name: {data.firstname}</p>
          <p>Last name: {data.lastname}</p>
          <p>Followers: {data.follower_count}</p>
          <p>Friends: {data.friend_count}</p>
        </div>
        <img src={data.profile} className="w-32 h-32 rounded-full" />
        <button className="bg-gray-600 p-2 rounded-md w-full mt-4" onClick={() => setShowShoes(!showShoes)}>
          {showShoes ? "Hide" : "Show"} Shoes
        </button>
        {showShoes && (
          <ul className="flex flex-col justify-evenly mt-2">
            {data.shoes.map((shoe: any) => (
              <li key={shoe.id} className="mt-2">
                <p>Name: {shoe.name}</p>
                <p>Distance: {shoe.converted_distance} miles</p>
              </li>
            ))}
            </ul>
        )}
      </div>
      <div className="bg-gray-700 run-field-sizing p-8 flex flex-row justify-between flex-wrap mt-4 rounded-md">
        <h2 className="text-3xl font-bold text-center w-full mb-8">
          {showYear ? "Yearly" : "Lifetime"} Stats
        </h2>
        <div className="flex flex-col justify-evenly">
          {showYear ? (
            <>
              <p>
                Distance:{" "}
                {Math.round((stats.ytd_run_totals.distance / 1609.34) * 100) /
                  100}{" "}
                Miles
              </p>
              <p>
                Time:{" "}
                {Math.round((stats.ytd_run_totals.moving_time / 3600) * 100) /
                  100}{" "}
                Hours
              </p>
              <p>Runs: {stats.ytd_run_totals.count}</p>
              <p>
                Average Pace:{" "}
                {outTime(
                  stats.ytd_run_totals.moving_time /
                    (stats.ytd_run_totals.distance / 1609.34)
                )}
              </p>
            </>
          ) : (
            <>
              <p>
                Distance:{" "}
                {Math.round((stats.all_run_totals.distance / 1609.34) * 100) /
                  100}{" "}
                Miles
              </p>
              <p>
                Time:{" "}
                {Math.round((stats.all_run_totals.elapsed_time / 3600) * 100) /
                  100}{" "}
                Hours
              </p>
              <p>Runs: {stats.all_run_totals.count}</p>
              <p>
                Average Pace:{" "}
                {outTime(
                  stats.all_run_totals.moving_time /
                    (stats.all_run_totals.distance / 1609.34)
                )}
              </p>
            </>
          )}
        </div>
        <button
          className="bg-gray-600 mt-4 p-2 rounded-md w-full"
          onClick={() => setShowYear(!showYear)}
        >
          Toggle
        </button>
      </div>
      <ul className="list-none">
        {activities.map((activity: any) => (
          <li
            className="run-field-sizing my-4 bg-gray-700 p-4 rounded-md"
            key={activity.id}
          >
            <Link href={`/activity/${activity.id}`} className="w-full h-full">
              <h2 className="mb-2 text-center text-lg">{activity.name}</h2>
              <p className="mb-2 text-center">
                Distance:{" "}
                {Math.round((activity.distance / 1609.34) * 100) / 100} Miles
              </p>
              <p className="mb-2 text-center">
                Time: {outTime(activity.moving_time)}
              </p>
              <p className="mb-2 text-center">
                Pace:{" "}
                {outTime(activity.moving_time / (activity.distance / 1609.34))}
              </p>
              <p className="mb-2 text-center">
                Date:{" "}
                {new Date(activity.start_date_local).toLocaleDateString() +
                  " " +
                  new Date(activity.start_date_local).toLocaleTimeString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function outTime(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 60) * 10) / 10;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? "0" : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
