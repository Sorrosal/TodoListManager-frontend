import type { RouteRecordRaw } from 'vue-router';
import { authService } from 'src/services';

const routes: RouteRecordRaw[] = [
  // Redirect root dynamically depending on authentication to avoid intermediate /login flash
  {
    path: '/',
    redirect: () => (authService.isAuthenticated() ? '/todos' : '/login'),
  },

  // Public routes
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },

  // Protected routes
  {
    path: '/todos',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/TodoListPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
