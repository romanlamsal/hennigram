import { defineStore } from "pinia"
import { v4 } from "uuid"

type SnackConfig = { /*type: "success"; */ message: string; timeout?: number }

export type SnackbarStoreState = {
    queue: {
        [key: string]: SnackConfig
    }
}

export const useSnacks = defineStore("snacks", {
    state(): SnackbarStoreState {
        return {
            queue: {},
        }
    },
    actions: {
        push(config: SnackConfig) {
            const id = v4()
            this.queue[id] = { ...config }

            const timeout = config.timeout || 5000
            setTimeout(() => {
                this.pop(id)
            }, timeout)
        },
        pop(id: string) {
            delete this.queue[id]
        },
    },
})
