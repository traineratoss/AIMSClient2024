<script setup>
import { ref, defineProps, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import CustomLoader from './CustomLoader.vue';

const props = defineProps({
  images: Array,
  selectedImage: String,
  initialCurrentIndex: [Number, Promise],
  disabledArrow: [Boolean, Promise],
  imageHeightPercentage: Number,
  hiddenArrows: Boolean
});

const emit = defineEmits(['current-index', 'selected-image-values']);

const route = useRoute();

//Initially set it to yours and if im on create idea, it will update automatically 
const imagesLoaded = ref(false);
const currentIndex = ref(0);

const selectedImageBase64 = ref(null);
const selectedImageType = ref(null);
const selectedImageName = ref(null);
const shouldDisableArrowsRef = ref(false);

// Utility function to extract image data
function transformImageDataIntoValues(dataString) {
  const base64Index = dataString.indexOf(',') + 1;
  const base64Data = dataString.slice(base64Index);
  selectedImageBase64.value = base64Data;

  const indexOfBase64 = dataString.indexOf(";base64");
  const stringBeforeBase64 = dataString.substring(0, indexOfBase64);

  const indexOfEqual = stringBeforeBase64.indexOf("=");
  selectedImageName.value = stringBeforeBase64.substring(indexOfEqual + 1, stringBeforeBase64.length);

  selectedImageType.value = stringBeforeBase64.substring(stringBeforeBase64.indexOf(":") + 1, stringBeforeBase64.indexOf(";"));
}

// Watch for changes to images and handle loading
watch(() => props.images, (newValue) => {
  if (newValue.length > 0 && !imagesLoaded.value) {
    if (route.path === "/create-idea") {
      currentIndex.value = 0;
      updateImageData(currentIndex.value);
      imagesLoaded.value = true;
    }
  }
}, { immediate: true });

// Watch for initial index changes
watch(() => props.initialCurrentIndex, async (newValue) => {
  if (route.path === "/create-idea" && !imagesLoaded.value && props.images.length > 0) {
    currentIndex.value = await Promise.resolve(newValue);
    updateImageData(currentIndex.value);
  }
});

// Watch for disabled arrow changes
watch(() => props.disabledArrow, async (newValue) => {
  if (route.path === "/create-idea") {
    shouldDisableArrowsRef.value = await Promise.resolve(newValue);
  }
});

// Watch for image uploads
watch(() => props.images.length, (newLength) => {
  if (newLength > 0) {
    currentIndex.value = newLength - 1;
    updateImageData(currentIndex.value);
  }
});

// Update image data and emit events
function updateImageData(index) {
  transformImageDataIntoValues(props.images[index]);
  emit('current-index', index);
  emit('selected-image-values', selectedImageBase64.value, selectedImageName.value, selectedImageType.value);
}

// Slide navigation
const prevSlide = () => {
  if (!shouldDisableArrowsRef.value) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
    updateImageData(currentIndex.value);
  }
};

const nextSlide = () => {
  if (!shouldDisableArrowsRef.value) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
    updateImageData(currentIndex.value);
  }
};

onMounted(() => {
  if (route.name === 'my-profile') {
    imagesLoaded.value = true;
  }
});

// Computed style for carousel
// const carouselStyle = computed(() => ({
//   padding: shouldDisableArrowsRef.value ? '3rem' : '0'
// }));

const slidesTransformStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
}));

const carouselBorderStyle = computed(() => ({
  border: route.name === 'create-idea' ? '4px solid gray' : '0px',
  borderRadius: route.name === 'create-idea' ? '10px' : '0px',
}));


</script>

<template>
  <div class="carousel">
    <button @click="prevSlide" :disabled="shouldDisableArrowsRef || !imagesLoaded">
      <i class="fa-solid fa-arrow-left fa-2xl" id="arrow"></i>
    </button>
    <div class="slide-container" :style="imagesLoaded ? carouselBorderStyle : {}">
      <div class="slides" :style="slidesTransformStyle" v-if="imagesLoaded">
        <div
            v-for="(slide, index) in images"
            :key="index"
            class="slide"
            :class="{ active: currentIndex === index }"
        >
          <img :src="slide" :style="{ height: imageHeightPercentage + '%' }" />
        </div>
      </div>
      <div v-if="!imagesLoaded" class="slides">
        <CustomLoader :size="45" />
      </div>
    </div>
    <button @click="nextSlide" :disabled="shouldDisableArrowsRef || !imagesLoaded">
      <i class="fa-solid fa-arrow-right fa-2xl" id="arrow2"></i>
    </button>
  </div>
</template>


<style scoped>
#arrow:hover, #arrow2:hover {
  color: #ffa941;
}

#arrow, #arrow2 {
  color: gray;
}

.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 10;
}

#custom-loader {
  height: 180px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-container {
  display: flex;
  overflow: hidden;
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
  width: 100%;
}
</style>
