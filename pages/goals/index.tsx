import axios from "axios";
import Link from "next/link";
import { FC } from "react";
import LoginData from "../../scripts/LoginData";
import { Goal } from "../../scripts/types";

export default function Goals() {
  return (
    <div className="flex flex-col items-center gap-4 font-sans text-white bg-gray-800">
      <div className="px-16 py-4 m-4 text-center bg-gray-700 rounded-lg">
        <h1 className="text-3xl">Goals</h1>
      </div>
      <Link
        href="/goals/create"
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Create a new goal
      </Link>
      {LoginData.getGoals().length
        ? LoginData.getGoals().map((goal: Goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        : "No Goals"}
    </div>
  );
}

const GoalCard: FC<{ goal: Goal }> = ({ goal }) => (
  <div className="p-2 bg-gray-900 rounded-lg">
    <h2 className="text-2xl">{goal.name}</h2>
    <p className="text-base">{goal.description}</p>
  </div>
)