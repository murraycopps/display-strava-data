import LoginData from "../../scripts/LoginData";
import { Goal } from "../../scripts/types";

export default function Goals(){
    return (
        <div>
            <h1>Goals</h1>
            {LoginData.getGoals().map((goal: Goal) => (
                <div key={goal._id}>
                    <p>{goal.description}</p>
                </div>
            ))}
        </div>
    )
}