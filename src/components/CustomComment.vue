<script setup>
import { ref,onMounted } from "vue";
import { loadComments, postReply,loadReplies } from "../services/comment.service";
import { getCurrentUser } from "../services/user_service";

const props = defineProps({
  text: "",
  creationDate: "",
  userName: "",
  userId: "",
  ideaId: "",
  hasReplies: "",
  parentId:"",
  isReplay:"",
  elapsedTime:""
});

const emits = defineEmits(['showReplies','loadComments','loadReplies']);

let currentUser=ref('')
let commentReplies=ref([])

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

function showReplies(){
    console.log("Emit button was pressed from CustomComment")
    emits('showReplies')
} 

function loadParentComments(){
  console.log("loading order has been sent")
  emits('loadComments')
}

async function loadCommentReplies(){
  console.log('incercam sa trimitem reply')
  emits('loadReplies')
} 

</script>

<template>
  <div class="comment-container">
    <p>
      <i>{{ props.userName }}</i>
      <br>
      <i>{{ props.elapsedTime }}</i>
    </p>
    <div class="item">{{ props.text }}</div>
    <div class="input-container"  v-if="!props.isReplay">
      <input type="text" v-model="commentText"/>
        <button @click="postReply(currentUser.username, props.parentId, commentText)
                    ;loadParentComments()
        ">
          Post reply
        </button>
    </div>
 
    <div v-if="props.hasReplies">
        <button class="showReplies" @click="showReplies();loadCommentReplies()">...</button>
    </div>

  </div>
</template>

<style scoped>
.comment-container {
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  border: solid 1px black;
  margin: 5px;
  padding: 10px;
  max-width: 28vw;
}
.item {
  background-color: rgb(255, 255, 255);
  color: black;
}

.showReplies {
  position: relative;
  left:180px;
  top: 5px;
  font-size: xx-large;
  border: none;
  background-color: unset;
}

.reply-container {
  max-width: 25vw;
  position: relative;
  left: 40px;
  margin-bottom: 30px;
}
</style>
