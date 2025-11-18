<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Header Section -->
      <div class="col-12">
        <div class="row items-center justify-between">
          <div class="col-auto">
            <div class="text-h4">My Todo List</div>
            <div class="text-subtitle2 text-grey-7">
              Manage your tasks efficiently
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="Add Task"
              @click="showAddDialog = true"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="col-12 text-center q-py-xl">
        <q-spinner color="primary" size="50px" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="items.length === 0"
        class="col-12 text-center q-py-xl"
      >
        <q-icon name="task_alt" size="80px" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No tasks yet</div>
        <div class="text-subtitle2 text-grey-6">
          Click "Add Task" to create your first todo item
        </div>
      </div>

      <!-- Todo Items by Category -->
      <div v-else class="col-12">
        <div
          v-for="(categoryItems, category) in itemsByCategory"
          :key="category"
          class="q-mb-lg"
        >
          <div class="text-h6 q-mb-md">{{ category }}</div>
          <div class="row q-col-gutter-md">
            <div
              v-for="item in categoryItems"
              :key="item.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{ item.title }}</div>
                  <div class="text-grey-7">{{ item.description }}</div>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn
                    flat
                    icon="edit"
                    color="primary"
                    @click="editItem(item)"
                  />
                  <q-btn
                    flat
                    icon="trending_up"
                    color="accent"
                    @click="showProgressDialog(item)"
                  />
                  <q-btn
                    flat
                    icon="delete"
                    color="negative"
                    @click="confirmDelete(item)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            {{ editingItem ? 'Edit Task' : 'Add New Task' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveItem" class="q-gutter-md">
            <q-input
              v-if="!editingItem"
              v-model="formData.title"
              label="Title"
              outlined
              :rules="[(val) => !!val || 'Title is required']"
            />
            <q-input
              v-model="formData.description"
              label="Description"
              type="textarea"
              outlined
              rows="3"
              :rules="[(val) => !!val || 'Description is required']"
            />
            <q-input
              v-if="!editingItem"
              v-model="formData.category"
              label="Category"
              outlined
              :rules="[(val) => !!val || 'Category is required']"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                type="submit"
                color="primary"
                label="Save"
                :loading="isSaving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Progress Dialog -->
    <q-dialog v-model="showProgressDialogFlag">
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Register Progress</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveProgress" class="q-gutter-md">
            <q-input
              v-model="progressData.date"
              label="Date"
              type="date"
              outlined
              :rules="[(val) => !!val || 'Date is required']"
            />
            <q-input
              v-model.number="progressData.percent"
              label="Progress (%)"
              type="number"
              outlined
              min="0"
              max="100"
              :rules="[
                (val) => val !== null || 'Progress is required',
                (val) => val >= 0 && val <= 100 || 'Must be between 0 and 100',
              ]"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                type="submit"
                color="primary"
                label="Save"
                :loading="isSaving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Dialog, Notify } from 'quasar';
import { todoListService } from 'src/services';
import type { TodoItem } from 'src/models';

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

const showAddDialog = ref(false);
const showProgressDialogFlag = ref(false);
const isSaving = ref(false);
const editingItem = ref<TodoItem | null>(null);
const progressItem = ref<TodoItem | null>(null);

const formData = ref({
  title: '',
  description: '',
  category: '',
});

const progressData = ref({
  date: new Date().toISOString().split('T')[0],
  percent: 0,
});

onMounted(async () => {
  await fetchItems();
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

const editItem = (item: TodoItem) => {
  editingItem.value = item;
  formData.value = {
    title: item.title,
    description: item.description,
    category: item.category,
  };
  showAddDialog.value = true;
};

const showProgressDialog = (item: TodoItem) => {
  progressItem.value = item;
  progressData.value = {
    date: new Date().toISOString().split('T')[0],
    percent: 0,
  };
  showProgressDialogFlag.value = true;
};

const saveItem = async () => {
  isSaving.value = true;
  try {
    if (editingItem.value) {
      await todoListService.updateItem(editingItem.value.id, {
        description: formData.value.description,
      });
      Notify.create({
        type: 'positive',
        message: 'Task updated successfully!',
        position: 'top',
      });
    } else {
      await todoListService.addItem(formData.value);
      Notify.create({
        type: 'positive',
        message: 'Task added successfully!',
        position: 'top',
      });
    }
    showAddDialog.value = false;
    resetForm();
    await fetchItems();
  } catch (error: unknown) {
    console.error('Failed to save item:', error);
    const axiosError = error as { response?: { data?: { message?: string } } };
    Notify.create({
      type: 'negative',
      message: axiosError?.response?.data?.message || 'Failed to save task.',
      position: 'top',
    });
  } finally {
    isSaving.value = false;
  }
};

const saveProgress = async () => {
  if (!progressItem.value) return;

  isSaving.value = true;
  try {
    await todoListService.registerProgression(progressItem.value.id, {
      date: new Date(progressData.value.date || new Date()).toISOString(),
      percent: progressData.value.percent,
    });
    Notify.create({
      type: 'positive',
      message: 'Progress registered successfully!',
      position: 'top',
    });
    showProgressDialogFlag.value = false;
    await fetchItems();
  } catch (error: unknown) {
    console.error('Failed to register progress:', error);
    const axiosError = error as { response?: { data?: { message?: string } } };
    Notify.create({
      type: 'negative',
      message: axiosError?.response?.data?.message || 'Failed to register progress.',
      position: 'top',
    });
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (item: TodoItem) => {
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
      } catch (error: unknown) {
        console.error('Failed to delete item:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        Notify.create({
          type: 'negative',
          message: axiosError?.response?.data?.message || 'Failed to delete task.',
          position: 'top',
        });
      }
    })();
  });
};

const resetForm = () => {
  editingItem.value = null;
  formData.value = {
    title: '',
    description: '',
    category: '',
  };
};
</script>
