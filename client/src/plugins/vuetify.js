import Vue from "vue"
import Vuetify from "vuetify/lib"

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,

        themes: {
            dark: {
                background: "#282833",
                surface: "#333340"
            }
        }
    }
})
