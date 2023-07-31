<script setup>
import { ref, defineProps, defineEmits } from "vue";
import {
  sendActivateEmail,
  sendApproveEmail,
  sendDeactivateEmail,
  sendDeclineEmail,
  updateUser,
  updateUserRole,
} from "../services/user_service";

const props = defineProps({
  name: String,
  userRole: String,
  isActive: Boolean,
  hasPassword: Boolean,
});

const role = ref(props.userRole);
const emit = defineEmits(["activation-successful", "deactivation-successful"]);

async function changeStatus() {
  if (!props.isActive) {
    try {
      await sendActivateEmail(props.name);
      emit("change-status-successful", props.name);
    } catch (error) {
      console.log("Error!", error);
    }
  } else {
    try {
      await sendDeactivateEmail(props.name);
      emit("change-status-successful", props.name);
    } catch (error) {
      console.log("Error!", error);
    }
  }
}

function approveUser() {
  sendApproveEmail(props.name)
    .then((res) => {
      emit("approve-user", props.name);
      role.value = 'STANDARD';
    })
    .catch((error) => {
      console.log("Error!", error);
    });
}

function declineUser() {
  sendDeclineEmail(props.name)
    .then((res) => {
      emit("decline-user", props.name);
    })
    .catch((error) => {
      console.log("Error!", error);
    });
}

function changeRole() {
  updateUserRole(props.name)
    .then((res) => {
      emit("update-role", props.name);
    })
    .catch((error) => {
      console.log("Error!", error);
    });
}
</script>

<template>
  <div class="user">
    <span>
      {{ name }}
    </span>
    <div class="user-options">
      <button v-if="!hasPassword && !isActive" @click="approveUser">
        Approve
      </button>
      <button v-if="!hasPassword && !isActive" @click="declineUser">
        Decline
      </button>
      <select v-model="role" @change="changeRole">
        <option selected>{{ userRole == "" ? "STANDARD" : userRole }}</option>
        <option value="STANDARD" v-if="userRole != 'STANDARD'">STANDARD</option>
        <option value="ADMIN" v-if="userRole != 'ADMIN'">ADMIN</option>
      </select>
      <button
        id="activate-or-deactivate"
        @click="changeStatus"
        v-if="hasPassword"
      >
        {{ isActive ? "Deactivate" : "Activate" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.user {
  background-color: white;
  width: 60vw;
  display: flex;
  justify-content: space-between;
  padding: 5px;
}

.user-options {
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
</style>