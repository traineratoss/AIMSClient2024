<script setup>
import CustomInput from "./CustomInput.vue";
import { ref } from "vue";

const showPassword = ref(false);
const showBorder = ref(false);

const props = defineProps({
  label: String,
  value: String,
});

const emits = defineEmits(["enter-password", "password-changed"]);

function changeShowPassword() {
  showPassword.value = !showPassword.value;
  showBorder.value = !showBorder.value;
}

function sendPassword(text) {
  emits("password-changed", text);
}

function handleEnterPress() {
  emits("enter-password");
}
</script>

<template>
  <div id="password-container" :class="{ 'input-border': showBorder }">
    <CustomInput
      :type="showPassword ? 'text' : 'password'"
      :placeholder="label"
      @update:model-value="sendPassword"
      :model-value="value"
      @keydown.enter="handleEnterPress"
      @focus="showBorder = true"
      @blur="showBorder = false"
      id="password-input"
    />
    <button style="background-color: white" @click="changeShowPassword">
      <span
        class="material-symbols-outlined"
        style="cursor: pointer; font-size: 20px"
      >
        {{ showPassword ? "visibility_off" : "visibility" }}
      </span>
    </button>
  </div>
</template>

<style scoped>
input {
  padding: 5px;
  border: none;
}

#password-container {
  display: flex;
  outline: none;
}

#password-input {
  width: 6vw;
  outline: none;
}
.input-border {
  border: 1px solid black;
}

button {
  border: none;
  width: 2vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

button,
button:focus {
  border: none;
  outline: none;
}
</style>