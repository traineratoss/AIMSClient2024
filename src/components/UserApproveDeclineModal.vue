<script setup>
import CustomButton from "../components/CustomButton.vue";

const props = defineProps({
  show: Boolean,
  message: String
});

const emits = defineEmits(['ok']);

const vFocus = {
  mounted: (el) => {
    el.focus();
  }
};

function okClick() {
    emits('ok');
}
</script>

<template>
    <Transition name="popup">
        <div 
            v-if="show" 
            class="popup-mask"
            @click="okClick"
        >
            <div class="popup-container">
                <span class="material-symbols-outlined">
                    problem
                </span>
                {{ message }}
                <CustomButton
                    @click="okClick"
                    @keydown.enter="okClick"
                    v-focus
                >
                    OK
                </CustomButton>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.popup-default-button:hover{
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
</style>