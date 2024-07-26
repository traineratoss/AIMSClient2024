<script setup>
import { ref, defineProps, defineEmits } from "vue";
import UserApproveDeclineModal from "./UserApproveDeclineModal.vue";

const props = defineProps({
  content: String,
});
           
const showPopup = ref(false);
const popupMessage = ref('');
//const emit = defineEmits(["activation-successful", "deactivation-successful", 'multiple-admin-action']);
const showOptions = ref(false);


function handleOK() {
  showPopup.value = false;
  emit('multiple-admin-action');
}
</script>

<template>
  <div 
    class="comment"
  >
    <div class="content-container" >
      <div class="animation-container"></div>
      <span>
        {{ content }}
      </span>
    </div>
    <div class="comment-buttons"
    >
      <button>
        Approve
      </button>
      <button>
        Decline
      </button>
      <!-- <Teleport to="body">
          <UserApproveDeclineModal
            :message="popupMessage"
            :show="showPopup"
            @ok="handleOK"
          />
      </Teleport> -->
    </div>
  </div>
</template>

<style scoped>
.comment {
  background-color: white;
  width: 60vw;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
}

.comment-buttons {
  display: flex;
  gap: 15px;
}

#activate-or-deactivate {
  text-decoration: underline;
  width: 6vw;
  background-color: transparent;
  border: none;
  padding-left: 5px;
  padding-right: 5px;
}

#activate-or-deactivate:hover,
button {
  cursor: pointer;
}

button {
  padding-left: 10px;
  padding-right: 10px;
}

select {
  width: 5vw;
}

.content-container {
  width: 50vw;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.animation-container {
  background-color: initial;
  border-radius: 15px;
  width: 0.2vw;
  transition: background-color 0.3s;
}

.user:hover .animation-container {
  background-color: var(--selected-color);
}

.isSelected{
  background-color: var(--selected-color);
  
}
</style>