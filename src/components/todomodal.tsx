import React, { useState } from 'react';

import { TodoModalModel } from 'models';

export const TodoModal: React.FC<TodoModalModel> = ({
  isOpen,
  onClose,
  user,
  onAddTodo,
  onDeleteTodo,
  onToggleCompleted,
  onEditTodo,
}) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [editTodoText, setEditTodoText] = useState<string | null>(null);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText);
      setNewTodoText('');
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  const handleToggleCompleted = (todoId: number, completed: boolean) => {
    onToggleCompleted(todoId, !completed);
  };

  const handleEditTodo = (todoId: number, newText: string) => {
    if (newText.trim()) {
      onEditTodo(todoId, newText);
      setEditTodoText(null);
      setEditTodoId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-yellow-50 flex justify-center items-center z-50">
      <div className="modal-content bg-lime-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{user.name}s Todos</h2>
        <div className="todos-list mb-4">
          {user.todos?.map((todo) => (
            <div key={todo.id} className="todo-item flex justify-between items-center mb-2 p-2 border-b">
              <div className="flex items-center">
                {editTodoId === todo.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      className="border p-2 rounded w-full "
                      type="text"
                      value={editTodoText || todo.text}
                      onChange={(e) => setEditTodoText(e.target.value)}
                    />
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg mr-1"
                      onClick={() => handleEditTodo(todo.id, editTodoText || todo.text)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                      className="mr-2"
                    />
                    <span className={todo.completed ? 'line-through' : ''}>{todo.text}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  className=" mr-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  onClick={() => setEditTodoId(todo.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="add-todo mb-4">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add new todo"
            className="border p-2 rounded w-full"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleAddTodo}>
            Add Todo
          </button>
        </div>

        <div className="flex justify-end">
          <button className="text-white hover:bg-red-600 bg-red-500 rounded  w-full px-4 py-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
