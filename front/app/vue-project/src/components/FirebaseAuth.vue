<template>
  <div>
   <p v-if="authStore.loginUser.uid" class="logInName">ログイン中: {{ authStore.loginUser.displayName }}</p>
   <p v-else class="logInName">ゲスト</p>
   <img :src="require('../assets/login.svg')" 
        alt="login icon" class="log-icon" 
        title="ログイン" 
        v-if="!authStore.loginUser.uid" 
        @click="login">
   <img :src="require('../assets/logout.svg')" 
        alt="logout icon" class="log-icon" 
        title="ログアウト" 
        v-if="authStore.loginUser.uid" 
        @click="logout">  
    <img :src="require('../assets/animal_namakemono.png')" alt="namakemono" class="namakemono" title="タスク追加" @click="addNewTask">
  </div>
</template>

<style lang="scss">
.log-icon {
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  position: absolute;
  cursor: pointer;
}
.namakemono {
  top: 10px;
  left: 10px;
  width: 100px;
  height: 50px;
  position: absolute;
  cursor: pointer;
}
.logInName {
  top: 15px;
  right: 70px;
  width: 250px;
  height: 50px;
  position: absolute;
  text-align: right;
}
</style>
<script setup>
import { ref, defineEmits } from 'vue';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from 'vue-router'
import { useTaskStore } from '../store/taskStore'
import { useAuthStore } from '../store/authStore'

// Firebase初期化
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let idToken = ref(null);
const router = useRouter();
const taskStore = useTaskStore()
const authStore = useAuthStore()

// この子コンポーネントが発行できるイベントを定義
const emit = defineEmits(['update-events']);

//ログイン
function login() {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      //piniaに取得したユーザ・idTokenを格納
      authStore.setLoginUser(result.user);
      idToken = await result.user.getIdToken();
      authStore.setIdToken(idToken);
      // ストアからタスクを取得 (loadTasks の完了を待つ)
      await taskStore.loadTasks(idToken);
      const calendarEvents = taskStore.loadEvents()
      // 親にイベントを発行し、取得したカレンダーイベントを渡す
      emit('update-events', calendarEvents);
}).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("結果が取得出来ませんでした。tokenerrorCode:", errorCode, "errorMessage:", errorMessage);
    });
}
//ログアウト
function logout() {
  signOut(auth).then(() => {
    // ログアウト後にtasks,pinia,カレンダーイベントを初期化
    taskStore.tasks = [];
    authStore.clearLoginUser();
    authStore.clearIdToken();
    const calendarEvents = [];
    emit('update-events', calendarEvents);
  }).catch((error) => {
    console.log("error", error);
  });
}

function addNewTask() {
  router.push({
      name: 'taskDetail',
      params: {
        itemNumber: "X",
      },
    })
}
</script>
