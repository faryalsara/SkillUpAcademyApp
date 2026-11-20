import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../../types/course';

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  isOffline: false,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
      state.isOffline = false;
    },

    setOfflineCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
      state.isOffline = true;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setCourses,
  setOfflineCourses,
  setError,
} = coursesSlice.actions;

export default coursesSlice.reducer;