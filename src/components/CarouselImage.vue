<script setup>
import { ref, defineProps } from "vue";

const slides = defineProps(["images"]);
const emit = defineEmits(["current-index"]);
const avatarId = parseInt(localStorage.getItem("avatarId"));
const currentIndex = ref(avatarId);

console.log("index>>", currentIndex.value);

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + slides.images.length) % slides.images.length;
  emit("current-index", currentIndex.value);
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.images.length;
  emit("current-index", currentIndex.value);
};
</script>

<template>
  <div class="carousel">
    <button @click="prevSlide">
      <i class="fa-solid fa-arrow-left fa-2xl" style="color: #ffa941"></i>
    </button>
    <div class="slide-container">
      <div
        class="slides"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(slide, index) in images"
          :key="index"
          class="slide"
          :class="{ active: currentIndex === index }"
        >
          <img :src="slide" />
        </div>
      </div>
    </div>
    <button @click="nextSlide">
      <i class="fa-solid fa-arrow-right fa-2xl" style="color: #ffa941"></i>
    </button>
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  z-index: 10;
  margin-top: 10px;
  height: 20vh;
}

.slide-container {
  display: flex;
  overflow: hidden;
  border: 1px solid #ccc;
  margin: 0 10px;
  max-width: 300px;
}

.slides {
  display: flex;
  transition: transform 0.3s ease;
}

.slide {
  flex: 0 0 100%;
  background-color: transparent;
  box-sizing: border-box;
}

.slide.active {
  border: none;
}

button {
  margin: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

img {
  height: 100%;
  width: 100%;
}
</style>