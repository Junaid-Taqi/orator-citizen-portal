import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from "../Slices/AuthSlice";
import adminReportsReducer from "../Slices/AdminReportsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    AdminReports: adminReportsReducer,
});

const Store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default Store;
