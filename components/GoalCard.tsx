import { Goal } from "../scripts/types";

export default function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="p-8 bg-gray-900 rounded-lg run-field-sizing text-center">
      <h2 className="text-2xl mb-8">{goal.name}</h2>
      <p className="text-base">{goal.description}</p>
    </div>
  );
}
