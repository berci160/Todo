import { useEffect, useState } from 'react';

import { UserData } from 'models';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onAddTodo: (todoText: string) => void;
  onDeleteTodo: (todoId: number) => void;
  onToggleCompleted: (todoId: number, completed: boolean) => void;
  onEditTodo: (todoId: number, newText: string) => void;
}

export const TodoModal = ({
  isOpen,
  onClose,
  user,
  onAddTodo,
  onDeleteTodo,
  onToggleCompleted,
  onEditTodo,
}: TodoModalProps) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState<string>('');
  const [todos, setTodos] = useState(user.todos || []);

  useEffect(() => {
    setTodos(user.todos || []);
  }, [user.todos]);

  if (!isOpen) {
    return null;
  }

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
    onToggleCompleted(todoId, completed);
  };

  const handleEditTodo = (todoId: number, newText: string) => {
    if (newText.trim()) {
      onEditTodo(todoId, newText);
      setEditTodoId(null);
      setEditTodoText('');
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-yellow-50 flex justify-center items-center z-50">
      <div className="modal-content bg-lime-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{user.name}s Todos</h2>
        <div className="todos-list mb-4">
          {todos?.map((todo) => {
            const { id, text, completed } = todo;
            return (
              <div key={id} className="todo-item flex justify-between items-center mb-2 p-2 border-b">
                <div className="flex items-center">
                  {editTodoId === id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        className="border p-2 rounded w-full"
                        type="text"
                        value={editTodoText || text}
                        onChange={(e) => setEditTodoText(e.target.value)}
                      />
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleEditTodo(id, editTodoText || text)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleToggleCompleted(id, completed)}
                        className="mr-2"
                      />
                      <span className={completed ? 'line-through' : ''}>{text}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="mr-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={() => setEditTodoId(id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleDeleteTodo(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
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
          <button className="text-white hover:bg-red-600 bg-red-500 rounded w-full px-4 py-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
