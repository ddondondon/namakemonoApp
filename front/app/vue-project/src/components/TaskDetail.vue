<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- タイトル -->
          <v-text-field label="タイトル" v-model="task.title" maxlength="10" counter outlined required></v-text-field>
          <!-- タスク区分 -->
          <v-select v-model="task.type" :items="taskTypeItems" label="タスク区分" outlined required></v-select>
          <!-- 締切日（予定日） -->
          <v-text-field :label="dateLabel" v-model="task.date" type="date" outlined required></v-text-field>
          <!-- 内容 -->
          <v-textarea label="内容" v-model="task.content" maxlength="100" counter rows="4" outlined required></v-textarea>
          <!-- 完了フラグ -->
          <v-checkbox v-model="task.isCompleted" label="完了フラグ" class="my-2"></v-checkbox>

          <!-- 登録ボタン -->
          <v-btn v-show="addUpFlg === '1'" color="#EEEEEE" class="mr-2" @click="submitTask">
            登録
          </v-btn>
          <!-- 更新ボタン -->
          <v-btn v-show="addUpFlg === '2'" color="#EEEEEE" class="mr-2" @click="updateTask">
            更新
          </v-btn>
          <!-- 削除ボタン -->
          <v-btn v-show="addUpFlg === '2'" color="#EEEEEE" @click="confirmDeleteTask">
            削除
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../store/taskStore';

// ルートパラメータ取得
const route = useRoute();
const itemNumber = route.params.itemNumber;
const router = useRouter();

// フォームバリデーション
const valid = ref(false);
const taskStore = useTaskStore();

// タスクの区分用に利用するアイテム
const taskTypeItems = [
    { title: "deadline", value: "1" },
    { title: "schedule", value: "2" },
];

//新規／更新判定フラグ（1:新規,2:更新）
const addUpFlg = ref('');

// フォームデータ
const task = ref({
  number: itemNumber,
  title: '',
  type: '',
  date: '',
  content: '',
  isCompleted: false,
});

// タスク区分に応じて「実施予定日」あるいは「締切日」を返す
const dateLabel = computed(() => {
  return task.value.type === '2'
    ? '実施予定日'
    : '締切日';
});

// マウント時にストアから既存データをセット
onMounted(() => {
  console.log('itemNumber:', itemNumber);
  const fetchedTask = taskStore.getTaskById(itemNumber);
  if (fetchedTask) {
    task.value.type = fetchedTask.type || '';
    task.value.date = formatDate(fetchedTask.date) || '';
    task.value.title = fetchedTask.title || '';
    task.value.content = fetchedTask.content || '';
    task.value.isCompleted = fetchedTask.isCompleted === '1';
  }
  if (task.value.date == '') {
    addUpFlg.value = '1';
  } else {
    addUpFlg.value = '2';
  }
});

// タスク登録処理
const submitTask = () => {
  numbering();
  taskStore.addTask({
    ...task.value,
    isCompleted: task.value.isCompleted ? '1' : '0'
  });
  console.log('Task submitted:', { ...task.value });
  console.log('タスクを登録しました。');
  console.log('number:',task.value.number,'title:',task.value.title,'type:',task.value.type,'date:',task.value.date,'content:',task.value.content,'isCompleted:',task.value.isCompleted
);
  addUpFlg.value = '2';
};

// タスク更新処理
const updateTask = () => {
  taskStore.updateTask({
    ...task.value,
    isCompleted: task.value.isCompleted ? '1' : '0'
  });

  console.log('Task submitted:', { ...task.value });
  console.log('タスクを更新しました。');
  console.log('number:',task.value.number,'title:',task.value.title,'type:',task.value.type,'date:',task.value.date,'content:',task.value.content,'isCompleted:',task.value.isCompleted
);
};

// タスク削除処理
const deleteTask = () => {
  taskStore.removeTask(task.value.number);
  console.log('Task submitted:', task.value.number);
  console.log('タスクを削除しました。');
  console.log('number:',task.value.number,'title:',task.value.title,'type:',task.value.type,'date:',task.value.date,'content:',task.value.content,'isCompleted:',task.value.isCompleted
);
  router.push({
      name: 'home',
    })
};

function numbering(){
  // ストアから全タスクを取得
  const allTasks = taskStore.tasks;
  if (allTasks.length === 0) {
    // タスクが存在しない場合は 1 を設定
    task.value.number = '1';
    console.log("タスクが存在しないため、number を '1' に設定しました。");
    return;
  }
  // 現在の最大 number を取得（number は文字列なので数値に変換）
  const maxNumber = Math.max(...allTasks.map(task => parseInt(task.number, 10)));
  // 新しい number を設定（最大値 + 1）
  const newNumber = (maxNumber + 1).toString();
  // task の number に設定
  task.value.number = newNumber;
  console.log(`新しい number を設定しました: ${newNumber}`);
}

function formatDate(dateValue) {
  console.log("dateValue:", dateValue);
  if (!dateValue) return '';
  const d = new Date(dateValue);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  // ハイフン区切りに変える
  return `${yyyy}-${mm}-${dd}`;
}

function confirmDeleteTask() {
  const result = confirm("本当に削除してよろしいですか？");
  if (result) {
    // 「はい」が押されたら削除を実行
    deleteTask();
  }
}

</script>