// src/store/templateStore.js
import { defineStore } from 'pinia';
import { fetchTemplatesFromServer } from '../api/templateApi';
import { submitTemplateOnServer } from '../api/templateApi';
import { useAuthStore } from '../store/authStore';

export const useTemplateStore = defineStore('templateStore', {
  state: () => ({
    templates: [], // テンプレートのリスト
  }),
  actions: {
    async loadTemplates(idToken) {
      try {
        const response = await fetchTemplatesFromServer(idToken);
        // typeを文字列に変換
        this.templates = response.map(t => {
          return {
            ...t,
            type: String(t.type), 
          };
        });
        console.log("response:",response);
      } catch (error) {
        console.error('テンプレートの取得に失敗しました:', error);
      }
    },
    async submitTemplate(newTask) {
      try {
        // 同一 type のテンプレートが存在するかチェック
        const existingIndex = this.templates.findIndex(template => String(template.type) === String(newTask.type));
        if (existingIndex !== -1) {
          // 既存のテンプレートを更新
          this.templates[existingIndex] = newTask;
        } else {
          // 新しいテンプレートを追加
          this.templates.push(newTask);
        }
        const authStore = useAuthStore();
        if (authStore.idToken) {
          await submitTemplateOnServer(newTask);
        }
      } catch (error) {
        console.error('テンプレートの登録に失敗しました:', error);
      }
    }
  },
  getters: {
    getTemplateByType: (state) => (type) => {
      return state.templates.find(template => String(template.type) === String(type));
    },
  },
});
