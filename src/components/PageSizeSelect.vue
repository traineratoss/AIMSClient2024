<script setup>
import { ref } from "vue";

const props = defineProps({
  label: String,
});

const emits = defineEmits(["change-display"]);
const pageSize = ref(5);

function changeDisplay() {
  emits("change-display", pageSize.value);
}
</script>

<template>
  <div class="pageSizeDropdown">
    <label for="pageSize">{{ label }} </label>
    <select
      name="pageSize"
      id="pageSize"
      @change="changeDisplay"
      v-model="pageSize"
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="50">50</option>
    </select>
  </div>
</template>

<style scoped>
.pageSizeDropdown {
  display: flex;
  gap: 10px;
}
</style>