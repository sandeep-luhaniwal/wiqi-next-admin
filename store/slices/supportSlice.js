import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuestions } from '@/app/api/support/support';

export const fetchQuestionsThunk = createAsyncThunk(
  'support/fetchQuestions',
  async (token, { rejectWithValue }) => {
    try {
      return await getQuestions(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default supportSlice.reducer;
