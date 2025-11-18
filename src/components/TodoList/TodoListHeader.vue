<template>
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
        @click="$emit('add-task')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'add-task'): void;
}>();
</script>
