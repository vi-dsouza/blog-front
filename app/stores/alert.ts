import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    message: '',
    color: 'success'
  }),

  actions: {
    showSuccess(message: string) {
      this.message = message
      this.color = 'success'
      this.show = true
    },

    showError(message: string) {
      this.message = message
      this.color = 'error'
      this.show = true
    },

    close() {
      this.show = false
    }
  }
})