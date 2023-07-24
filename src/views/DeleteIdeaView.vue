<template>
  <div class="delete-idea-view">
    <div class="title-container">
      <h1 class="title">Delete Your Idea</h1>
    </div>
    <div class="info-container">
      <div class="info-item">
        <p>Title:</p>
        <div class="info-value">{{ ideaTitle }}</div>
        <input type="text" v-model="rowCount" name="rows" class="rows-textbox">
      </div>
      <div class="info-item">
        <p>Status:</p>
        <div class="info-value">
          <select v-model="status">
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>
      <div class="info-item">
        <p>Category:</p>
        <div class="info-value">
          <select v-model="category">
            <option value="category1">Test 1</option>
            <option value="category2">Test 2</option>
            <option value="category3">Test 3</option>
            <option value="category4">Add new category</option>
          </select>
        </div>
      </div>
    </div>
    <div class="idea-text-container">
      <textarea v-model="ideaText" rows="10" cols="50" placeholder="Enter your idea here"></textarea>
    </div>
    <button @click="deleteIdea">Delete</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const ideaTitle = ref("");
const status = ref("open");
const category = ref("category1");
const ideaText = ref("");

function deleteIdea() {
  
  router.push("/all"); 
}
</script>

<style scoped>
.delete-idea-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #c8c8ca;
  padding: 30px;
  font-family: "Segoe UI", "Lato", Arial, sans-serif;
  color: #333333;
  position: relative;
}

.title-container {
  background-color: unset;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}

.title {
  font-size: 24px;
  margin: 0;
  color: black;
}

.info-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
  align-items: center;
  position: relative;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-item p {
  margin-right: 10px;
  font-size: 14px;
}

.info-value select {
  border: 1px solid #b3b3b3;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
}

.idea-text-container textarea {
  width: 100%;
  height: 200px;
  border: 1px solid #b3b3b3;
  border-radius: 5px;
  padding: 10px;
  resize: none;
  margin-bottom: 20px;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background-color: #ffa941;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  font-size: 16px;
}

button:hover {
  background-color: #ff8e00;
}

.select-option {
  background-color: #b3b3b3;
  color: #333333;
}

.select-option:hover {
  background-color: #ffa941;
  color: #ffffff;
}
</style>
