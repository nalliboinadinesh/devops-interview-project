import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  student: null,
  loading: false,
  error: null,
  searchParams: {
    pin: '',
    branch: '',
    academicYear: ''
  }
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setStudent: (state, action) => {
      state.student = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearStudent: (state) => {
      state.student = null;
      state.error = null;
    }
  }
});

export const {
  setSearchParams,
  setStudent,
  setLoading,
  setError,
  clearStudent
} = studentSlice.actions;

export default studentSlice.reducer;
