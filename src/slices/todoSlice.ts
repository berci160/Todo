import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TodoData } from 'models';
import { LOCAL_USERS } from 'config/config';

const loadTodosForUserFromLocalStorage = (userId: number): TodoData[] => {
  const savedUserData = localStorage.getItem(`${LOCAL_USERS}-${userId}`);

  if (savedUserData) {
    const user = JSON.parse(savedUserData);
    return user.todos || [];
  }
  return [];
};

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [] as TodoData[],
  },
  reducers: {
    
    addTodoToUser: (state, action: PayloadAction<{ userId: number; text: string }>) => {
      const { userId, text } = action.payload;

      const newTodo: TodoData = {
        id: Date.now(),
        text,
        completed: false,
        userId,
      };

      const todos = loadTodosForUserFromLocalStorage(userId);

      todos.push(newTodo);

      const savedUserData = localStorage.getItem(`${LOCAL_USERS}-${userId}`);

      if (savedUserData) {
        const user = JSON.parse(savedUserData);
        user.todos = todos;
        localStorage.setItem(`${LOCAL_USERS}-${userId}`, JSON.stringify(user));
      }

      state.todos.push(newTodo);
    },

    toggleComplete: (state, action: PayloadAction<{ userId: number; todoId: number }>) => {
      const { userId, todoId } = action.payload;

      const todos = loadTodosForUserFromLocalStorage(userId);
      const todo = todos.find((t) => t.id === todoId);

      if (todo) {
        todo.completed = !todo.completed;

        const savedUserData = localStorage.getItem(`${LOCAL_USERS}-${userId}`);
        if (savedUserData) {
          const user = JSON.parse(savedUserData);
          user.todos = todos;
          localStorage.setItem(`${LOCAL_USERS}-${userId}`, JSON.stringify(user));
        }
      }
    },

    deleteTodoFromUser: (state, action: PayloadAction<{ userId: number; todoId: number }>) => {
      const { userId, todoId } = action.payload;

      let todos = loadTodosForUserFromLocalStorage(userId);

      todos = todos.filter((todo) => todo.id !== todoId);

      const savedUserData = localStorage.getItem(`${LOCAL_USERS}-${userId}`);
      if (savedUserData) {
        const user = JSON.parse(savedUserData);
        user.todos = todos;
        localStorage.setItem(`${LOCAL_USERS}-${userId}`, JSON.stringify(user));
      }
    },

    editTodoInUser: (state, action: PayloadAction<{ userId: number; todoId: number; newText: string }>) => {
      const { userId, todoId, newText } = action.payload;

      const todos = loadTodosForUserFromLocalStorage(userId);
      const todo = todos.find((editTodo) => editTodo.id === todoId);

      if (todo) {
        todo.text = newText;

        const savedUserData = localStorage.getItem(`${LOCAL_USERS}-${userId}`);
        if (savedUserData) {
          const user = JSON.parse(savedUserData);
          user.todos = todos;
          localStorage.setItem(`${LOCAL_USERS}-${userId}`, JSON.stringify(user));
        }
      }
    },
  },
});

export const { addTodoToUser, toggleComplete, deleteTodoFromUser, editTodoInUser } = todoSlice.actions;

export default todoSlice.reducer;
