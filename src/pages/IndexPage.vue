<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <q-space />
      <q-btn
        color="primary"
        icon="add"
        label="Add"
        @click="showAddDialog = true"
      />
    </div>

    <q-table
      :rows="items"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :rows-per-page-options="[10, 25, 50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            @click="editItem(props.row)"
          />
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            @click="deleteItem(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newItem.name"
            label="Name"
            outlined
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="newItem.description"
            label="Description"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            label="Save"
            color="primary"
            @click="addItem"
            :disable="!newItem.name"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableColumn } from 'quasar';

interface Item {
  id: number;
  name: string;
  description: string;
}

const columns: QTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
];

const items = ref<Item[]>([
  { id: 1, name: 'Item 1', description: 'Description of item 1' },
  { id: 2, name: 'Item 2', description: 'Description of item 2' },
  { id: 3, name: 'Item 3', description: 'Description of item 3' },
]);

const showAddDialog = ref(false);
const newItem = ref<Omit<Item, 'id'>>({
  name: '',
  description: '',
});

function addItem() {
  if (!newItem.value.name) return;

  const newId = Math.max(...items.value.map(item => item.id), 0) + 1;
  items.value.push({
    id: newId,
    ...newItem.value,
  });

  // Reset form
  newItem.value = {
    name: '',
    description: '',
  };
  showAddDialog.value = false;
}

function editItem(item: Item) {
  // Implement edit logic
  console.log('Edit:', item);
}

function deleteItem(id: number) {
  const index = items.value.findIndex(item => item.id === id);
  if (index !== -1) {
    items.value.splice(index, 1);
  }
}
</script>
