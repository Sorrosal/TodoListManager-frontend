<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Header Section -->
      <div class="col-12">
        <TodoListHeader @add-task="openAddDialog" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="col-12">
        <TodoLoadingState />
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="col-12">
        <TodoEmptyState />
      </div>

      <!-- Todo Items by Category -->
      <TodoItemList
        v-else
        :items-by-category="itemsByCategory"
        :get-latest-progress="getLatestProgress"
        :get-progress-color="getProgressColor"
        @edit="openEditDialog"
        @add-progress="openProgressDialogHandler"
        @view-history="openHistoryDialog"
        @delete="deleteItem"
      />
    </div>

    <!-- Add/Edit Dialog -->
    <TodoFormDialog
      v-model="showAddDialog"
      :editing-item="editingItem"
      :form-data="formData"
      :is-saving="isSaving"
      @save="handleSaveItem"
    />

    <!-- Progress Dialog -->
    <TodoProgressDialog
      v-model="showProgressDialogFlag"
      :progress-data="progressData"
      :is-saving="isSaving"
      :min-percent="currentMinPercent"
      @save="handleSaveProgress"
    />

    <!-- History Dialog -->
    <TodoHistoryDialog
      v-model="showHistoryDialogFlag"
      :history-item="historyItem"
      :get-sorted-progressions="getSortedProgressions"
      :format-date="formatDate"
      :get-progress-color="getProgressColor"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoItems, useTodoDialogs } from 'src/composables';
import TodoListHeader from 'src/components/TodoList/TodoListHeader.vue';
import TodoLoadingState from 'src/components/TodoList/TodoLoadingState.vue';
import TodoEmptyState from 'src/components/TodoList/TodoEmptyState.vue';
import TodoItemList from 'src/components/TodoList/TodoItemList.vue';
import TodoFormDialog from 'src/components/TodoList/TodoFormDialog.vue';
import TodoProgressDialog from 'src/components/TodoList/TodoProgressDialog.vue';
import TodoHistoryDialog from 'src/components/TodoList/TodoHistoryDialog.vue';

// Composables
const {
  items,
  isLoading,
  itemsByCategory,
  fetchItems,
  addItem,
  updateItem,
  deleteItem,
  registerProgress,
  getLatestProgress,
  getProgressColor,
  getSortedProgressions,
  formatDate,
} = useTodoItems();

const {
  showAddDialog,
  showProgressDialogFlag,
  showHistoryDialogFlag,
  isSaving,
  editingItem,
  progressItem,
  historyItem,
  formData,
  progressData,
  openAddDialog,
  openEditDialog,
  openProgressDialog,
  openHistoryDialog,
  closeAddDialog,
  closeProgressDialog,
} = useTodoDialogs();

import { computed } from 'vue';
import type { TodoItem } from 'src/models';

const openProgressDialogHandler = (item: TodoItem) => {
  const min = getLatestProgress(item) ?? 0;
  openProgressDialog(item, min);
};

const currentMinPercent = computed(() => {
  return progressItem.value ? getLatestProgress(progressItem.value) ?? 0 : 0;
});

// Lifecycle
onMounted(async () => {
  await fetchItems();
});

// Handlers
const handleSaveItem = async () => {
  isSaving.value = true;
  try {
    if (editingItem.value) {
      await updateItem(editingItem.value.id, {
        description: formData.value.description,
      });
    } else {
      await addItem(formData.value);
    }
    closeAddDialog();
  } finally {
    isSaving.value = false;
  }
};

const handleSaveProgress = async () => {
  if (!progressItem.value) return;
  
  isSaving.value = true;
  try {
    const current = getLatestProgress(progressItem.value) ?? 0;
    const desiredTotal = progressData.value.percent;
    const delta = Math.max(0, desiredTotal - current);

    if (delta > 0) {
      await registerProgress(progressItem.value.id, {
        date: new Date(progressData.value.date || new Date()).toISOString(),
        percent: delta,
      });
    }
    closeProgressDialog();
  } finally {
    isSaving.value = false;
  }
};
</script>
