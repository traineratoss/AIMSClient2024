<script setup>
import { ref, computed } from 'vue';

const code = ref(["", "", "", "", "", ""]);
const inputRef = ref([]);

const emits = defineEmits(['otp-updated']);

function setInputRef(index) {
  return function(el) {
    inputRef.value[index] = el;
  };
}

function onInput(index, event) {
  const value = event.target.value;
  if (/^\d$/.test(value)) { //check if the value is a number between 0-9
    code.value[index] = value;
    if (index < code.value.length - 1) {
      inputRef.value[index + 1].focus();
    }
  } else {
    code.value[index] = "";
  }

  emits("otp-updated", code.value, !code.value.includes(""));
}

function onKeydown(event, index) {
  if (event.key === "Backspace" && code.value[index] === '' && index > 0) {
    inputRef.value[index - 1].focus();
  }
}

const boxes = computed(() => code.value);
</script>

<template>
  <div class="code-validation">
    <input 
      v-for="(box, index) in boxes" :key="index" v-model="code[index]"
      @input="onInput(index, $event)" 
      @keydown="onKeydown($event, index)" 
      maxlength="1" class="code-input" type="text" :ref="setInputRef(index)" 
    />
  </div>
</template>

<style scoped>
.code-validation {
  display: flex;
  gap: 10px;
}

.code-input {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 24px;
}
</style>
