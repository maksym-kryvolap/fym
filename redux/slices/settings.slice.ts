import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISettings {
  brightnessValue: string;
}

const initialState: ISettings = {
  brightnessValue: "70",
};

const settingsSlice = createSlice({
  name: "favoritesList",
  initialState,
  reducers: {
    setBrightnessValue: (state, action: PayloadAction<string>) => {
      state.brightnessValue = action.payload;
    },
  },
});

export const { setBrightnessValue } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
