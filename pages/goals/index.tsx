import LoginData from "../../scripts/logindata";
import { Goal } from "../../types";

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