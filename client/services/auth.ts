import { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { User } from 'schema';

import { logout, setAccessToken, setCount, setSubscriber, setUser } from '@/store/auth/authSlice';

import store from '../store';
import axios from './axios';

export type LoginParams = {
  identifier: string;
  password: string;
};

export type LoginWithGoogleParams = {
  credential: string;
};

export type RegisterParams = {
  name: string;
  email: string;
  username: string;
  password: string;
  count:number;
};
export type clerk_user = {

}
export type AuthDTO = {
  user: User;
  accessToken: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  resetToken: string;
  password: string;
};

export type UpdateProfileParams = {
  count: number;
};

export type UpdateSubscriberParams = {
  isSubscriber: boolean;
};

// export type updateCountParams = {
//   count: number;
// }

export const login = async (loginParams: LoginParams) => {
  const {
    data: { user, accessToken },
  } = await axios.post<AuthDTO, AxiosResponse<AuthDTO>, LoginParams>('/auth/login', loginParams);

  store.dispatch(setUser(user));
  store.dispatch(setAccessToken(accessToken));
};



export const loginWithGoogle = async (loginWithGoogleParams: LoginWithGoogleParams) => {
  const {
    data: { user, accessToken },
  } = await axios.post<AuthDTO, AxiosResponse<AuthDTO>, LoginWithGoogleParams>('/auth/google', loginWithGoogleParams);

  store.dispatch(setUser(user));
  store.dispatch(setAccessToken(accessToken));
};

export const register = async (registerParams: RegisterParams) => {
  const {
    data: { user, accessToken },
  } = await axios.post<AuthDTO, AxiosResponse<AuthDTO>, RegisterParams>('/auth/register', registerParams);

  store.dispatch(setUser(user));
  store.dispatch(setAccessToken(accessToken));
};

export const forgotPassword = async (forgotPasswordParams: ForgotPasswordParams) => {
  await axios.post<void, AxiosResponse<void>, ForgotPasswordParams>('/auth/forgot-password', forgotPasswordParams);

  toast.success('Please check your email for the password reset link.');
};

export const resetPassword = async (resetPasswordParams: ResetPasswordParams) => {
  await axios.post<void, AxiosResponse<void>, ResetPasswordParams>('/auth/reset-password', resetPasswordParams);

  toast.success('Your password has been changed successfully, please login again.');
};

export const updateProfile = async (updateProfileParams: UpdateProfileParams) => {
  const { data: user } = await axios.patch<User, AxiosResponse<User>, UpdateProfileParams>(
    '/auth/update-profile',
    updateProfileParams,
  );

  store.dispatch(setUser(user));

  toast.success('You are using your free trial.');
};

export const updateSubscriberfun = async (updateProfileParams: UpdateSubscriberParams) => {


  store.dispatch(setSubscriber(true));

  toast.success('Your payment has been successfully updated.');
};



export const loginclerk = async(newUserObject:object)=>{
  // const apiUrl:string = process.env.PUBLIC_SERVER_URL!;

  const loginUrl = '/auth/clerklogin';
  const {
    data: { user, accessToken },
  }= await axios.post(loginUrl,newUserObject)
//  const tokenresstr = String(tokenres.data)
//  console.log(tokenresstr)
console.log({user,accessToken})
 store.dispatch(setUser(user));
 store.dispatch(setAccessToken(accessToken))
}





// export const updateCount = async (updatedCount:number) => {
//   console.log(updatedCount)
//   const { data: count } = await axios.patch<number, AxiosResponse<number>>(
//     '/auth/update-count',
//     {count:updatedCount},
//   );

  // store.dispatch(setCount(updatedCount));
  
  // toast.success('Your profile has been successfully updated.');
// };

export const stripeFun = async()=>{
  console.log("im in stripe auth.ts")
  const {data: url} = await axios.get<any, AxiosResponse<any>>(
    '/auth/stripe'
  )
  console.log(url)
  window.location.href = url.url;
}


export const deleteAccount = async () => {
  await axios.delete('/resume/all');
  await axios.delete('/auth');

  store.dispatch(logout());

  toast.success('Your account has been deleted, hope to see you again soon.');
};
