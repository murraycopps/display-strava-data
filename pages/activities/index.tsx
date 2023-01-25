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
import LoginData from "../../scripts/logindata";

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
      router.push("/landing");
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
    <div className="font-sans flex lg:flex-row flex-col lg:items-start items-center bg-gray-800 text-white gap-4">
      <div className="profile-sizing flex flex-col pt-8 lg:h-screen h-auto overflow-x-hidden">
        <div className="bg-gray-700 p-8 mb-4 gap-4 rounded-md flex flex-row flex-wrap lg:ml-4">
          <div className="flex-grow sm:h-36 h-28 flex flex-col justify-between sm:pb-4">
            <h1 className="sm:text-4xl text-2xl font-bold text-center w-full sm:mb-4">
              {data.firstname} {data.lastname}
            </h1>
            <div className="flex flex-row text-center justify-center gap-4 sm:gap-8">
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
            className="sm:w-36 sm:h-36 w-28 h-28 rounded-full"
            alt="Profile Picture"
          />
          <h2 className="text-xl font-bold text-center w-full">
            {showYear ? "Yearly" : "Lifetime"} Stats
          </h2>
          <div className="grid sm:grid-cols-4 grid-cols-2 w-full gap-8">
            <div className="flex items-center justify-start gap-2 flex-col">
              <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
              <p className="text-lg">
                {Math.round(usedStats.distance / 1609.34)} Mi
              </p>
            </div>
            <div className="flex items-center justify-start gap-2 flex-col">
              <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
              <p className="text-lg">
                {Math.round((usedStats.moving_time / 3600) * 10) / 10} Hrs
              </p>
            </div>
            <div className="flex items-center justify-start gap-2 flex-col">
              <FontAwesomeIcon icon={faTachometerAlt} className="w-12 h-12" />{" "}
              <p className="text-lg">{usedStats.count} Runs</p>
            </div>
            <div className="flex items-center justify-start gap-2 flex-col">
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
            className="bg-gray-600 hover:bg-gray-500 mt-4 p-2 rounded-md w-full"
            onClick={() => setShowYear(!showYear)}
          >
            Toggle
          </button>
        </div>
        <div className="bg-gray-700 p-8 gap-4 rounded-md flex flex-row flex-wrap lg:ml-4">
          <button
            className="bg-gray-600 p-2 hover:bg-gray-500 rounded-md w-full"
            onClick={() => setShowShoes(!showShoes)}
          >
            {showShoes ? "Hide" : "Show"} Shoes
          </button>
          {showShoes && (
            <ul className="flex flex-col justify-evenly w-full">
              {data.shoes.map((shoe: any) => (
                <li
                  key={shoe.id}
                  className="mt-4 flex flex-row justify-between text-lg"
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
        <p className="bg-gray-700 p-4 text-lg mt-4 text-center rounded-t-lg ml-4 hidden lg:block">Icons by FontAwesome</p>
      </div>
      <div className="flex-grow flex justify-center w-full lg:w-auto lg:h-screen relative py-8 overflow-x-hidden">
        <ul className="list-none run-field-sizing sm:h-full">
          {activities.map((activity: any) => (
            <li className=" mb-4 bg-gray-700 p-4 rounded-md" key={activity.id}>
              <Link
                href={`/activities/${activity.id}`}
                className="w-full h-full grid grid-cols-2"
              >
                <div className="grid grid-rows-2 items-center ">
                  <h2 className="text-center sm:text-3xl text-xl truncate w-full two-lines">
                    {activity.name}
                  </h2>
                  <p className=" text-center text-md">
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
                    <div className="flex items-center justify-start gap-2 flex-col">
                      <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
                      <p className="text-lg">
                        {Math.round((activity.distance / 1609.34) * 100) / 100}{" "}
                        Mi
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2 flex-col">
                      <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
                      <p className="text-lg">
                        {outTime(activity.moving_time)} Mins
                      </p>
                    </div>
                  </div>
                  <div className="flex grow flex-col justify-center">
                    <div className="flex items-center justify-start gap-2 flex-col">
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
      </div>
    </div>
  );
}

function outTime(time: number, precision: number = 1): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 60) * 10 ** precision) / 10 ** precision;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? "0" : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}