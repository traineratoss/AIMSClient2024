<script setup>

</script>

<template>
<div class="slider">
    <div class="arrows-carousel">
    <i class="fa-solid fa-arrow-left fa-2xl" style="color: #ffa941;"></i>
  </div>
  <div class="slides">
    <div id="slide-1">
      1
    </div>
    <div id="slide-2">
      2
    </div>
    <div id="slide-3">
      3
    </div>
    <div id="slide-4">
      4
    </div>
    <div id="slide-5">
      5
    </div>
  </div>
  <div class="arrows-carousel-left">
    <i class="fa-solid fa-arrow-right fa-2xl" style="color: #ffa941;"></i>
  </div>
</div>

</template>

<style scoped>

* {
  box-sizing: content-box;
}

.slider {
  width: 300px;
  text-align: center;
  overflow: hidden;
 padding-top: 20px;
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
}

.slides {
  display: flex;
  
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
}
.slides::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.slides::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 10px;
}
.slides::-webkit-scrollbar-track {
  background: transparent;
}
.slides > div {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  margin-right: 50px;
  border-radius: 30px;
  background: #eee;
  transform-origin: center center;
  transform: scale(1);
  transition: transform 0.5s;
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
}


</style>