// src/api/templateApi.js
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/templates";

export const fetchTemplatesFromServer = async (idToken) => {
  // トークンをAPIに送信
  const response = await fetch(API_BASE_URL, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // トークンをヘッダに付与
    },
  });
  const data = await response.json();
  return data;
};

export const submitTemplateOnServer = async (task) => {
  const authStore = useAuthStore();
  const idToken = authStore.idToken;
  await fetch(API_BASE_URL, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // トークンをヘッダに付与
    },
    body: JSON.stringify(task), 
  });
};


