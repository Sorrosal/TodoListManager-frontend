<template>
  <div v-if="Object.keys(itemsByCategory).length > 0" class="col-12">
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
          <TodoItemCard
            :item="item"
            :progress="getLatestProgress(item)"
            :progress-color="getProgressColor(getLatestProgress(item) || 0)"
            @edit="$emit('edit', item)"
            @add-progress="$emit('add-progress', item)"
            @view-history="$emit('view-history', item)"
            @delete="$emit('delete', item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoItemCard from './TodoItemCard.vue';
import type { TodoItem } from 'src/models';

interface Props {
  itemsByCategory: Record<string, TodoItem[]>;
  getLatestProgress: (item: TodoItem) => number | null;
  getProgressColor: (percent: number) => string;
}

defineProps<Props>();

defineEmits<{
  (e: 'edit', item: TodoItem): void;
  (e: 'add-progress', item: TodoItem): void;
  (e: 'view-history', item: TodoItem): void;
  (e: 'delete', item: TodoItem): void;
}>();
</script>
