import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

const serverAddress = createSlice({
  name: "server_address",
  initialState: localStorage.getItem("server_address") || "",
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      localStorage.setItem("server_address", action.payload);

      console.log("set server address", action.payload);

      return action.payload;
    },
  },
});

export const { set: setServerAddress } = serverAddress.actions;

export const store = configureStore({
  reducer: { serverAddress: serverAddress.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
