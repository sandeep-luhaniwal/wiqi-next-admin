import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  editCountry, 
  deleteCountry, 
  getCountries, 
  createCountry,
  getInputs,
  addInput,
  editInput,
  deleteInput,
  getCountryCategoryNames,
  getRatings,
  addRating,
  editRating,
  deleteRating,
  getInputNames
} from '@/app/api/country/country';
import toast from 'react-hot-toast';

export const fetchCountriesThunk = createAsyncThunk(
  'country/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      return await getCountries(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCountryThunk = createAsyncThunk(
  'country/create',
  async ({ token, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await createCountry(token, formData);
      toast.success('Country created successfully!');
      dispatch(fetchCountriesThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const editCountryThunk = createAsyncThunk(
  'country/edit',
  async ({ token, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await editCountry(token, formData);
      toast.success('Country edited successfully!');
      dispatch(fetchCountriesThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCountryThunk = createAsyncThunk(
  'country/delete',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await deleteCountry(token, id);
      toast.success('Country deleted successfully!');
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// --- Explore Options (Inputs) Thunks ---

export const fetchInputsThunk = createAsyncThunk(
  'country/fetchInputs',
  async (token, { rejectWithValue }) => {
    try {
      return await getInputs(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addInputThunk = createAsyncThunk(
  'country/addInput',
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
  'country/editInput',
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
  'country/deleteInput',
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
  'country/fetchCategoryNames',
  async ({ token, countryId }, { rejectWithValue }) => {
    try {
      return await getCountryCategoryNames(token, countryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Explore Ratings Thunks ---

export const fetchRatingsThunk = createAsyncThunk(
  'country/fetchRatings',
  async (token, { rejectWithValue }) => {
    try {
      return await getRatings(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRatingThunk = createAsyncThunk(
  'country/addRating',
  async ({ token, payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await addRating(token, payload);
      toast.success('Rating added successfully!');
      dispatch(fetchRatingsThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const editRatingThunk = createAsyncThunk(
  'country/editRating',
  async ({ token, payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await editRating(token, payload);
      toast.success('Rating updated successfully!');
      dispatch(fetchRatingsThunk(token));
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRatingThunk = createAsyncThunk(
  'country/deleteRating',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await deleteRating(token, id);
      toast.success('Rating deleted successfully!');
      return response;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInputNamesThunk = createAsyncThunk(
  'country/fetchInputNames',
  async ({ token, categoryId }, { rejectWithValue }) => {
    try {
      return await getInputNames(token, categoryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const countrySlice = createSlice({
  name: 'country',
  initialState: {
    countries: [],
    inputs: [],
    categoryNames: [],
    ratings: [],
    inputNames: [],
    inputToEdit: null,
    ratingToEdit: null,
    loading: false,
    error: null,
  },
  reducers: {
    setInputToEdit: (state, action) => {
      state.inputToEdit = action.payload;
    },
    setRatingToEdit: (state, action) => {
      state.ratingToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Country
      .addCase(fetchCountriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCountryThunk.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.id;
        state.countries = state.countries.filter(c => c._id !== deletedId);
      })
      // Inputs
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
      })
      // Ratings
      .addCase(fetchRatingsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload;
      })
      .addCase(fetchRatingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInputNamesThunk.fulfilled, (state, action) => {
        state.inputNames = action.payload;
      })
      .addCase(deleteRatingThunk.fulfilled, (state, action) => {
        const deletedId = action.meta.arg.id;
        state.ratings = state.ratings.filter(rating => rating._id !== deletedId);
      });
  },
});

export const { setInputToEdit, setRatingToEdit } = countrySlice.actions;
export default countrySlice.reducer;
