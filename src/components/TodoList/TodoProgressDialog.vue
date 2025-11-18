<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Register Progress</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="$emit('save')" class="q-gutter-md">
          <q-input
            v-model="progressData.date"
            label="Date and Time"
            type="datetime-local"
            outlined
            :rules="[(val) => !!val || 'Date is required']"
          />
          <div>
            <div class="row items-center q-mb-xs">
              <label class="text-subtitle2">Progress (%)</label>
              <q-space />
              <div class="text-caption text-weight-bold">{{ progressData.percent }}%</div>
            </div>
            <div class="row items-center">
              <q-slider
                v-model.number="progressData.percent"
                :min="0"
                :max="100"
                :step="1"
                dense
                label
                @update:model-value="onSliderUpdate"
              />
            </div>
          </div>

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
interface Props {
  modelValue: boolean;
  progressData: {
    date: string | undefined;
    percent: number;
  };
  isSaving: boolean;
  minPercent?: number;
}

defineEmits<{
  'update:modelValue': [value: boolean];
  'save': [];
}>();

import { computed } from 'vue';

const props = defineProps<Props>();

const minPercentComputed = computed(() => {
  return typeof props.minPercent === 'number' ? props.minPercent : 0;
});

const remaining = computed(() => Math.max(0, 100 - (props.progressData?.percent ?? 0)));

function onSliderUpdate (value: number | null) {
  // Prevent user from moving slider below the current accumulated progress
  const min = minPercentComputed.value ?? 0;
  const v = value ?? min;
  if (v < min) {
    // reset to min
    props.progressData.percent = min;
  } else {
    props.progressData.percent = v;
  }
}
</script>
