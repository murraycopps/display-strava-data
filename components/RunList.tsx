import { faRuler, faClock, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FC } from "react";
import { outTime } from "../scripts";

export default function RunList({ activities }: any) {
  return (
    <main className="relative flex justify-center flex-grow w-full py-8 overflow-x-hidden lg:w-auto lg:h-screen">
      <ul className="list-none run-field-sizing sm:h-full">
        {activities.map((activity: any) => (
          <li className="p-4 mb-4 bg-gray-700 rounded-md " key={activity.id}>
            <Run activity={activity} />
          </li>
        ))}
      </ul>
    </main>
  );
}

const Run: FC<{ activity: any }> = ({ activity }) => (
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
          new Date(activity.start_date_local).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
      </p>
    </div>
    <div className="grid gap-4">
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center justify-start gap-2">
          <FontAwesomeIcon icon={faRuler} className="w-12 h-12" />{" "}
          <p className="text-lg">
            {Math.round((activity.distance / 1609.34) * 100) / 100} Mi
          </p>
        </div>
        <div className="flex flex-col items-center justify-start gap-2">
          <FontAwesomeIcon icon={faClock} className="w-12 h-12" />{" "}
          <p className="text-lg">{outTime(activity.moving_time)} Mins</p>
        </div>
      </div>
      <div className="flex flex-col justify-center grow">
        <div className="flex flex-col items-center justify-start gap-2">
          <FontAwesomeIcon icon={faRunning} className="w-12 h-12" />{" "}
          <p className="text-lg text-center">
            {outTime(activity.moving_time / (activity.distance / 1609.34), 0)}
          </p>
        </div>
      </div>
    </div>
  </Link>
);
