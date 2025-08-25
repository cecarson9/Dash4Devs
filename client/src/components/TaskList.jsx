import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Task = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.task.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.task.priority}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.task.description}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.task._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteTask(props.task._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:5050/task/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const tasks = await response.json();
      setTasks(tasks);
    }
    getTasks();
    return;
  }, [tasks.length]);

  // This method will delete a record
  async function deleteTask(id) {
    await fetch(`http://localhost:5050/task/${id}`, {
      method: "DELETE",
    });
    const newTasks = tasks.filter((el) => el._id !== id);
    setTasks(newTasks);
  }

  // This method will map out the records on the table
  function taskList() {
    return tasks.map((task) => {
      return (
        <Task
          task={task}
          deleteTask={() => deleteTask(task._id)}
          key={task._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Tasks</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Priority
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {taskList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}