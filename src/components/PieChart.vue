<script setup>
import { ref, watch, computed, onMounted } from "vue";

onMounted(async () => {
  await animation();
});

const props = defineProps({
  sizeInVW: "",
  speedInMS: "",
  openP: "",
  implP: "",
  draftP: "",
  colorOpen: "",
  colorImpl: "",
  colorDraft: "",
  backgroundColor: "",
  openIdeasNumber:"",
  implementedIdeasNumber:"",
  draftIdeasNumber:"",
});

const top1 = ref(parseFloat(props.openP) || 0);
const top2 = ref(parseFloat(props.implP) || 0);
const top3 = ref(parseFloat(props.draftP) || 0);

const colorOpen = props.colorOpen;
const colorImpl = props.colorImpl;
const colorDraft = props.colorDraft;
const backgroundColor = props.backgroundColor;

const recievedP1 = ref(0);
const recievedP2 = ref(0);
const recievedP3 = ref(0);

const p2 = computed(() => recievedP1.value + recievedP2.value);
const p3 = computed(() => recievedP1.value + recievedP2.value + recievedP3.value);
const p4 = ref(100);

const style = computed(() => {
  return `repeating-conic-gradient(from 0deg,${colorOpen} 0deg calc(3.6deg * ${recievedP1.value}),${colorImpl} calc(3.6deg * ${recievedP1.value}) calc(3.6deg * ${p2.value}),${colorDraft} calc(3.6deg * ${p2.value}) calc(3.6deg * ${p3.value}),${backgroundColor} calc(3.6deg * ${p3.value}) calc(3.6deg * ${p4.value}))`;
});

async function animation() {
  for (let i = 1; i <= top1.value; i++) {
    await sleepNow(parseFloat(props.speedInMS) || 100);
    recievedP1.value++;
  }
  for (let i = 1; i <= top2.value; i++) {
    await sleepNow(parseFloat(props.speedInMS) || 100);
    recievedP2.value++;
  }
  for (let i = 1; i <= top3.value; i++) {
    await sleepNow(parseFloat(props.speedInMS) || 100);
    recievedP3.value++;
  }
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const styleObject = computed(() => ({
  height: `${props.sizeInVW}vw`,
  width: `${props.sizeInVW}vw`,
  border: "1px solid slategray",
  background: style.value,
}));
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
        <td>{{props.openIdeasNumber}}</td>
        <td :style="{backgroundColor: colorOpen}"><strong>{{ recievedP1 }}%</strong></td>
      </tr>
      <tr>
        <td>Implemented</td>
        <td>{{props.implementedIdeasNumber}}</td>
        <td :style="{backgroundColor: colorImpl}"><strong>{{ recievedP2 }}%</strong></td>
      </tr>
      <tr>
        <td>Draft</td>
        <td>{{props.draftIdeasNumber}}</td>
        <td :style="{backgroundColor: colorDraft}"><strong>{{ recievedP3 }}%</strong></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
#idea-table {
  margin-top: 30px;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid slategray;
  text-align: center;
  width: 18vw;
  height: 10vh;
}

th {
  border-bottom: 1px solid slategray;
  font-size: 16px;
  padding: 5px;
}

td {
  font-size: 15px;
  padding: 2px;
}

strong {
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
