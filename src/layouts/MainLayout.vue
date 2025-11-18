<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Todo List Manager</q-toolbar-title>

        <div v-if="isAuthenticated" class="row items-center q-gutter-md">
          <div class="text-subtitle2">
            Welcome, {{ username }}
          </div>
          <q-btn
            flat
            dense
            round
            icon="logout"
            @click="handleLogout"
          >
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog } from 'quasar';
import { authService } from 'src/services';
import type { UserInfo } from 'src/models';

const router = useRouter();
const user = ref<UserInfo | null>(null);

const isAuthenticated = computed(() => authService.isAuthenticated());
const username = computed(() => {
  if (!user.value) return 'User';
  // Handle case where username might be wrapped in an object
  const name = user.value.username;
  return typeof name === 'string' ? name : (name as { value?: string })?.value || 'User';
});

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      user.value = await authService.getCurrentUser();
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }
});

const handleLogout = () => {
  Dialog.create({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authService.removeToken();
    void router.push('/login');
  });
};
</script>
