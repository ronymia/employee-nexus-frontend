import { ITaskOverview, IRecentTask } from "@/types/dashboard.type";
import { customFormatDate, FORMAT_PRESETS } from "@/utils/date-format.utils";

interface ITaskOverviewProps {
  taskOverview: ITaskOverview;
}

export default function TaskOverview({ taskOverview }: ITaskOverviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-base-content mb-4">
        Task Overview
      </h3>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-info">
            {taskOverview.assigned}
          </div>
          <div className="text-xs text-base-content/70">Assigned</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-warning">
            {taskOverview.inProgress}
          </div>
          <div className="text-xs text-base-content/70">In Progress</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-success">
            {taskOverview.completed}
          </div>
          <div className="text-xs text-base-content/70">Completed</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-error">
            {taskOverview.overdue}
          </div>
          <div className="text-xs text-base-content/70">Overdue</div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h4 className="text-sm font-semibold text-base-content mb-3">
          Recent Tasks
        </h4>
        <div className="space-y-2">
          {taskOverview.recentTasks
            .slice(0, 5)
            .map((task: IRecentTask, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-base-content">
                    {task.title}
                  </div>
                  <div className="text-xs text-base-content/70 mt-1">
                    {task.project} • Due{" "}
                    {customFormatDate(task.dueDate, FORMAT_PRESETS.SHORT_DATE)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-xs ${
                      task.priority === "URGENT"
                        ? "badge-error"
                        : task.priority === "HIGH"
                          ? "badge-warning"
                          : task.priority === "MEDIUM"
                            ? "badge-info"
                            : "badge-ghost"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`badge badge-xs ${
                      task.status === "IN_PROGRESS"
                        ? "badge-warning"
                        : task.status === "OVERDUE"
                          ? "badge-error"
                          : "badge-ghost"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
