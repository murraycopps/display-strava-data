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
import React from "react";
import { useState, useEffect } from "react";
import { outTime } from "../scripts";
import LoginData from "../scripts/logindata";
import ProfileCard from "./ProfileCard";
import RunList from "./RunList";

export default function HomePage() {
  const router = useRouter();

  const [data, setData] = useState(null as any);
  const [activities, setActivities] = useState([] as any);
  const [stats, setStats] = useState(null as any);

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

        setActivities(data.filter((activity: any) => activity.type === "Run"));
        localStorage.setItem("activities", JSON.stringify(data.filter((activity: any) => activity.type === "Run")))
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

    getLoggedInAthleteActivities(1, 60);
    fetchData();
    const newExpirationTime = Date.now() + 240 * 1000; // 15 minutes from now
    localStorage.setItem("expirationTime", newExpirationTime.toString());
    localStorage.setItem("username", LoginData.getUsername());
    console.log(LoginData.getUsername());
  }, [accessToken, router]);

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
      <ProfileCard data={data} stats={stats} />
      <RunList activities={activities} />
      {/* <div className="p-8 mt-8 mr-4 bg-gray-700 right-row-sizing">
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
          <Link
            href="/goals"
            className="p-2 text-center bg-gray-600 rounded-md"
          >
            Manage Goals
          </Link>
        </div>
      </div> */}
    </div>
  );
}
