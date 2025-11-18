<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">
          {{ editingItem ? 'Edit Task' : 'Add New Task' }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="$emit('save')" class="q-gutter-md">
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
          <q-select
            v-if="!editingItem"
            v-model="formData.category"
            :options="['Work', 'Personal', 'Learning']"
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
</template>

<script setup lang="ts">
import type { TodoItem } from 'src/models';

interface Props {
  modelValue: boolean;
  editingItem: TodoItem | null;
  formData: {
    title: string;
    description: string;
    category: string;
  };
  isSaving: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
  'save': [];
}>();
</script>
