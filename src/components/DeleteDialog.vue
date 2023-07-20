<template>
    <div class="dialog-container">
      <div class="dialog-content">
        <p>Are you sure you want to delete "{{ title }}"?</p>
        <button @click="$emit('delete')">Delete</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const { title } = defineProps(["title"]);
  const { emit } = defineEmits();
  
  function handleDelete() {
    emit("delete");
  }
  
  function cancelDelete() {
    emit("cancel");
  }
  </script>
  
  <style scoped>
  .delete-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: white;
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .delete-dialog p {
    margin-bottom: 10px;
  }
  
  .delete-dialog button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  