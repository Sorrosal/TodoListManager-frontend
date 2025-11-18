/**
 * Composable for managing todo items
 */

import { ref, computed } from 'vue';
import { Notify, Dialog } from 'quasar';
import { todoListService } from 'src/services';
import type { TodoItem, AddItemRequest, UpdateItemRequest, RegisterProgressionRequest } from 'src/models';

export function useTodoItems() {
  const items = ref<TodoItem[]>([]);
  const isLoading = ref(false);

  const itemsByCategory = computed(() => {
    const grouped: Record<string, TodoItem[]> = {};
    items.value.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category]!.push(item);
    });
    return grouped;
  });

  const fetchItems = async () => {
    isLoading.value = true;
    try {
      items.value = await todoListService.getAllItems();
    } catch (error) {
      console.error('Failed to fetch items:', error);
      Notify.create({
        type: 'negative',
        message: 'Failed to load tasks.',
        position: 'top',
      });
    } finally {
      isLoading.value = false;
    }
  };

  const addItem = async (data: AddItemRequest) => {
    try {
      await todoListService.addItem(data);
      Notify.create({
        type: 'positive',
        message: 'Task added successfully!',
        position: 'top',
      });
      await fetchItems();
      return true;
    } catch (error: unknown) {
      console.error('Failed to save item:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      Notify.create({
        type: 'negative',
        message: axiosError?.response?.data?.message || 'Failed to save task.',
        position: 'top',
      });
      return false;
    }
  };

  const updateItem = async (id: number, data: UpdateItemRequest) => {
    try {
      await todoListService.updateItem(id, data);
      Notify.create({
        type: 'positive',
        message: 'Task updated successfully!',
        position: 'top',
      });
      await fetchItems();
      return true;
    } catch (error: unknown) {
      console.error('Failed to update item:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      Notify.create({
        type: 'negative',
        message: axiosError?.response?.data?.message || 'Failed to update task.',
        position: 'top',
      });
      return false;
    }
  };

  const deleteItem = async (item: TodoItem) => {
    return new Promise<void>((resolve, reject) => {
      Dialog.create({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${item.title}"?`,
        cancel: true,
        persistent: true,
      }).onOk(() => {
        void (async () => {
          try {
            await todoListService.deleteItem(item.id);
            Notify.create({
              type: 'positive',
              message: 'Task deleted successfully!',
              position: 'top',
            });
            await fetchItems();
            resolve();
          } catch (error: unknown) {
            console.error('Failed to delete item:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            Notify.create({
              type: 'negative',
              message: axiosError?.response?.data?.message || 'Failed to delete task.',
              position: 'top',
            });
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        })();
      }).onCancel(() => {
        reject(new Error('Cancelled'));
      });
    });
  };

  const registerProgress = async (id: number, data: RegisterProgressionRequest) => {
    try {
      await todoListService.registerProgression(id, data);
      Notify.create({
        type: 'positive',
        message: 'Progress registered successfully!',
        position: 'top',
      });
      await fetchItems();
      return true;
    } catch (error: unknown) {
      console.error('Failed to register progress:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      Notify.create({
        type: 'negative',
        message: axiosError?.response?.data?.message || 'Failed to register progress.',
        position: 'top',
      });
      return false;
    }
  };

  const getLatestProgress = (item: TodoItem): number | null => {
    if (!item.progressions || item.progressions.length === 0) {
      return null;
    }
    const latest = item.progressions[item.progressions.length - 1];
    return latest?.percent ?? null;
  };

  const getProgressColor = (percent: number): string => {
    if (percent < 30) return 'negative';
    if (percent < 70) return 'warning';
    return 'positive';
  };

  const getSortedProgressions = (item: TodoItem) => {
    if (!item.progressions) return [];
    return [...item.progressions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
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
  };
}
