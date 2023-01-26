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
import { outTime } from "../../scripts";
import LoginData from "../../scripts/logindata";

export default function ActivityPage({ pid }: { pid: string }) {
  const [activity, setActivity] = useState(null as any);
  const router = useRouter();

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      router.push("/");
      return;
    }

    setActivity(
      JSON.parse(localStorage.getItem("activities") || "[]").find(
        (activity: any) => activity.id == pid
      )
    );
  }, [pid, router]);

  useEffect(() => {
    console.log(activity);
  }, [activity]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {activity ? (
        <section className="flex flex-col gap-16 p-2 py-8 text-white bg-gray-700 rounded-lg single-run-field-sizing">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid items-center grid-rows-2">
              <h1 className="text-3xl text-center">{activity.name}</h1>
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
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
                <p className="text-lg">
                  {Math.round((activity.distance / 1609.34) * 100) / 100} Mi
                </p>
              </div>
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
                <p className="text-lg">{outTime(activity.moving_time)}</p>
              </div>
              <div className="flex flex-col items-center justify-start gap-4">
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 gap-y-16">
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faHeart} className="w-12 h-12" />{" "}
                <div className="grid w-full grid-cols-2">
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-xl text-center">
                      {Math.round(activity.average_heartrate * 100) / 100 ||
                        "--"}
                    </p>
                    <p className="text-sm text-center">BPM</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Max</p>
                    <p className="text-xl text-center">
                      {Math.round(activity.max_heartrate * 100) / 100 || "--"}
                    </p>
                    <p className="text-sm text-center">BPM</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start gap-4">
                <FontAwesomeIcon icon={faGaugeHigh} className="w-12 h-12" />{" "}
                <div className="grid w-full grid-cols-2">
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-xl text-center">
                      {activity.average_speed
                        ? Math.round(activity.average_speed * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-sm text-center">MPH</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Max</p>
                    <p className="text-xl text-center">
                      {activity.max_speed
                        ? Math.round(activity.max_speed * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-sm text-center">MPH</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-start col-span-2 gap-4 sm:col-span-1 ">
                <FontAwesomeIcon icon={faRunning} className="w-12 h-12" />{" "}
                <div className="grid w-full grid-cols-5 sm:grid-cols-3">
                  <div className="sm:hidden"></div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Average</p>
                    <p className="text-xl text-center">
                      {activity.average_cadence
                        ? Math.round(activity.average_cadence * 100) / 100
                        : "--"}
                    </p>
                    <p className="text-sm text-center">SPM</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Total</p>
                    <p className="text-xl text-center">
                      {activity.average_cadence
                        ? Math.round(
                            (activity.average_cadence * activity.moving_time) /
                              30
                          )
                        : "--"}
                    </p>
                    <p className="text-sm text-center">Steps</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-center text-md">Length</p>
                    <p className="text-xl text-center">
                      {activity.average_cadence
                        ? Math.round(
                            (activity.average_speed /
                              (activity.average_cadence / 30)) *
                              100
                          ) / 100
                        : "--"}
                    </p>
                    <p className="text-sm text-center">Meters</p>
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
        className="fixed p-4 bg-white rounded-full bottom-4 right-4"
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
