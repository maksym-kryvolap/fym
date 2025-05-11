import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { favoritesMovieReducer } from "../slices/favorites.slice"; 
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, WebStorage } from "redux-persist";
import { settingsReducer } from "../slices/settings.slice"

const createNoopStorage = (): WebStorage => {
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: string) => Promise.resolve(),
    removeItem: (_key: string) => Promise.resolve(),
  };
};

const isClient = typeof window !== 'undefined'
const chosenStorage = isClient ? storage : createNoopStorage();

const persistConfig = {
  key: "root",
  storage: chosenStorage,
  whitelist: ["favoritesData", "settingsData"],
};

const rootReducer = combineReducers({
  favoritesData: favoritesMovieReducer,
  settingsData: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
