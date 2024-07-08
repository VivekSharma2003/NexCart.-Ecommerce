import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0
  },
  reducers: {
    updateCart: (state, action) => {
      state.quantity = action.payload.quantity;
      state.items = action.payload.items;
    },
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    setCart: (state, action) => {
      state.products = action.payload.products;
      state.quantity = action.payload.products.length;
      state.total = action.payload.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
    incrementQuantity: (state, action) => {
      const product = state.products.find((item) => item._id === action.payload.id);
      if (product) {
        product.quantity += 1;
        state.total += product.price;
      }
    },
    decrementQuantity: (state, action) => {
      const product = state.products.find((item) => item._id === action.payload.id);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        state.total -= product.price;
      }
    },  
  },
});

export const { addProduct, setCart, clearCart, updateCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;