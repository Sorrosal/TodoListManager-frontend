<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ item.title }}</div>
      <div class="text-grey-7 q-mb-md">{{ item.description }}</div>
      
      <!-- Progress Bar -->
      <div v-if="progress !== null" class="q-mt-md">
        <div class="row items-center q-mb-xs">
          <div class="text-caption text-grey-7">Progress</div>
          <q-space />
          <div class="text-caption text-weight-bold">
            {{ progress }}%
          </div>
        </div>
        <q-linear-progress
          :value="progress / 100"
          :color="progressColor"
          size="8px"
          rounded
        />
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        icon="edit"
        color="primary"
        @click="$emit('edit', item)"
      >
        <q-tooltip>Edit</q-tooltip>
      </q-btn>
      <q-btn
        flat
        icon="trending_up"
        color="accent"
        @click="$emit('add-progress', item)"
      >
        <q-tooltip>Add Progress</q-tooltip>
      </q-btn>
      <q-btn
        v-if="item.progressions && item.progressions.length > 0"
        flat
        icon="history"
        color="info"
        @click="$emit('view-history', item)"
      >
        <q-tooltip>View History</q-tooltip>
      </q-btn>
      <q-btn
        flat
        icon="delete"
        color="negative"
        @click="$emit('delete', item)"
      >
        <q-tooltip>Delete</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TodoItem } from 'src/models';

interface Props {
  item: TodoItem;
  progress: number | null;
  progressColor: string;
}

defineProps<Props>();

defineEmits<{
  (e: 'edit', item: TodoItem): void;
  (e: 'add-progress', item: TodoItem): void;
  (e: 'view-history', item: TodoItem): void;
  (e: 'delete', item: TodoItem): void;
}>();
</script>
