<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-form v-slot="{ }" @submit.prevent="onSubmit(errors)">
          <!-- タスク区分 -->
            <v-row>
             <v-col cols="6">
               <v-select
                 v-model="task.type"
                 :items="taskTypeItems"
                 outlined
                 :rules="[v => !!v || 'タスク区分は必須です']"
                 required
                 name="type"
               >
                 <!-- ラベルのカスタマイズ。「＊必須」部分のみ赤字 -->
                 <template #label>
                   <span>タスク区分</span>
                   <span class="required">　＊必須</span>
                 </template>
               </v-select>
             </v-col>
             <!-- タスク区分が選択された場合に「テンプレート表示」「テンプレート登録」表示 -->
             <v-col cols="3" class="d-flex align-center justify-start">
               <img :src="require('../assets/namakemono_tempDisp.png')"  alt="namakemonoTemp" class="namakemonoTemp"  title="テンプレート表示"  v-if="task.type"  @click="displayTemplate">
             </v-col>
             <v-col cols="3" class="d-flex align-center justify-start">
               <img :src="require('../assets/namakemono_tempAdd.png')"  alt="namakemonoTemp" class="namakemonoTemp"  title="テンプレート登録"  v-if="task.type"  @click="submitTemplate">
             </v-col>
            </v-row>
          <!-- 締切日（予定日） -->
          <v-text-field
            v-model="task.date"
            type="date"
            outlined
            :rules="[v => !!v || '日付は必須です']"
            required
            name="date"
          >
            <template #label>
              <span v-if="task.type === '3'">締切日</span>
              <span v-else>予定日</span>
              <span class="required">　＊必須</span>
            </template>
          </v-text-field>
          <!-- タイトル -->
          <v-text-field
            v-model="task.title"
            maxlength="10"
            counter
            outlined
            :rules="[v => !!v || 'タイトルは必須です']"
            required
            name="title"
          >
            <template #label>
              <span>タイトル</span>
              <span class="required">　＊必須</span>
            </template>
          </v-text-field>          
          <!-- 内容 -->
          <v-textarea label="内容" v-model="task.content" maxlength="100" counter rows="4" outlined required name="content" ></v-textarea>
          <!-- 完了フラグ -->
          <v-checkbox v-model="task.isCompleted" label="完了フラグ" class="my-2 indentField" name="isCompleted"></v-checkbox>

          <!-- 登録ボタン -->
          <v-btn v-show="addUpFlg === '1'" color="#EEEEEE" class="mr-2" type="submit" @click.stop="mode = 'create'">
              登録
          </v-btn>
          <!-- 更新ボタン -->
          <v-btn v-show="addUpFlg === '2'" color="#EEEEEE" class="mr-2" type="submit" @click.stop="mode = 'update'">
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
import { useTemplateStore } from '../store/templateStore';  //template追加

// ルートパラメータ取得
const route = useRoute();
const itemNumber = route.params.itemNumber;
const router = useRouter();
const taskStore = useTaskStore();
const templateStore = useTemplateStore();   //template追加

// タスクの区分用に利用するアイテム
const taskTypeItems = [
    { title: "休日", value: "1" },
    { title: "予定", value: "2" },
    { title: "締切", value: "3" },
];

//新規／更新判定フラグ（1:新規,2:更新）
const addUpFlg = ref('');
//新規／更新を onSubmit で判別するためのフラグ（create／update）
const mode = ref('create');

// フォームデータ
const task = ref({
  number: itemNumber,
  title: '',
  type: '',
  date: '',
  content: '',
  isCompleted: false,
});
const template = ref({
  type: '',
  title: '',
  content: ''
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
    mode.value = 'create';
  } else {
    addUpFlg.value = '2';
    mode.value = 'update';
  }
});

function onSubmit() {
  if(task.value.type=='' || task.value.date=='' || task.value.title==''){
      console.log("バリデーションエラー");
      return;
  }
  // mode を見て登録 or 更新を分岐
  if (mode.value === 'update') {
    updateTask();
  } else {
    submitTask();
  }
}

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
  mode.value = 'update';
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

// start-template追加
const submitTemplate = () => {
  console.log('テンプレート登録ボタン押下');
  template.value.type = task.value.type
  template.value.title = task.value.title
  template.value.content = task.value.content
  templateStore.submitTemplate(template.value);
  console.log("template.value:",template.value);
};
const displayTemplate = () => {
  console.log('テンプレート表示ボタン押下');
  const template = templateStore.getTemplateByType(task.value.type);
  if (template) {
    task.value.title = template.title;
    task.value.content = template.content;
  }else{
    task.value.title = "";
    task.value.content = "";
  }
};
// end-template追加

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

<style scoped>
  .namakemonoTemp {
  width: 80px;
  height: 60px;
  cursor: pointer;
}
.required {
  color: red;
}
</style>