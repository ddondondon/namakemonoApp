// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

// v-calendar 追加
import { VCalendar } from 'vuetify/labs/VCalendar'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  // v-calendar 追加
  {
    components: {
      VCalendar,
    }
  }
)
