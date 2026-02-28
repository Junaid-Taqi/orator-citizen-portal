import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from "../Slices/AuthSlice";
import adminReportsReducer from "../Slices/AdminReportsSlice";
import activeCitizensReducer from "../Slices/ActiveCitizensSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    AdminReports: adminReportsReducer,
    ActiveCitizens: activeCitizensReducer,
});

const Store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default Store;
