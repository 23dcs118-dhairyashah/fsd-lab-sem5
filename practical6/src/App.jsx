import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

const App = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Task 1', status: 'not-started', priority: 'medium' },
        { id: 2, text: 'Task 2', status: 'pending', priority: 'high' }
    ]);
    const [newTask, setNewTask] = useState('');
    const [newPriority, setNewPriority] = useState('medium');
    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState('');

    const addTask = () => {
        if (newTask.trim()) {
            const task = {
                id: Date.now(),
                text: newTask,
                status: 'not-started',
                priority: newPriority
            };
            setTasks([...tasks, task]);
            setNewTask('');
            setNewPriority('medium');
        }
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: newStatus } : task
        ));
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setEditText(task.text);
    };

    const saveEdit = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, text: editText } : task
        ));
        setEditingTask(null);
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditText('');
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'pending': return 'bg-yellow-600';
            case 'not-started': return 'bg-gray-600';
            default: return 'bg-gray-600';
        }
    };

    const filterTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const TaskItem = ({ task }) => (
        <div className={`${getStatusColor(task.status)} rounded-lg p-4 mb-3 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} priority`}></div>
                {editingTask === task.id ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-white text-gray-800 px-2 py-1 rounded"
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    />
                ) : (
                    <span className="text-white flex-1">{task.text}</span>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="bg-white text-gray-800 px-2 py-1 rounded text-sm"
                >
                    <option value="not-started">Not Started</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                {editingTask === task.id ? (
                    <div className="flex space-x-1">
                        <button
                            onClick={() => saveEdit(task.id)}
                            className="text-green-300 hover:text-green-100"
                        >
                            ✓
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="text-red-300 hover:text-red-100"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => startEditing(task)}
                        className="text-blue-300 hover:text-blue-100"
                    >
                        <Edit size={16} />
                    </button>
                )}
                <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-300 hover:text-red-100"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h1 className="text-4xl font-bold text-white text-center mb-6">
                        Get Things Done !
                    </h1>

                    {/* Add Task Section */}
                    <div className="flex space-x-2 mb-6">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="What is the task today?"
                            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                        <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button
                            onClick={addTask}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        >
                            <Plus size={20} />
                            <span>Add Task</span>
                        </button>
                    </div>

                    {/* Priority Legend */}
                    <div className="flex items-center space-x-4 mb-6 text-white text-sm">
                        <span>Priority:</span>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>High</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Medium</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Low</span>
                        </div>
                    </div>

                    {/* Task Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Not Started */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Not Started ({filterTasksByStatus('not-started').length})
                            </h2>
                            <div className="space-y-2">
                                {filterTasksByStatus('not-started').map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                                {filterTasksByStatus('not-started').length === 0 && (
                                    <p className="text-gray-400 text-center py-4">No tasks</p>
                                )}
                            </div>
                        </div>

                        {/* Pending */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Pending ({filterTasksByStatus('pending').length})
                            </h2>
                            <div className="space-y-2">
                                {filterTasksByStatus('pending').map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                                {filterTasksByStatus('pending').length === 0 && (
                                    <p className="text-gray-400 text-center py-4">No tasks</p>
                                )}
                            </div>
                        </div>

                        {/* Completed */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Completed ({filterTasksByStatus('completed').length})
                            </h2>
                            <div className="space-y-2">
                                {filterTasksByStatus('completed').map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                                {filterTasksByStatus('completed').length === 0 && (
                                    <p className="text-gray-400 text-center py-4">No tasks</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
