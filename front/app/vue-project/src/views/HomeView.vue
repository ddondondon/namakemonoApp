
<template>
  <HomeCalendar />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import HomeCalendar from '../components/HomeCalendar.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    HomeCalendar,
  },
});
</script>
