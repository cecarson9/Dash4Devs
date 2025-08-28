import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const colorVariants = {
  High: "bg-custom-High",
  Medium: "bg-custom-Medium",
  Low: "bg-custom-Low"
}

const Task = (props) => (
  <tr className={`border-b transition-colors ${colorVariants[props.task.priority]}`}>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <input type="checkbox"
        onChange={e => {props.task.checked=!props.task.checked;
          props.updateTask(e.target.checked, props.task.name, props.task.priority, props.task.description, props.task._id)}}
        checked={props.task.checked}>
      </input>
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" style={{'text-decoration-line':`${props.task.checked ? 'line-through' : 'none'}` }}>
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
    getTasks();
    return;
  }, [tasks.length]);

  async function getTasks() {
      const response = await fetch(`http://localhost:5050/task/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const tasks = await response.json();
      const nonCompletedTasks = tasks.filter((el) => !el.checked);
      const completedTasks = tasks.filter((el) => el.checked);
      const sortedNonCompletedTasks = sortTasks(nonCompletedTasks);
      const sortedCompletedTasks = sortTasks(completedTasks); 
      setTasks([...sortedNonCompletedTasks, ...sortedCompletedTasks]);
    }

  // This method will delete a record
  async function deleteTask(id) {
    await fetch(`http://localhost:5050/task/${id}`, {
      method: "DELETE",
    });
    const newTasks = tasks.filter((el) => el._id !== id);
    setTasks(newTasks);
  }

  async function updateTask(check, taskName, taskPriority, taskDescription, id) {
    let item = {
      name: taskName,
      priority: taskPriority,
      description: taskDescription,
      checked: check
    }
    try {
      
      let response;
        // if we are updating a record we will PATCH to /record/:id.
      response = await fetch(`http://localhost:5050/task/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      getTasks();
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } 
  }

  function sortTasks(tasks) {
    const highTasks = tasks.filter(el => el.priority == "High");
    const medTasks = tasks.filter(el => el.priority == "Medium");
    const lowTasks = tasks.filter(el => el.priority == "Low")
    return [...highTasks, ...medTasks, ...lowTasks];
  }

  // This method will map out the records on the table
  function taskList() {
    return tasks.map((task) => {
      return (
        <Task
          task={task}
          deleteTask={() => deleteTask(task._id)}
          updateTask={() => updateTask(task.checked, task.name, task.priority, task.description, task._id)}
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
                  Status
                </th>
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