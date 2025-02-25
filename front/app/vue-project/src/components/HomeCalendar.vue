<template>
  <!-- update-events イベントを受け取り、handleEventsUpdate() を呼び出す -->
  <FirebaseAuth @update-events="handleEventsUpdate" />
  <div>
    <v-sheet>
      <!-- DOMのクリックイベントを拾う -->
      <VCalendar
        :events="events"
        type="month"
        @click="onCalendarClick"
      >
        <!-- イベント要素をスロットでラップし、data属性を付与 -->
        <template #event="{ event }">
          <div
            class="my-calendar-event"
            :data-event-number="event.number"
            :style="{ backgroundColor: event.color || 'blue', cursor: 'pointer' }"
          >
            <!-- 画像を表示 -->
            <img
              v-if="event.type === '1'"
              src="@/assets/animal_namakemono_mini.png"
              alt="ナマケモノ"
              style="width: 50px; height: 50px;"
            />
            <br v-if="event.type === '1'" />
            <img
              v-if="event.type === '2'"
              src="@/assets/clock.png"
              alt="ベル"
              style="width: 20px; height: 20px;"
            />
            <img
              v-if="event.type === '3'"
              src="@/assets/bell.png"
              alt="ベル"
              style="width: 20px; height: 20px;"
            />
            {{ event.title }}
          </div>
        </template>
      </VCalendar>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { createVuetify } from 'vuetify'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../store/taskStore'
import  FirebaseAuth  from './FirebaseAuth.vue'

const events = ref([])
const router = useRouter()
const taskStore = useTaskStore()

createVuetify({
  components: {
    VCalendar,
  },
})

onMounted(async () => {
  // 共通処理を呼び出して events を更新
  await refreshCalendarEvents()
});

// ここで親コンポーネントとして受け取ったイベントを反映
function handleEventsUpdate(newEvents) {
  console.log('handleEventsUpdate: イベントを受け取りました:', newEvents);
  events.value = newEvents;
}

// カレンダーのイベントを再取得する処理をまとめた関数
async function refreshCalendarEvents() {
  events.value = taskStore.loadEvents()
}

/**
 * DOMのクリックイベントハンドラ
 * @param {MouseEvent} evt
 */
function onCalendarClick(evt) {
  // クリックした要素の data-event-number 属性を取得
  const clickedNumber = evt.target?.dataset?.eventNumber
  if (!clickedNumber) {
    // イベント要素以外（空白・日付枠など）をクリックした場合
    return
  }

  // events からクリックされたイベントを検索
  const clickedEvent = events.value.find(e => e.number === clickedNumber)
  if (clickedEvent) {
    router.push({
      name: 'taskDetail',
      params: {
        itemNumber: clickedEvent.number,
      },
    })
  } else {
    console.log("該当するイベントが見つかりません。number:", clickedNumber)
  }
}
</script>
