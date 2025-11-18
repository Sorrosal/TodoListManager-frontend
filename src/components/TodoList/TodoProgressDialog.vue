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
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  progressData: {
    date: string;
    percent: number;
  };
  isSaving: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save'): void;
}>();
</script>
