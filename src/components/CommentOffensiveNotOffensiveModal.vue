<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  message: String,
  actionType: String 
});

const emits = defineEmits(['confirm', 'cancel']);

function handleConfirm() {
  emits('confirm', props.actionType);
}

function handleCancel() {
  emits('cancel');
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click.self="handleCancel">
      <div class="modal-container">
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-default-button1" @click="handleCancel">No</button>
          <button class="modal-default-button2" @click="handleConfirm">Yes</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-footer {
  width: 250px;
  text-align: center;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid slategray;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.modal-header h3 {
  margin-top: 0;
  color: #090909;
}

.modal-body {
  margin: 20px 0;
  font-weight: bold;
}

.modal-default-button1,
.modal-default-button2 {
  height: 30px;
  width: 60px;
  background-color: #fff;
  border: 1px solid slategray;
  border-radius: 5px;
  margin-right: 10px;
}

.modal-default-button1:hover {
  box-shadow: 0 2px 2px slategray;
  background-color: rgba(163, 161, 161, 0.565);
}
.modal-default-button2:hover {
  box-shadow: 0 2px 2px slategray;
  background-color: orange;
}

.modal-default-button:hover {
  box-shadow: 0 2px 2px slategray;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
