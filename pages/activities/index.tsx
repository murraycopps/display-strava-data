import {
  faClock,
  faRuler,
  faRunning,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { outTime } from "../../scripts";
import LoginData from "../../scripts/LoginData";

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
  const [usedStats, setUsedStats] = useState([] as any);

  const accessToken = LoginData.getAccessToken();

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      router.push("/");
      return;
    }
    const cachedData = localStorage.getItem("data");
    const cachedActivities = localStorage.getItem("activities");
    const cachedStats = localStorage.getItem("stats");
    const expirationTime = localStorage.getItem("expirationTime");
    const cachedUsername = localStorage.getItem("username");

    if (
      cachedData &&
      cachedActivities &&
      cachedStats &&
      expirationTime &&
      cachedUsername === LoginData.getUsername() &&
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
    localStorage.setItem("username", LoginData.getUsername());
    console.log(LoginData.getUsername());
  }, [accessToken, router]);

  useEffect(() => {
    if (!stats) return;
    setUsedStats(showYear ? stats.ytd_run_totals : stats.all_run_totals);
  }, [stats, showYear]);

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
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="mt-4 text-xl font-bold text-center text-white">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 font-sans text-white bg-gray-800 lg:flex-row lg:items-start">
      <div className="flex flex-col h-auto pt-8 overflow-x-hidden profile-sizing lg:h-screen">
        <div className="flex flex-row flex-wrap gap-4 p-8 mb-4 bg-gray-700 rounded-md lg:ml-4">
          <div className="flex flex-col justify-between flex-grow sm:h-36 h-28 sm:pb-4">
            <h1 className="w-full text-2xl font-bold text-center sm:text-4xl sm:mb-4">
              {data.firstname} {data.lastname}
            </h1>
            <div className="flex flex-row justify-center gap-4 text-center sm:gap-8">
              <div>
                Followers:
                <p className="text-2xl font-bold">{data.follower_count}</p>
              </div>
              <div>
                Friends:
                <p className="text-2xl font-bold">{data.friend_count}</p>
              </div>
            </div>
          </div>
          <img
            src={data.profile}
            className="rounded-full sm:w-36 sm:h-36 w-28 h-28"
            alt="Profile Picture"
          />
          <h2 className="w-full text-xl font-bold text-center">
            {showYear ? "Yearly" : "Lifetime"} Stats
          </h2>
          <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-start gap-2">
              <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
              <p className="text-lg">
                {Math.round(usedStats.distance / 1609.34)} Mi
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
              <p className="text-lg">
                {Math.round((usedStats.moving_time / 3600) * 10) / 10} Hrs
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <FontAwesomeIcon icon={faTachometerAlt} className="w-12 h-12" />{" "}
              <p className="text-lg">{usedStats.count} Runs</p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <FontAwesomeIcon icon={faRunning} className="w-12 h-12" />{" "}
              <p className="text-lg text-center">
                {outTime(
                  usedStats.moving_time / (usedStats.distance / 1609.34),
                  0
                )}
              </p>
            </div>
          </div>
          <button
            className="w-full p-2 mt-4 bg-gray-600 rounded-md hover:bg-gray-500"
            onClick={() => setShowYear(!showYear)}
          >
            Toggle
          </button>
        </div>
        <div className="flex flex-row flex-wrap gap-4 p-8 bg-gray-700 rounded-md lg:ml-4">
          <button
            className="w-full p-2 bg-gray-600 rounded-md hover:bg-gray-500"
            onClick={() => setShowShoes(!showShoes)}
          >
            {showShoes ? "Hide" : "Show"} Shoes
          </button>
          {showShoes && (
            <ul className="flex flex-col w-full justify-evenly">
              {data.shoes.map((shoe: any) => (
                <li
                  key={shoe.id}
                  className="flex flex-row justify-between mt-4 text-lg"
                >
                  <h2>{shoe.name}</h2>

                  <p>
                    {" "}
                    <FontAwesomeIcon icon={faRunning} className="ml-2" />{" "}
                    {shoe.converted_distance} Mi
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:grow"></div>
        <p className="hidden p-4 mt-4 ml-4 text-lg text-center bg-gray-700 rounded-t-lg lg:block">
          Icons by FontAwesome
        </p>
      </div>
      <main className="relative flex justify-center flex-grow w-full py-8 overflow-x-hidden lg:w-auto lg:h-screen">
        <ul className="list-none run-field-sizing sm:h-full">
          {activities.map((activity: any) => (
            <li className="p-4 mb-4 bg-gray-700 rounded-md " key={activity.id}>
              <Link
                href={`/activities/${activity.id}`}
                className="grid w-full h-full grid-cols-2"
              >
                <div className="grid items-center grid-rows-2 ">
                  <h2 className="w-full text-xl text-center truncate sm:text-3xl two-lines">
                    {activity.name}
                  </h2>
                  <p className="text-center text-md">
                    {new Date(activity.start_date_local).toLocaleDateString() +
                      " " +
                      new Date(activity.start_date_local).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col items-center justify-start gap-2">
                      <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
                      <p className="text-lg">
                        {Math.round((activity.distance / 1609.34) * 100) / 100}{" "}
                        Mi
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-start gap-2">
                      <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
                      <p className="text-lg">
                        {outTime(activity.moving_time)} Mins
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center grow">
                    <div className="flex flex-col items-center justify-start gap-2">
                      <FontAwesomeIcon icon={faRunning} className="w-12 h-12" />{" "}
                      <p className="text-lg text-center">
                        {outTime(
                          activity.moving_time / (activity.distance / 1609.34),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <div className="p-8 mt-8 mr-4 bg-gray-700 right-row-sizing">
        <h2 className="text-2xl text-center">Goals</h2>
        <div className="flex flex-col gap-4">
          {LoginData.getGoals().length ? (
            LoginData.getGoals().map((goal: any) => (
              <div
                key={goal.id}
                className="flex flex-row justify-between p-4 bg-gray-600 rounded-md"
              >
                <div className="flex flex-col justify-center">
                  <h2 className="text-lg">{goal.name}</h2>
                  <p className="text-sm">{goal.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No Goals</p>
          )}
          <Link href="/goals"
            className="p-2 text-center bg-gray-600 rounded-md"
          >
            Manage Goals
          </Link>
          
        </div>
      </div>
    </div>
  );
}


