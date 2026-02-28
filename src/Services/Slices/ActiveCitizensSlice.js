import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../Constants/Constants';

const initialState = {
    usersList: [],
    counters: {
        totalCitizens: 0,
        totalCitizensSubtitle: "",
        activeToday: 0,
        activeChangeSubtitle: "",
        newThisWeek: 0,
        newWeekChangeSubtitle: ""
    },
    status: 'idle',
    error: null,
};

export const fetchActiveCitizensAdmin = createAsyncThunk(
    'ActiveCitizens/fetchActiveCitizensAdmin',
    async (payload) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            };

            const response = await axios.post(`${serverUrl}/o/adminSideCitizenReports/getActiveCitizens`, payload, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const ActiveCitizensSlice = createSlice({
    name: 'ActiveCitizens',
    initialState,
    reducers: {
        resetActiveCitizensState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveCitizensAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchActiveCitizensAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.success) {
                    state.usersList = action.payload.data;
                    state.counters = action.payload.counters;
                }
            })
            .addCase(fetchActiveCitizensAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { resetActiveCitizensState } = ActiveCitizensSlice.actions;
export default ActiveCitizensSlice.reducer;
