import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMovieDetails = {
  Actors: string;
  Poster: string;
  Title: string;
  Country: string;
  Genre: string;
  Language: string;
  Year: string;
  Runtime: string;
  Type: string;
  Writer: string;
  imdbRating: string;
  imdbID: string;
  Plot: string;
  AddedAt: string;
};

export interface IMovieList {
  All: IMovieDetails[];
  [genre: string]: IMovieDetails[];
}

const initialState: IMovieList = {
  All: [],
};

const favoritesListSlice = createSlice({
  name: "favoritesList",
  initialState,
  reducers: {
    setFavoritesMovie: (state, action: PayloadAction<IMovieDetails>) => {
      const newMovie = action.payload;

      const existedMovie = state["All"]?.some(
        (movie) => movie.imdbID === newMovie.imdbID
      );

      if (!existedMovie) {
        const movieGenres = newMovie.Genre.split(",").map((str: string) =>
          str.trim()
        );

        state.All.unshift(newMovie);

        movieGenres.forEach((genre) => {
          if (state[genre]) {
            state[genre].unshift(newMovie);
          } else {
            state[genre] = [newMovie];
          }
        });
      }
    },
    removeFavoriteMovie: (state, action: PayloadAction<string>) => {
      const movieIdToRemove = action.payload;

      state.All = state.All.filter((movie) => movie.imdbID !== movieIdToRemove);

      Object.keys(state).forEach((genre) => {
        if (genre === "All") return;

        state[genre] = state[genre].filter(
          (movie) => movie.imdbID !== movieIdToRemove
        );
      });
    },
  },
});

export const { setFavoritesMovie, removeFavoriteMovie } =
  favoritesListSlice.actions;
export const favoritesMovieReducer = favoritesListSlice.reducer;
