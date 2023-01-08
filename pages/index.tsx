import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoginData from "../scripts/logindata";

const API_URL = "https://www.strava.com/api/v3";

function HomePage() {
  if (!LoginData.isLoggedIn()) {
    return (
      <div>
        You are not logged in. Click <Link href="/login">here</Link> to log in.
      </div>
    );
  }

  const accessToken = LoginData.getAccessToken();

  const [data, setData] = useState(null as any);
  const [activities, setActivities] = useState([] as any);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}/athlete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data);
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
      } catch (error) {
        console.error(error);
      }
    }

    getLoggedInAthleteActivities(1, 30);

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans flex flex-col items-center bg-gray-800 text-white">
      <div className="bg-gray-700 run-field-sizing p-8 flex flex-row justify-between flex-wrap mt-8">
        <h1 className="text-3xl font-bold text-center w-full mb-8">Strava Data</h1>
        <div>
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
            <h2 className="mb-2 text-center">Name: {activity.name}</h2>
            <p className="mb-2 text-center">Distance: {activity.distance}</p>
            <p className="mb-2 text-center">Time: {activity.moving_time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
