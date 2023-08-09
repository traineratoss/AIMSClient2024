<script setup>
import sampleText from "../assets/termsAndConditions/termsAndConditions.js";
import CustomButton from "../components/CustomButton.vue";

const props = defineProps({
  show: Boolean,
});

const fileContent = sampleText;

const vFocus = {
  mounted: (el) => {
    el.focus();
  }
}

const emits = defineEmits(["accepted-terms-and-conditions", "declined-terms-and-conditions"]);

function acceptTermsAndConditions() {
  emits("accepted-terms-and-conditions");
}

function declineTermsAndConditions() {
  emits("declined-terms-and-conditions");
}
</script>

<template>
  <Transition name="popup">
    <div 
      v-if="show" 
      class="popup-mask"
      @click="declineTermsAndConditions"
    >
      <div 
        class="popup-container"
        @keydown.enter="acceptTermsAndConditions"
        tabindex="0"
      >
        <div id="container" class="text-color">
          <h1 id="title">Terms & Conditions</h1>
          <div id="text-container" v-html="fileContent"></div>
        </div>
        <CustomButton 
          @click="acceptTermsAndConditions"
          v-focus
          style="width: auto;"
        >
          I've read and accepted the Terms & Conditions
        </CustomButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.popup-default-button:hover {
  box-shadow: 0 2px 2px slategray;
}

.material-symbols-outlined {
  font-size: 40px;
}

button:hover {
  cursor: pointer;
}

.popup-mask {
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

.popup-container {
  width: 85%;
  height: 85%;
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
  gap: 1vh;
}

.popup-enter-from {
  opacity: 0;
}

.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .popup-container,
.popup-leave-to .popup-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#title {
  font-size: 30px;
}

p {
  color: black;
}

.text-color {
  color: var(--selected-color);
}

#text-container {
  width: 75%;
  height: 50%;
  overflow: auto;
  border: 1px solid black;
  padding: 10px;
  background-color: white;
  color: black;
}

#container {
  position: relative;
  top: 20px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  gap: 100px;
  height: 100%;
}

button {
  background-color: var(--selected-color);
  border-width: 0.5px;
  padding: 5px;
  cursor: pointer;
  position: absolute;
  right: 13%;
  bottom: 10vh;
}
</style>