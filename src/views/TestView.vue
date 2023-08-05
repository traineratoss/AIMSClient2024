<script setup>
import { ref, reactive, watch, computed , onMounted} from "vue";

const props = defineProps({

})

onMounted(async () => {
  animation()
})

const top1 = ref(35)
const top2 = ref(25)
const top3 = ref(40)

const speed = ref(25)

const color1 = ref('red')
const color2 = ref('blue')
const color3 = ref('yellow')
const backgroundColor = ref('white')

const sizeInVW = ref(25)


const recievedP1 = ref(0);
const recievedP2 = ref(0);
const recievedP3 = ref(0);

const p1 = ref(recievedP1.value);

const p2 = computed(() => {
  return recievedP1.value + recievedP2.value;
});

const p3 = computed(() => {
  return recievedP1.value + recievedP2.value + recievedP3.value;
});

const p4 = ref(100);


watch(recievedP1, (newValue) => {
  p1.value = newValue;

  style.value =
    "repeating-conic-gradient(from 0deg,red 0deg calc(3.6deg *" +
    p1.value +
    "),yellow calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),blue calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),white calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

watch(recievedP2, (newValue) => {
  p2.value = recievedP1.value + newValue;

  style.value =
    "repeating-conic-gradient(from 0deg,red 0deg calc(3.6deg *" +
    p1.value +
    "),yellow calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),blue calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),white calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

watch(recievedP3, (newValue) => {
  p3.value = recievedP1.value + recievedP2.value + newValue;

  style.value =
    "repeating-conic-gradient(from 0deg,red 0deg calc(3.6deg *" +
    p1.value +
    "),yellow calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),blue calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),white calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

const style = ref(
  "repeating-conic-gradient(from 0deg,"+ color1.value +" 0deg calc(3.6deg *" +
    p1.value +
    "),"+ color2.value +" calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),"+ color3.value +" calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),"+ backgroundColor.value +" calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"
);


const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function animation() {
  for (let i = 1; i <= top1.value; i++) {
    await sleepNow(speed.value)
    recievedP1.value ++ 
    console.log(recievedP2.value)
  }
  for (let i = 1; i <= top2.value; i++) {
    await sleepNow(speed.value)
    recievedP2.value ++ 
    console.log(recievedP2.value)
  }
  for (let i = 1; i <= top3.value; i++) {
    await sleepNow(speed.value)
    recievedP3.value ++ 
    console.log(recievedP2.value)
  }
}


const styleObject = ref({
  height: sizeInVW.value+'vw',
  width: sizeInVW.value+'vw',
  border : '1px solid slategray',
  background: style,
});
</script>

<template>
  <div class="container">
    <div class="x-box" :style="styleObject"></div>
    <!-- <div class="x-box-cont">
      <strong style="color: #ff264a">P1 {{ recievedP1 }}%</strong>
      <strong style="color: #feec1e">P2 {{ recievedP2 }}%</strong>
      <strong style="color: #12cbc4">P3 {{ recievedP3 }}%</strong>
    </div> -->
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.x-box {
  border-radius: 50%;
}

.x-box-cont {
  font-size: 30px;
  padding-left: 50px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
.x-box-cont h1 {
  font-size: 30px;
  text-transform: uppercase;
}
.x-box-cont strong {
  display: block;
  margin-bottom: 15px;
}
</style>
