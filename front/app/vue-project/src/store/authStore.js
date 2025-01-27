// src/store/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    loginUser: {
      uid: null,
      displayName: null,
      email: null,
    },
    idToken:null,
  }),
  actions: {
    // ユーザー情報を設定
    setLoginUser(user) {
      this.loginUser.uid = user.uid;
      this.loginUser.displayName = user.displayName;
      // ...
    },
    // ユーザ情報をクリア
    clearLoginUser() {
      this.loginUser.uid = null;
      this.loginUser.displayName = null;
      // ...
    },
    // IDトークンを設定
    setIdToken(idToken) {
      this.idToken = idToken;
    },
    // IDトークンをクリア
    clearIdToken() {
      this.idToken = null;
    }

  },
  getters: {
    // ユーザー情報を取得
    getLoginUser(state) {
      return state.loginUser;
    },
    // IDトークン情報を取得
    getIdToken(state) {
      return state.idToken;
    },
  },
});
