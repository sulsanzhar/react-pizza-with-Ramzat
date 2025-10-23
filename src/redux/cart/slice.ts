import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { calcTotalPrice } from "../../utils/calcTotalPrice";
import { CartItem, CartSliceState } from "./types";
import { ref, set } from "firebase/database";
import { db } from "../../firebase";
import { getCartFromFirebase } from "../../utils/getCartFromLS";

export const fetchCartFromFirebase = createAsyncThunk(
  "cart/fetchCart",
  async (uid: string, { rejectWithValue }) => {
    try {
      console.log("📦 Загружаем корзину из Firebase для UID:", uid);
      return await getCartFromFirebase(uid);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const saveCartToFirebase = async (
  uid: string | null,
  state: CartSliceState
) => {
  if (!uid) return;
  
  if (!state.items || state.items.length === 0) {
    console.log("⚠️ Пропускаем сохранение: корзина пуста");
    return;
  }

  const pureState = JSON.parse(JSON.stringify(state));
  await set(ref(db, `carts/${uid}`), {
    items: pureState.items,
    totalPrice: pureState.totalPrice,
  });

  console.log("✅ Корзина сохранена в Firebase:", pureState);
};

const initialState: CartSliceState = {
  items: [],
  totalPrice: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ item: CartItem; uid: string | null }>
    ) {
      const { item, uid } = action.payload;
      const findItem = state.items.find((obj) => obj.id === item.id);
      if (findItem) findItem.count++;
      else state.items.push({ ...item, count: 1 });

      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(uid, state);
    },

    minusItem(
      state,
      action: PayloadAction<{ id: string; uid: string | null }>
    ) {
      const { id, uid } = action.payload;
      const findItem = state.items.find((obj) => obj.id === id);
      if (findItem && findItem.count > 1) findItem.count--;
      else state.items = state.items.filter((obj) => obj.id !== id);

      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(uid, state);
    },

    removeItem(
      state,
      action: PayloadAction<{ id: string; uid: string | null }>
    ) {
      const { id, uid } = action.payload;
      state.items = state.items.filter((obj) => obj.id !== id);
      state.totalPrice = calcTotalPrice(state.items);
      saveCartToFirebase(uid, state);
    },

    clearItems(state, action: PayloadAction<{ uid: string | null }>) {
      const { uid } = action.payload;
      state.items = [];
      state.totalPrice = 0;
      saveCartToFirebase(uid, state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromFirebase.fulfilled, (state, action) => {
      console.log("🟢 Корзина получена из Firebase:", action.payload);
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    });
  },
});

export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;
export default cartSlice.reducer;
