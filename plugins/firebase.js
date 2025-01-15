import { getDatabase } from 'firebase/database';

export default defineNuxtPlugin(nuxtApp => {
  // Make Firebase's database available globally in the app
  nuxtApp.provide('getDatabase', getDatabase);
});