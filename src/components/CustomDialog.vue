
<script setup>
import { ref, defineProps,onMounted, nextTick, defineExpose } from 'vue';


const dialogRef = ref(null);
const props = defineProps({
  open: Boolean,
  title:String,
  message:String
});

defineExpose({
  close:closeModal,
});

onMounted(() =>{
  nextTick();
  console.log(dialogRef.value);
  if(props.open){
    dialogRef.value.showModal();
  }
});

function closeModal(){
  dialogRef.value.close();
}

</script>

<template>

  <div v-if="open" class="dialog-container">
    <div class="dialog">
      <dialog ref="dialogRef">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <slot></slot>
      </dialog>
    </div>
  </div>

</template>
  
<style scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
dialog{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.dialog dialog {
  border: 1px solid slategray;
}

</style>

