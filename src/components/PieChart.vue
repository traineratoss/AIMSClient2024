<script setup>
import { ref, reactive, watch, computed , onMounted} from "vue";

onMounted(async () => {
  animation()
  console.log(props.color1)
})


const props = defineProps({
    sizeInVW:'',
    speedInMS:'',
    firstValue:'',
    secondValue:'',
    thirdValue:'',
    color1:'',
    color2:'',
    color3:'',
    backgroundColor:''
})


const top1 = ref('')
const top2 = ref('')
const top3 = ref('')

top1.value = props.firstValue
top2.value = props.secondValue
top3.value = props.thirdValue

const color1 = props.color1
const color2 = props.color2
const color3 = props.color3
const backgroundColor = props.backgroundColor


/*
    More detailed comments will come in the future
    and a better impl. as well , most of the variabiles can be replaced with
    props.recieved value but at the moment i dont't have enough time for it
*/

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
  "repeating-conic-gradient(from 0deg,"+ color1 +" 0deg calc(3.6deg *" +
    p1.value +
    "),"+ color2 +" calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),"+ color3 +" calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),"+ backgroundColor +" calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

watch(recievedP2, (newValue) => {
  p2.value = recievedP1.value + newValue;

  style.value =
  "repeating-conic-gradient(from 0deg,"+ color1 +" 0deg calc(3.6deg *" +
    p1.value +
    "),"+ color2 +" calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),"+ color3 +" calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),"+ backgroundColor +" calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

watch(recievedP3, (newValue) => {
  p3.value = recievedP1.value + recievedP2.value + newValue;

  style.value =
  "repeating-conic-gradient(from 0deg,"+ color1 +" 0deg calc(3.6deg *" +
    p1.value +
    "),"+ color2 +" calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),"+ color3 +" calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),"+ backgroundColor +" calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"

  console.log("p1 = ", p1.value);
  console.log("p2 = ", p2.value);
  console.log("p3 = ", p3.value);
  console.log("p4 = ", p4.value);
});

const style = ref(
  "repeating-conic-gradient(from 0deg,"+ color1 +" 0deg calc(3.6deg *" +
    p1.value +
    "),"+ color2 +" calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    "),"+ color3 +" calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    "),"+ backgroundColor +" calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"
);


const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function animation() {
  for (let i = 1; i <= top1.value; i++) {
    await sleepNow(props.speedInMS)
    recievedP1.value ++ 
  }
  for (let i = 1; i <= top2.value; i++) {
    await sleepNow(props.speedInMS)
    recievedP2.value ++ 
  }
  for (let i = 1; i <= top3.value; i++) {
    await sleepNow(props.speedInMS)
    recievedP3.value ++ 
  }
}


const styleObject = ref({
  height: props.sizeInVW+'vw',
  width: props.sizeInVW+'vw',
  border : '1px solid slategray',
  background: style,
});
</script>

<template>
  <div class="pie-container">
    <div class="x-box" :style="styleObject"></div>
    <div class="x-box-cont">
      <strong style="color: #ff264a">P1 {{ recievedP1 }}%</strong>
      <strong style="color: #feec1e">P2 {{ recievedP2 }}%</strong>
      <strong style="color: #12cbc4">P3 {{ recievedP3 }}%</strong>
    </div>
  </div>
</template>

<style scoped>
.pie-container {
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
