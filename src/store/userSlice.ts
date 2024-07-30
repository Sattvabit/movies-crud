import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  password: string;
  movies: Movie[];
}

export interface Movie {
  title: string;
  year: string;
  image: string;
}
interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    addMovie: (
      state,
      action: PayloadAction<{ email: string; movie: Movie }>
    ) => {
      const { email, movie } = action.payload;
      const user = state.users.find((user) => user.email === email);
      if (user) {
        user.movies.push(movie);
      }
    },
    editMovie: (
      state,
      action: PayloadAction<{ email: string; index: number; movie: Movie }>
    ) => {
      const { email, index, movie } = action.payload;
      const user = state.users.find((user) => user.email === email);
      if (user && user.movies[index]) {
        user.movies[index] = movie;
      }
    },
  },
});

export const { addUser, addMovie, editMovie } = userSlice.actions;

export default userSlice.reducer;
