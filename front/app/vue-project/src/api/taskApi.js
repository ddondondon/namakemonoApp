// src/api/taskApi.js
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export const fetchTasksFromServer = async (idToken) => {
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

export const createTaskOnServer = async (task) => {
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

export const updateTaskOnServer = async (task) => {
  const authStore = useAuthStore();
  const idToken = authStore.idToken;
  await fetch(`${API_BASE_URL}/${task.id}`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // トークンをヘッダに付与
    },
    body: JSON.stringify(task), 
  });
};

export const deleteTaskFromServer = async (taskId) => {
  const authStore = useAuthStore();
  const idToken = authStore.idToken;
  await fetch(`${API_BASE_URL}/${taskId}`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // トークンをヘッダに付与
    },
  });
};
