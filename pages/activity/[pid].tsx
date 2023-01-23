import {
  faRuler,
  faClock,
  faRunning,
  faHeart,
  faGaugeHigh,
  faSpinner,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginData from "../../scripts/logindata";

export default function ActivityPage({ pid }: { pid: string }) {
  const [activity, setActivity] = useState(null as any);
  const router = useRouter();

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      router.push("/login");
      return;
    }

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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {activity ? (
        <section className="flex flex-col text-white single-run-field-sizing rounded-lg bg-gray-700 py-8 gap-16 p-2">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="grid grid-rows-2 items-center">
              <h1 className="text-center text-3xl">{activity.name}</h1>
              <h2 className="text-center text-md">
                {new Date(activity.start_date_local).toLocaleDateString() +
                  " " +
                  new Date(activity.start_date_local).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
              </h2>
            </div>
            <div className="grid grid-cols-3 sm:col-span-2 ">
              <div className="flex items-center justify-start gap-4 flex-col">
                <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
                <p className="text-lg">
                  {Math.round((activity.distance / 1609.34) * 100) / 100} Mi
                </p>
              </div>
              <div className="flex items-center justify-start gap-4 flex-col">
                <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
                <p className="text-lg">{outTime(activity.moving_time)}</p>
              </div>
              <div className="flex items-center justify-start gap-4 flex-col">
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
          {activity.average_heartrate ||
          activity.max_speed ||
          activity.average_cadence ? (
            <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 gap-y-16">
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faHeart} className="w-12 h-12" />{" "}
                <div className="grid grid-cols-2 w-full">
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-center text-xl">
                      {Math.round(activity.average_heartrate * 100) / 100 ||
                        "--"}
                    </p>
                    <p className="text-center text-sm">BPM</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Max</p>
                    <p className="text-center text-xl">
                      {Math.round(activity.max_heartrate * 100) / 100 || "--"}
                    </p>
                    <p className="text-center text-sm">BPM</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faGaugeHigh} className="w-12 h-12" />{" "}
                <div className="grid grid-cols-2 w-full">
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-center text-xl">
                      {activity.average_speed
                        ? Math.round(activity.average_speed * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-center text-sm">MPH</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Max</p>
                    <p className="text-center text-xl">
                      {activity.max_speed
                        ? Math.round(activity.max_speed * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-center text-sm">MPH</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start gap-4 sm:col-span-1 col-span-2  ">
                <FontAwesomeIcon icon={faRunning} className="w-12 h-12" />{" "}
                <div className="grid sm:grid-cols-3 grid-cols-5 w-full">
                  <div className="sm:hidden"></div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-center text-xl">
                      {activity.average_cadence
                        ? Math.round(activity.average_cadence * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-center text-sm">SPM</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Total</p>
                    <p className="text-center text-xl">
                      {activity.average_cadence
                        ? Math.round(
                            (activity.average_cadence * activity.moving_time) /
                              30
                          )
                        : "--"}
                    </p>
                    <p className="text-center text-sm">Steps</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Length</p>
                    <p className="text-center text-xl">
                      {activity.average_cadence
                        ? Math.round(
                            (activity.average_speed /
                              (activity.average_cadence / 30)) *
                              100
                          ) / 100
                        : "--"}
                    </p>
                    <p className="text-center text-sm">Meters</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-2xl">No Data</p>
            </div>
          )}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 text-white">
          <p className="text-2xl">Loading...</p>
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-12 h-12 animate-spin"
          />
        </section>
      )}
      <button
        className="fixed bottom-4 right-4 bg-white rounded-full p-4"
        onClick={() => {
          router.back();
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
      </button>
    </main>
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

function outTime(time: number, precision: number = 1): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 60) * 10 ** precision) / 10 ** precision;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? "0" : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
