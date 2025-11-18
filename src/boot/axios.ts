/**
 * Axios Boot File
 * Configures axios instance globally for the app
 */

import { boot } from 'quasar/wrappers';
import { apiClient } from 'src/services/api.client';

export default boot(({ app }) => {
  // Make axios available globally via this.$axios and this.$api
  app.config.globalProperties.$axios = apiClient;
  app.config.globalProperties.$api = apiClient;
});

export { apiClient };
