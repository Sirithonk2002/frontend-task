"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaUser } from "react-icons/fa6";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [editTask, setEditTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [editAssigneeIds, setEditAssigneeIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  


  const formatPriority = (priority) => {
    switch (priority) {
      case "Low":
      case "low":
        return "Low";
      case "Medium":
      case "medium":
        return "Medium";
      case "High":
      case "high":
        return "High";
      default:
        return "Medium";
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
      case "low":
        return "bg-green-200";
      case "Medium":
      case "medium":
        return "bg-yellow-200";
      case "High":
      case "high":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch("https://backend-task-ra57.onrender.com/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setCurrentUser(data);  
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getCurrentUser();

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://backend-task-ra57.onrender.com/users/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (!res.ok) throw new Error("Failed to fetch users");
  
        const data = await res.json();
        console.log(data);  
        setAllUsers(data);  
      } catch (err) {
        setError(err.message);  
      }
    };
  
    fetchUsers();
  }, []);
  
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://backend-task-ra57.onrender.com/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-task-ra57.onrender.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          priority: newTaskPriority,
          status: "To Do",  
          assignee_ids: assigneeIds, 
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to add task");
      }
  
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setIsAddTaskModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("Medium");
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`https://backend-task-ra57.onrender.com/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const draggedTask = tasks.find((t) => t.id.toString() === draggableId);
    const newStatus = statusMap[destination.droppableId];

    try {
      const res = await fetch(`https://backend-task-ra57.onrender.com/tasks/${draggedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            title: draggedTask.title,
            description: draggedTask.description,
            priority: draggedTask.priority,
            status: newStatus,
            start_date: draggedTask.start_date,
            end_date: draggedTask.end_date,
          }),
          
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update status");
      setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://backend-task-ra57.onrender.com/tasks/${editTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...editTask, assignee_ids: editAssigneeIds }),
      });
  
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.detail || "Failed to update task");
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const openEditModal = (task) => {
    setEditTask({ ...task }); 
    setIsEditModalOpen(true);
  };
    
  const statusMap = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/Login"; 
  };
  
  return (
    <div
        className="p-6 min-h-screen"
        style={{
          background: "linear-gradient(to bottom right, #FF9999, #FFCCCC, #FFFFFF)",	
        }}
      >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "#330000" }}>
          Task Management
        </h1>

        <div className="flex items-center space-x-4">
          {currentUser && (
              <div className="flex items-center gap-2 px-2 py-2 rounded-xl border border-rose-400">
              <FaUser className="text-brown-400" /> 
              <p className="text-400 text-right font-medium" style={{ color: "#330000" }}>
                {currentUser.username}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-2 py-2 bg-rose-400 hover:bg-rose-500 text-white font-semi rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1 " />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
      )}
  
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl shadow transition cursor-pointer"
        >
          <span className="text-lg">＋</span>
          <span>Add Task</span>
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(statusMap).map((key) => (
            <Droppable droppableId={key} key={key}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-white rounded-2xl shadow-md p-6 min-h-[450px] border border-gray-200"
                      >
                        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                          {statusMap[key]}
                        </h2>
                        
                        {tasks
                        .filter((t) => t.status === statusMap[key])
                        .map((task, index) => (
                          <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                            {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 mb-4 rounded-xl shadow-sm hover:shadow-md transition-all ${
                          task.status === "To Do"
                            ? "bg-blue-100"
                            : task.status === "In Progress"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                        }`}
                      >
                        {task.assignees && task.assignees.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Assigned to :{" "}
                            {task.assignees.map((user) => user.username).join(", ")}
                          </div>
                        )}
                        <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                            task.priority
                          )} text-gray-800 mb-2`}
                        >
                          {formatPriority(task.priority)}
                        </span>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openEditModal(task)}
                              className="px-3 py-1 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="px-3 py-1 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
  
      {/* Add Task */}
      {isAddTaskModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 tracking-tight mb-6">Add New Task</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <select
                  value={assigneeIds[0] || ""}  
                  onChange={(e) => setAssigneeIds([Number(e.target.value)])}  
                  className="w-full p-3 border border-gray-300 rounded-xl"
                >
                  <option value="" disabled>Select Assignee</option> 
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>

                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description"
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    {/* Edit Task */}
    {isEditModalOpen && editTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Edit Task</h2>
            <form onSubmit={handleEditTask} className="space-y-4">
            <select
                value={editAssigneeIds}
                onChange={(e) => setEditAssigneeIds([Number(e.target.value)])} 
                className="w-full p-3 border border-gray-300 rounded-xl"
              >
                <option value="" disabled>Select Assignee</option> 
               {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))} 
              </select>
                <input
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  required
                />
                <textarea
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  required
                />
                <select
                  value={editTask.priority}
                  onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Update</button>
                </div>
            </form>
            </div>
        </div>
      )}
    </div>
  );
}

