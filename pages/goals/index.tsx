import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoalCard from "../../components/GoalCard";
import LoginData from "../../scripts/LoginData";
import { Goal } from "../../scripts/types";

export default function Goals({ url }: { url: string }) {
  const router = useRouter();

  const [displayCompleted, setDisplayCompleted] = useState(false);

  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      LoginData.getStorage();
      if (!LoginData.isLoggedIn()) {
        router.push("/");
        return;
      }
    }
    LoginData.updateGoals(url);
  }, [LoginData.isLoggedIn(), router]);

  return (
    <main className="flex flex-col items-center gap-4 font-sans text-white bg-gray-800">
      <div className="px-16 py-4 m-4 text-center bg-gray-700 rounded-lg">
        <h1 className="text-3xl">Goals</h1>
      </div>
      <div className="flex flex-row gap-4">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={() => setDisplayCompleted(!displayCompleted)}
        >
          {displayCompleted ? "Hide" : "Show"} completed goals
        </button>
        <Link
          href="/goals/create"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Create a new goal
        </Link>
      </div>
      {LoginData.getGoals().filter(
        (goal: Goal) => displayCompleted || !goal.completed
      ).length > 0
        ? LoginData.getGoals()
            .filter((goal: Goal) => displayCompleted || !goal.completed)
            .map((goal: Goal) => (
              <Link href={`/goals/${goal.id}`} key={goal.id}>
                <GoalCard goal={goal} />
              </Link>
            ))
        : "No Goals"}
    </main>
  );
}

export function getServerSideProps(context: any) {
  const host = context.req.headers.host;
  const url = host.includes("localhost") ? "http://" : "https://";
  const fullUrl = url + host;
  return {
    props: {
      url: fullUrl,
    },
  };
}
