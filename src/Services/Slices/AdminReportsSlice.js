import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../Constants/Constants';

const initialState = {
    reportsList: [],
    counters: {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        validated: 0,
        unvalidated: 0
    },
    status: 'idle',
    error: null,
};

export const fetchAllReportsAdmin = createAsyncThunk(
    'AdminReports/fetchAllReportsAdmin',
    async (payload) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            };

            const response = await axios.post(`${serverUrl}/o/adminSideCitizenReports/getAllReportsAdmin`, payload, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const AdminReportsSlice = createSlice({
    name: 'AdminReports',
    initialState,
    reducers: {
        resetAdminReportsState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReportsAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllReportsAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.success) {
                    state.reportsList = action.payload.data;
                    state.counters = action.payload.counters;
                }
            })
            .addCase(fetchAllReportsAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { resetAdminReportsState } = AdminReportsSlice.actions;
export default AdminReportsSlice.reducer;
