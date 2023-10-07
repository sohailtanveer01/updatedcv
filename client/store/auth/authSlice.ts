import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'schema';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoggedIn = true;
    },
    setCount: (state, action:PayloadAction<number>) => {
      if (state.user) {
        state.user.count = action.payload
        console.log(state.user.count)
      }
    },
    setSubscriber:(state,action:PayloadAction<boolean>)=>{
      if(state.user){
        state.user.isSubscriber = action.payload
        console.log("im in setsubscriber")

      }else{
        console.log("suer is null, im in setsubscriber")
      }
    },
    logout: () => initialState,
  },
});

export const { setUser, setAccessToken, logout, setCount, setSubscriber } = authSlice.actions;

export default authSlice.reducer;
