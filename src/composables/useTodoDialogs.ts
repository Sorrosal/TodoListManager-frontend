/**
 * Composable for managing dialog states
 */

import { ref } from 'vue';
import type { TodoItem } from 'src/models';

export function useTodoDialogs() {
  const showAddDialog = ref(false);
  const showProgressDialogFlag = ref(false);
  const showHistoryDialogFlag = ref(false);
  const isSaving = ref(false);
  
  const editingItem = ref<TodoItem | null>(null);
  const progressItem = ref<TodoItem | null>(null);
  const historyItem = ref<TodoItem | null>(null);

  const formData = ref({
    title: '',
    description: '',
    category: '',
  });

  const progressData = ref({
    date: new Date().toISOString().slice(0, 16),
    percent: 0,
  });

  const openAddDialog = () => {
    resetForm();
    showAddDialog.value = true;
  };

  const openEditDialog = (item: TodoItem) => {
    editingItem.value = item;
    formData.value = {
      title: item.title,
      description: item.description,
      category: item.category,
    };
    showAddDialog.value = true;
  };

  const openProgressDialog = (item: TodoItem) => {
    progressItem.value = item;
    progressData.value = {
      date: new Date().toISOString().slice(0, 16),
      percent: 0,
    };
    showProgressDialogFlag.value = true;
  };

  const openHistoryDialog = (item: TodoItem) => {
    historyItem.value = item;
    showHistoryDialogFlag.value = true;
  };

  const closeAddDialog = () => {
    showAddDialog.value = false;
    resetForm();
  };

  const closeProgressDialog = () => {
    showProgressDialogFlag.value = false;
  };

  const resetForm = () => {
    editingItem.value = null;
    formData.value = {
      title: '',
      description: '',
      category: '',
    };
  };

  return {
    // Dialog states
    showAddDialog,
    showProgressDialogFlag,
    showHistoryDialogFlag,
    isSaving,
    
    // Current items
    editingItem,
    progressItem,
    historyItem,
    
    // Form data
    formData,
    progressData,
    
    // Actions
    openAddDialog,
    openEditDialog,
    openProgressDialog,
    openHistoryDialog,
    closeAddDialog,
    closeProgressDialog,
    resetForm,
  };
}
