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

type Connection = {
  id: number;
};

export const connections = createSlice({
  name: "connections",
  initialState: {
    lastId: 0,
    connections: [] as Connection[],
  },
  reducers: {
    create: (state, action: PayloadAction) => {
      const connection: Connection = {
        id: state.lastId + 1,
      };

      return {
        lastId: state.lastId + 1,
        connections: [...state.connections, connection],
      };
    },
    remove: (state, action: PayloadAction<number>) => {
      return {
        lastId: state.lastId,
        connections: state.connections.filter((s) => s.id !== action.payload),
      };
    },
  },
});

export const { set: setServerAddress } = serverAddress.actions;
export const { create, remove } = connections.actions;

export const store = configureStore({
  reducer: { serverAddress: serverAddress.reducer, locks: connections.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
