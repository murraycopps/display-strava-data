import { useEffect, useState } from "react";

export default function ActivityPage({ pid }: { pid: string }) {
  const [activity, setActivity] = useState(null as any);

  useEffect(() => {
    setActivity(
      JSON.parse(localStorage.getItem("activities") || "[]").find(
        (activity: any) => activity.id == pid
      )
    );
  }, []);

  useEffect(() => {
    console.log(activity);
  }, [activity]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-white text-2xl">Activity Page</h1>
      {activity && (
        <div className="run-field-sizing my-4 bg-gray-700 p-4 rounded-md text-white">
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
            {new Date(activity.start_date).toLocaleDateString() +
              " " +
              new Date(activity.start_date).toLocaleTimeString()}
          </p>
          <p className="mb-2 text-center">
            Average Heartrate: {activity.average_heartrate}
          </p>
          <p className="mb-2 text-center">
            Max Heartrate: {activity.max_heartrate}
          </p>
            <p className="mb-2 text-center">
            Average Speed: {activity.average_speed}
            </p>
            <p className="mb-2 text-center">
            Max Speed: {activity.max_speed}
            </p>
            <p className="mb-2 text-center">
                Cadence: {activity.average_cadence * 2}
            </p>
            <p className="mb-2 text-center">
                Number of Strides: {Math.round(activity.average_cadence * activity.moving_time / 30)}
            </p>
            <p className="mb-2 text-center">
                Stride Length: {Math.round(activity.average_speed / (activity.average_cadence / 30) * 100) / 100}
            </p>
            <p className="mb-2 text-center">
                Max Speed: {activity.max_speed}
            </p>
            <p className="mb-2 text-center">
                Max Heartrate (BPM): {activity.max_heartrate}
            </p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const host = context.req.headers.host;
  const url = host.includes("localhost") ? "http://" : "https://";
  const fullUrl = url + host;
  const { pid } = context.query;
  return {
    props: {
      query: context.query,
      clientID: process.env.STRAVA_CLIENT_ID || "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET || "",
      url: fullUrl,
      pid: pid,
    },
  };
}

function outTime(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 60) * 10) / 10;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? "0" : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
