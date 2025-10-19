import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { calcTotalPrice } from '../../utils/calcTotalPrice';
import { CartItem, CartSliceState } from './types';
import { ref, get, set } from 'firebase/database';
import { db } from '../../firebase';

export const fetchCartFromFirebase = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const snapshot = await get(ref(db, 'cart'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        items: data.items || [],
        totalPrice: data.totalPrice || 0,
      };
    } else {
      return { items: [], totalPrice: 0 };
    }
  },
);

// 🔹 Сохранение корзины в Firebase
const saveCartToFirebase = async (state: CartSliceState) => {
  await set(ref(db, 'cart'), state);
};

const initialState: CartSliceState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);
      
      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
      
      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(state);
    },
    minusItem(state, action: PayloadAction<string>) {
      const findItem = state.items.find((obj) => obj.id === action.payload);
      if (findItem && findItem.count > 1) {
        findItem.count--;
      } else {
        state.items = state.items.filter((obj) => obj.id !== action.payload);
      }
      
      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(state);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(state);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
      saveCartToFirebase(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromFirebase.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    });
  },
});

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;
export default cartSlice.reducer;
