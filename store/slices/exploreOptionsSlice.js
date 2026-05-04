import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getInputs, 
  addInput, 
  editInput, 
  deleteInput, 
  getCountryCategoryNames 
} from '@/app/api/explore-options/options';
import toast from 'react-hot-toast';

export const fetchInputsThunk = createAsyncThunk(
  'exploreOptions/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      return await getInputs(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addInputThunk = createAsyncThunk(
  'exploreOptions/add',
  async ({ token, payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await addInput(token, payload);
      toast.success('Option added successfully!');
      dispatch(fetchInputsThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const editInputThunk = createAsyncThunk(
  'exploreOptions/edit',
  async ({ token, payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await editInput(token, payload);
      toast.success('Option updated successfully!');
      dispatch(fetchInputsThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInputThunk = createAsyncThunk(
  'exploreOptions/delete',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await deleteInput(token, id);
      toast.success('Option deleted successfully!');
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoryNamesThunk = createAsyncThunk(
  'exploreOptions/fetchCategoryNames',
  async (token, { rejectWithValue }) => {
    try {
      return await getCountryCategoryNames(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const exploreOptionsSlice = createSlice({
  name: 'exploreOptions',
  initialState: {
    inputs: [],
    categoryNames: [],
    inputToEdit: null,
    loading: false,
    error: null,
  },
  reducers: {
    setInputToEdit: (state, action) => {
      state.inputToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInputsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInputsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.inputs = action.payload;
      })
      .addCase(fetchInputsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryNamesThunk.fulfilled, (state, action) => {
        state.categoryNames = action.payload;
      })
      .addCase(deleteInputThunk.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.id;
        state.inputs = state.inputs.filter(input => input._id !== deletedId);
      });
  },
});

export const { setInputToEdit } = exploreOptionsSlice.actions;
export default exploreOptionsSlice.reducer;
