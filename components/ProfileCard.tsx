import {
  faRuler,
  faClock,
  faTachometerAlt,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { outTime } from "../scripts";
import LoginData from "../scripts/LoginData";
import Image from "next/image";

export default function ProfileCard({
  data,
  stats,
}: {
  data: any;
  stats: any;
}) {
  const [showYear, setShowYear] = useState(false);
  const [usedStats, setUsedStats] = useState([] as any);

  const router = useRouter();
  useEffect(() => {
    if (!stats) return;
    setUsedStats(showYear ? stats.ytd_run_totals : stats.all_run_totals);
  }, [stats, showYear]);

  return (
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
        <Image
          src={data.profile}
          className="rounded-full sm:w-36 sm:h-36 w-28 h-28"
          alt="Profile Picture"
          width={192}
          height={192}
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
      {/* <div className="flex flex-row flex-wrap gap-4 p-8 mb-4 bg-gray-700 rounded-md lg:ml-4">
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
      </div> */}
      <div className="grid grid-cols-2 gap-4 p-8 mb-4 bg-gray-700 rounded-md lg:ml-4">
        <Link
          className="w-full p-2 text-center bg-gray-600 rounded-md hover:bg-gray-500"
          href="/profile"
        >
          View Profile
        </Link>
        <Link
          className="w-full p-2 text-center bg-gray-600 rounded-md hover:bg-gray-500"
          href="/goals"
        >
          Manage Goals
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-4 p-4 bg-gray-700 rounded-md lg:ml-4">
        <button
          className="w-full p-2 bg-gray-600 rounded-md hover:bg-gray-500"
          onClick={() => {
            LoginData.Logout();
            router.reload();
          }}
        >
          Logout
        </button>
      </div>
      <div className="lg:grow"></div>
      <p className="hidden p-4 mt-4 ml-4 text-lg text-center bg-gray-700 rounded-t-lg lg:block">
        Icons by FontAwesome
      </p>
    </div>
  );
}
