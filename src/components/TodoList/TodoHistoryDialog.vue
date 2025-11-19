<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Progress History</div>
        <div v-if="historyItem" class="text-subtitle2 text-grey-7">
          {{ historyItem.title }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list
          separator
          v-if="historyItem && historyItem.progressions && historyItem.progressions.length > 0"
        >
          <q-item v-for="(progression, index) in sortedProgressions" :key="index">
            <q-item-section>
              <q-item-label class="text-caption text-grey-7">
                {{ formatDate(progression.date) }}
              </q-item-label>
              <div class="q-mt-xs">
                <div class="row items-center">
                  <div class="text-weight-bold q-mr-sm">{{ progression.cumulativePercent }}%</div>
                  <q-linear-progress
                    :value="progression.cumulativePercent / 100"
                    :color="getProgressColor(progression.cumulativePercent)"
                    size="6px"
                    rounded
                    class="col"
                  />
                </div>
                <div class="text-caption text-grey-6">+{{ progression.percent }}% added</div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-center text-grey-7 q-py-md">No progress history available</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TodoItem } from 'src/models';

interface Props {
  modelValue: boolean;
  historyItem: TodoItem | null;
  getSortedProgressions: (
    item: TodoItem,
  ) => Array<{ date: string; percent: number; cumulativePercent: number }>;
  formatDate: (date: string) => string;
  getProgressColor: (percent: number) => string;
}

const props = defineProps<Props>();

const sortedProgressions = computed(() => {
  if (!props.historyItem) return [];
  return props.getSortedProgressions(props.historyItem);
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
