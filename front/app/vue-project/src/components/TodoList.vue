<template>
  <FirebaseAuth />
  <v-app>
    <v-container>
      <v-checkbox v-model="showCompleted" label="View completed tasks" />
      <v-data-table :items="filteredTasks" :sort-by="[{ key: 'date', order: 'asc' }]">  
        <template v-slot:body="{ items }">
          <tr v-for="item in items" :key="item.number">
            <td>{{ item.number }}</td>
            <td>
              <router-link
                :to="{
                  name: 'taskDetail',
                  params: { itemNumber: item.number }
                }"
              >
                {{ item.title }}
              </router-link>
            </td>
            <td>{{ getTypeTitle(item.type) }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.content.length > 10 ? item.content.substring(0, 10) + '...' : item.content }}</td>
            <td>
              <v-checkbox
                :model-value="item.isCompleted === '1'"
                :disabled="true"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>
<script setup>
import { useTaskStore } from '../store/taskStore';
import  FirebaseAuth  from "./FirebaseAuth.vue";
import { ref, computed } from 'vue'; 

const taskTypeItems = [
  { title: "deadline", value: "1" },
  { title: "schedule", value: "2" },
];

const taskStore = useTaskStore();
const showCompleted = ref(false); 

// フィルターされたタスクを計算プロパティとして定義
const filteredTasks = computed(() => {
  return taskStore.tasks.filter(item => showCompleted.value || item.isCompleted !== '1');
});

function formatDate(dateValue) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

function getTypeTitle(typeVal) {
  const found = taskTypeItems.find(item => item.value === typeVal);
  return found ? found.title : '';
}

</script>