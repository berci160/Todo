import { configureStore } from "@reduxjs/toolkit";

import todoreducer from '../slices/todoSlice'
import userreducer from '../slices/userSlice'

const store = configureStore({
    reducer:{
        todos: todoreducer,
        users: userreducer,
    },
});

export default store;