import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

// interface ResState {
//   id: number;
//   userid: string;
//   accessToken: string;
//   refreshToken: string;
// }

export const tokenSlice = createSlice({
  name: 'authToken',
  initialState: {
    accessToken: null,
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      state.accessToken = action.payload;
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = null;
    },
  },
});

type TokenType = {
  access_token: string;
  refresh_token: string;
};

export async function Login(id: string, password: string) {
  try {
    return await axios
      .post('https://i8e208.p.ssafy.io/api/account/login', {
        userid: id,
        password,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.accessToken);
        const tokens: TokenType = {
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
        };
        console.log(tokens);
        return tokens;
        // console.log(res.accessToken);
      });
  } catch (err) {
    console.log(err);
    console.log('Errrrrrr');
    return Promise.reject(err);
  }

  // if (id === 'russ' && password === 'whynot0') {
  //   return {
  //     access_token: 'jx84e3kjew1njej3al2q9w',
  //     refresh_token: 'g2rjfd7452bjfgn;a&*(jkehj',
  //   };
  // } else {
  //   return undefined;
  // }
}