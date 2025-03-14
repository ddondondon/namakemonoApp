// src/store/taskStore.js
import { defineStore } from 'pinia';
import { fetchTasksFromServer } from '../api/taskApi';
import { createTaskOnServer } from '../api/taskApi';
import { deleteTaskFromServer } from '../api/taskApi';
import { updateTaskOnServer } from '../api/taskApi';
import { useAuthStore } from '../store/authStore';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [], // タスクのリスト
  }),
  actions: {
    async loadTasks(idToken) {
      try {
        const response = await fetchTasksFromServer(idToken);
        this.tasks = response; // サーバから取得したデータを格納
      } catch (error) {
        console.error('タスクの取得に失敗しました:', error);
      }
    },
    async addTask(newTask) {
      try {
        this.tasks.push(newTask); // 新しいタスクを追加
        const authStore = useAuthStore();
        if (authStore.idToken) {
          await createTaskOnServer(newTask);
        }
      } catch (error) {
        console.error('タスクの追加に失敗しました:', error);
      }
    },
    async removeTask(taskId) {
      try {
        this.tasks = this.tasks.filter(task => task.number !== taskId); // 特定のタスクを削除
        const authStore = useAuthStore();
        if (authStore.idToken) {
          await deleteTaskFromServer(taskId);
        }
      } catch (error) {
        console.error('タスクの削除に失敗しました:', error);
      }
    },
    async updateTask(updatedTask) {
      try {
        const index = this.tasks.findIndex(task => task.number === updatedTask.number);
        const authStore = useAuthStore();
        if (authStore.idToken) {
          await updateTaskOnServer(updatedTask);
        }
        if (index !== -1) {
          this.tasks[index] = updatedTask; // タスクを更新
        }
      } catch (error) {
        console.error('タスクの更新に失敗しました:', error);
      }
    },
    /**
     * カレンダー表示用のイベントデータを生成して返すメソッド
     */
    loadEvents() {
      return this.tasks.map(task => {
        let color;
        if (task.type === '1') {
          // ① typeが'1'の場合
          color = '#EEFFFF';
        } else if (task.type === '2') {
          // ② typeが'2'の場合
          color = '#FFFFCC';
        } else if (task.type === '3' && task.isCompleted === '1') {
          // ③ typeが'3' かつ isCompleted === '1' の場合
          color = '#CCFFCC';
        } else if (task.type === '3' && task.isCompleted !== '1') {
          // ④ typeが'3' かつ isCompleted !== '1' の場合
          color = '#FF6666';
        }
        return {
          title: task.title,
          start: new Date(task.date),
          end: new Date(task.date),
          color: color,
          allDay: true,
          number: task.number,
          type: task.type
        };
      });
    }
  },
  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.number === id); // タスクIDで取得
    },
  },
});
