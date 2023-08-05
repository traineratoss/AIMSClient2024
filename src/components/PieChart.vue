<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";

onMounted(async () => {
  animation();
});

const props = defineProps({
  sizeInVW: "",
  speedInMS: "",
  firstValue: "",
  secondValue: "",
  thirdValue: "",
  color1: "",
  color2: "",
  color3: "",
  backgroundColor: "",
  firstNumber:"",
  secondNumber:"",
  thirdNumber:"",
  test:""
});

const top1 = ref("");
const top2 = ref("");
const top3 = ref("");

top1.value = props.firstValue;
top2.value = props.secondValue;
top3.value = props.thirdValue;

const color1 = props.color1;
const color2 = props.color2;
const color3 = props.color3;
const test = props.test
const backgroundColor = props.backgroundColor;

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
    "repeating-conic-gradient(from 0deg," +
    color1 +
    " 0deg calc(3.6deg *" +
    p1.value +
    ")," +
    color2 +
    " calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    ")," +
    color3 +
    " calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    ")," +
    backgroundColor +
    " calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";
});

watch(recievedP2, (newValue) => {
  p2.value = recievedP1.value + newValue;

  style.value =
    "repeating-conic-gradient(from 0deg," +
    color1 +
    " 0deg calc(3.6deg *" +
    p1.value +
    ")," +
    color2 +
    " calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    ")," +
    color3 +
    " calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    ")," +
    backgroundColor +
    " calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";
});

watch(recievedP3, (newValue) => {
  p3.value = recievedP1.value + recievedP2.value + newValue;

  style.value =
    "repeating-conic-gradient(from 0deg," +
    color1 +
    " 0deg calc(3.6deg *" +
    p1.value +
    ")," +
    color2 +
    " calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    ")," +
    color3 +
    " calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    ")," +
    backgroundColor +
    " calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))";
});

const style = ref(
  "repeating-conic-gradient(from 0deg," +
    color1 +
    " 0deg calc(3.6deg *" +
    p1.value +
    ")," +
    color2 +
    " calc(3.6deg *" +
    p1.value +
    ") calc(3.6deg * " +
    p2.value +
    ")," +
    color3 +
    " calc(3.6deg * " +
    p2.value +
    ") calc(3.6deg * " +
    p3.value +
    ")," +
    backgroundColor +
    " calc(3.6deg * " +
    p3.value +
    ") calc(3.6deg * " +
    p4.value +
    "))"
);

const sleepNow = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

async function animation() {
  for (let i = 1; i <= top1.value; i++) {
    await sleepNow(props.speedInMS);
    recievedP1.value++;
  }
  for (let i = 1; i <= top2.value; i++) {
    await sleepNow(props.speedInMS);
    recievedP2.value++;
  }
  for (let i = 1; i <= top3.value; i++) {
    await sleepNow(props.speedInMS);
    recievedP3.value++;
  }
}

const styleObject = ref({
  height: props.sizeInVW + "vw",
  width: props.sizeInVW + "vw",
  border: "1px solid slategray",
  background: style,
});
</script>

<template>
  <div class="pie-container">
    <div class="x-box" :style="styleObject"></div>
    <table id="idea-table">
  <tr>
    <th>STATUS</th>
    <th>Number</th>
    <th>Percentage</th>
  </tr>
  <tr>
    <td>Open</td>
    <td>{{props.firstNumber}}</td>
    <td :style="{backgroundColor:color1}"><strong>{{ recievedP1 }}%</strong></td>
  </tr>
  <tr>
    <td>Implemented</td>
    <td>{{props.secondNumber}}</td>
    <td :style="{backgroundColor:color2}"> <strong>{{ recievedP2 }}%</strong>
</td>
  </tr>
  <tr>
    <td>Draft</td>
    <td>{{props.thirdNumber}}</td>
    <td :style="{backgroundColor:color3}"><strong>{{ recievedP3 }}%</strong>
</td>
  </tr>
</table>
  </div>
</template>

<style scoped>

#idea-table{
    margin-top: 30px;
    table-layout: fixed;
    border-collapse:collapse;
    border: 1px solid slategray;
    text-align: center;
    width: 18vw;
    height: 10vh;
}

th{
    border-bottom: 1px solid slategray;
    font-size: 16px;
    padding: 5px;
}

td{
    font-size: 15px;
    padding: 2px;
}

strong{
    font-size: 17px;
}

.pie-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.x-box {
  margin-top: 20px;
  border-radius: 50%;
}

.x-box-cont {
  margin-top: 10px;
  font-size: 20px;
  display: grid;
  gap: 10px;
  grid-template-columns: 33% 33% 33%;
}
</style>
