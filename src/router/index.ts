import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { authService } from 'src/services';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Navigation guard to protect routes
  Router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    const requiresAuth = to.meta.requiresAuth !== false; // Default to true unless explicitly set to false

    // Allow access to login page
    if (to.path === '/login') {
      if (isAuthenticated) {
        // Already logged in, redirect to todos
        next({ path: '/todos' });
      } else {
        // Not logged in, allow access to login
        next();
      }
      return;
    }

    // For all other routes, check authentication
    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if route requires auth and user is not authenticated
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  });

  return Router;
});
