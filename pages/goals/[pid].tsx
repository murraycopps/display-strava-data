import {useRouter} from "next/router";
import {useState} from "react";
import {Goal} from "../../scripts/types";
import LoginData from "../../scripts/LoginData";

export default function GoalPage() {
    const router = useRouter()
    const { pid } = router.query
    const [goal, setGoal] = useState<Goal>(LoginData.getGoals().find((goal) => goal.id.toString() === pid) || {id: 0, name: "Goal not found", description: "The goal you are looking for does not exist."} as Goal)

    return (
        <div>
            <h1>{goal.name}</h1>
            <p>{goal.description}</p>
        </div>
    )
}



