import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LoginData from "../../../scripts/LoginData";
import { Goal } from "../../../scripts/types";

export default function Page({ url }: { url: string }) {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal>({} as Goal);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!LoginData.isLoggedIn()) {
      LoginData.getStorage();
      if (!LoginData.isLoggedIn()) {
        router.push("/");
        return;
      }
    }
    LoginData.updateGoals(url);
    const goal = LoginData.getGoals().find(
      (goal: Goal) => goal.id.toString() === router.query.pid
    );
    if (goal) {
      setGoal(goal);
    } else {
      router.push("/goals");
    }
  }, [LoginData.isLoggedIn()]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const name = formData.get("name");
    const description = formData.get("description");
    const updatedGoal: Goal = {
        ...goal,
        name: name as string,
        description: description as string,
        updatedAt: Date.now()
    }
    LoginData.updateGoal(updatedGoal, url)
    
    router.back()
  }

  return (
    <div className="flex flex-col items-center gap-4 font-sans text-white bg-gray-800">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <label className="flex flex-col items-start gap-2" htmlFor="name">
          <span className="text-lg">Name</span>
        </label>
        <input
          className="px-4 py-2 text-black bg-gray-200 rounded-lg"
          type="text"
          name="name"
          id="name"
          defaultValue={goal.name}
        />
        <label
          className="flex flex-col items-start gap-2"
          htmlFor="description"
        >
          <span className="text-lg">Description</span>
        </label>
        <textarea
          className="px-4 py-2 text-black bg-gray-200 rounded-lg"
          name="description"
          id="description"
          defaultValue={goal.description}
        />
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          type="submit"
        >
          Update
        </button>
      </form>
    </div>
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
