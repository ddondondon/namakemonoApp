// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as labs from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'

// v-calendar 追加
import { VCalendar } from 'vuetify/labs/VCalendar'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  // v-calendar 追加
  {
    components: {
        ...components,  // 標準コンポーネント (v-sheet など)
        ...labs,        // Labs系コンポーネント (VCalendar など)
    },
    directives,
  }
)
