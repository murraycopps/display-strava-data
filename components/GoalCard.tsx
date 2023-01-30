import { Goal } from "../scripts/types";

export default function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="p-2 bg-gray-900 rounded-lg">
      <h2 className="text-2xl">{goal.name}</h2>
      <p className="text-base">{goal.description}</p>
    </div>
  );
}
