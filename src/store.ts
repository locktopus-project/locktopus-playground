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

type Session = {
  id: number;
};

export const sessions = createSlice({
  name: "sessions",
  initialState: {
    lastId: 0,
    sessions: [] as Session[],
  },
  reducers: {
    create: (state, action: PayloadAction) => {
      const session: Session = {
        id: state.lastId + 1,
      };

      return {
        lastId: state.lastId + 1,
        sessions: [...state.sessions, session],
      };
    },
    remove: (state, action: PayloadAction<number>) => {
      return {
        lastId: state.lastId,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
      };
    },
  },
});

export const { set: setServerAddress } = serverAddress.actions;
export const { create, remove } = sessions.actions;

export const store = configureStore({
  reducer: { serverAddress: serverAddress.reducer, locks: sessions.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
