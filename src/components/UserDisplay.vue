<script setup>
import { ref } from 'vue';

const props = defineProps({
    name: String,
    userRole: Number,
    isActive: Boolean
});

const role = ref(props.userRole);

function changeStatus() {

}

function changeRole() {
    
}

</script>

<template>
    <div class="user">
        <span>
            {{ name }}
        </span>
        <div class="user-options">
            <button
                v-if="!isActive"
            >
                Approve
            </button>
            <button
                v-if="!isActive"
            >
                Decline
            </button>
            <select 
                v-model="role"
                @change="changeRole"
            >
                <option value="1">Standard</option>
                <option value="0">Admin</option>
            </select>
            <button 
                id="activate-or-deactivate"
                @click="changeStatus"
            >
                {{ isActive ? 'Deactivate' : 'Activate' }}
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

#activate-or-deactivate:hover, button {
    cursor: pointer;
}

button {
    padding-left: 10px;
    padding-right: 10px;
}
</style>