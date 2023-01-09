import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoginData from "../scripts/logindata";

const API_URL = "https://www.strava.com/api/v3";

export default function HomePage() {
  const router = useRouter();

  const [data, setData] = useState(null as any);
  const [activities, setActivities] = useState([] as any);

  const accessToken = LoginData.getAccessToken();

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      router.push("/login");
      return;
    }
    const cachedData = localStorage.getItem("data");
    const cachedActivities = localStorage.getItem("activities");
    const expirationTime = localStorage.getItem("expirationTime");

    if (cachedData && cachedActivities && expirationTime && Date.now() < +expirationTime) {
      setData(JSON.parse(cachedData));
      setActivities(JSON.parse(cachedActivities));
      return;
    }

    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}/athlete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data);
        localStorage.setItem("data", JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
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
        const response = await axios.get(`${API_URL}/athlete/activities`, {
          headers,
          params,
        });
        const { data } = response;

        setActivities(data);
        console.table(data[0]);
        localStorage.setItem("activities", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }

    getLoggedInAthleteActivities(1, 30);
    fetchData();
    const newExpirationTime = Date.now() + 240 * 1000; // 15 minutes from now
    localStorage.setItem("expirationTime", newExpirationTime.toString());

  }, []);

  if (!LoginData.isLoggedIn()) {
    return <div>Redirecting...</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans flex flex-col items-center bg-gray-800 text-white">
      <div className="bg-gray-700 run-field-sizing p-8 flex flex-row justify-between flex-wrap mt-8">
        <h1 className="text-3xl font-bold text-center w-full mb-8">
          Strava Data
        </h1>
        <div className="flex flex-col justify-evenly">
          <p className="my-4">First name: {data.firstname}</p>
          <p className="my-4">Last name: {data.lastname}</p>
        </div>
        <img src={data.profile} className="w-32 h-32 rounded-full" />
      </div>
      <ul className="list-none">
        {activities.map((activity: any) => (
          <li
            className="run-field-sizing my-4 bg-gray-700 p-4 rounded-md"
            key={activity.id}
          >
            <h2 className="mb-2 text-center text-lg">{activity.name}</h2>
            <p className="mb-2 text-center">
              Distance: {Math.round((activity.distance / 1609.34) * 100) / 100}{" "}
              Miles
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
