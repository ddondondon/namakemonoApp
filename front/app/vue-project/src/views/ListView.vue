<template>
  <div class="list">
    <TodoList />
  </div>
</template>


<script>
import { defineComponent } from 'vue';

// Components
import TodoList from '../components/TodoList.vue';

export default defineComponent({
  name: 'ListView',

  components: {
    TodoList,
  },
});
</script>