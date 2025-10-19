import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPizzas } from './asyncActions';
import { Pizza, PizzaSliceState, Status } from './types';

const initialState: PizzaSliceState = {
  items: [],
  status: Status.LOADING, // loading | success | error
  totalCount: 0,          // 🔥 добавили поле для общего числа пицц
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.pending, (state) => {
      state.status = Status.LOADING;
      state.items = [];
      state.totalCount = 0;
    });
    
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      // 🔥 теперь payload — это объект { items, totalCount }
      state.items = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.status = Status.SUCCESS;
    });
    
    builder.addCase(fetchPizzas.rejected, (state) => {
      state.status = Status.ERROR;
      state.items = [];
      state.totalCount = 0;
    });
  },
});

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
