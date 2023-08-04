<script setup>
import { ref,defineProps,watchEffect, onMounted } from 'vue';


const slides = defineProps(['images', 'selectedImage']);
const emit = defineEmits(['current-index', 'selected-image-values']);
const avatarId = parseInt(localStorage.getItem('avatarId'));
const currentIndex = ref(0);
const selectedImageBase64 = ref(slides.images[0]);
const selectedImageType = ref(slides.images[0])
const selectedImageName = ref(slides.images[0]);

onMounted(async() => {
  currentIndex.value = 0;
  const base64Index = slides.images[currentIndex.value].indexOf(',') + 1;
  const base64Data = slides.images[currentIndex.value].slice(base64Index);
  selectedImageBase64.value = base64Data;

  const indexOfBase64 = slides.images[currentIndex.value].indexOf(";base64");
  const everythingBeforeBase64 = slides.images[currentIndex.value].substring(0, indexOfBase64);

  const indexOfEqual = everythingBeforeBase64.indexOf("=");
  selectedImageName.value = everythingBeforeBase64.substring(indexOfEqual+1, everythingBeforeBase64.length);

  selectedImageType.value = everythingBeforeBase64.substring(everythingBeforeBase64.indexOf(":")+1, everythingBeforeBase64.indexOf(";")) ;

  emit('current-index', currentIndex.value);
  emit('selected-image-values', selectedImageBase64.value, selectedImageName.value, selectedImageType.value );

  console.log(selectedImageName.value)
})


const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.images.length) % slides.images.length;
  const base64Index = slides.images[currentIndex.value].indexOf(',') + 1;
  const base64Data = slides.images[currentIndex.value].slice(base64Index);
  selectedImageBase64.value = base64Data;

  const indexOfBase64 = slides.images[currentIndex.value].indexOf(";base64");
  const everythingBeforeBase64 = slides.images[currentIndex.value].substring(0, indexOfBase64);

  const indexOfEqual = everythingBeforeBase64.indexOf("=");
  selectedImageName.value = everythingBeforeBase64.substring(indexOfEqual+1, everythingBeforeBase64.length);

  selectedImageType.value = everythingBeforeBase64.substring(everythingBeforeBase64.indexOf(":")+1, everythingBeforeBase64.indexOf(";")) ;

  emit('current-index', currentIndex.value);
  emit('selected-image-values', selectedImageBase64.value, selectedImageName.value, selectedImageType.value );
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.images.length;
  const base64Index = slides.images[currentIndex.value].indexOf(',') + 1;
  const base64Data = slides.images[currentIndex.value].slice(base64Index);
  selectedImageBase64.value = base64Data;

  const indexOfBase64 = slides.images[currentIndex.value].indexOf(";base64");
  const everythingBeforeBase64 = slides.images[currentIndex.value].substring(0, indexOfBase64);

  const indexOfEqual = everythingBeforeBase64.indexOf("=");
  selectedImageName.value = everythingBeforeBase64.substring(indexOfEqual+1, everythingBeforeBase64.length);

  selectedImageType.value = everythingBeforeBase64.substring(everythingBeforeBase64.indexOf(":")+1, everythingBeforeBase64.indexOf(";")) ;

  emit('current-index', currentIndex.value);
  emit('selected-image-values', selectedImageBase64.value, selectedImageName.value, selectedImageType.value );
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