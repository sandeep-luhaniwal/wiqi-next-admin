import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCountryCategories, 
  addCountryCategory, 
  getCountryNames, 
  editCountryCategory, 
  deleteCountryCategory 
} from '@/app/api/country-category/category';
import toast from 'react-hot-toast';

export const fetchCountryCategoriesThunk = createAsyncThunk(
  'countryCategory/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      return await getCountryCategories(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCountryCategoryThunk = createAsyncThunk(
  'countryCategory/add',
  async ({ token, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await addCountryCategory(token, formData);
      toast.success('Country category added successfully!');
      dispatch(fetchCountryCategoriesThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const editCountryCategoryThunk = createAsyncThunk(
  'countryCategory/edit',
  async ({ token, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await editCountryCategory(token, formData);
      toast.success('Country category updated successfully!');
      dispatch(fetchCountryCategoriesThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCountryCategoryThunk = createAsyncThunk(
  'countryCategory/delete',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await deleteCountryCategory(token, id);
      toast.success('Category deleted successfully!');
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCountryNamesThunk = createAsyncThunk(
  'countryCategory/fetchCountryNames',
  async (token, { rejectWithValue }) => {
    try {
      return await getCountryNames(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const countryCategorySlice = createSlice({
  name: 'countryCategory',
  initialState: {
    categories: [],
    countryNames: [],
    categoryToEdit: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCategoryToEdit: (state, action) => {
      state.categoryToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryCategoriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountryCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCountryCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCountryNamesThunk.fulfilled, (state, action) => {
        state.countryNames = action.payload;
      })
      .addCase(deleteCountryCategoryThunk.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.id;
        state.categories = state.categories.filter(c => c._id !== deletedId);
      });
  },
});

export const { setCategoryToEdit } = countryCategorySlice.actions;
export default countryCategorySlice.reducer;
