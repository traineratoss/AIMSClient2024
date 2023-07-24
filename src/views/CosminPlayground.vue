<script setup>
import { ref,onMounted } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { loadPagedIdeas } from "../services/idea.service";

let ideas = ref([]);

async function loadIdeas() {
  console.log()
}


onMounted(async () => {
  ideas.value =  await loadPagedIdeas(4, 0, 'title', 'ASC')
  console.log(ideas.value)
});


</script>

<template>
  
  <!-- Implement store for getting user  -->
    <div class="idea-container" v-for="idea in ideas" :key="idea.title">
      <IdeaCard 
      :title="idea.title"
      :text ="idea.text"
      :status="idea.status"
      />
      <button @click="loadIdeas">LOAD ALL PAGED IDEAS</button>
    </div>
 
</template>

<style scoped>

.idea-container {
 display: flex;
 flex-direction: column;
 align-items: center;
}
</style>

<!-- 


const props = defineProps({
  title: "",
});

const showDeleteDialog = ref(false);
const router = useRouter();

function openDeleteIdeaView() {
  showDeleteDialog.value = true;
}

const comments = ref([
  {
    commentText: "textul primului comentariu ",
    userName: "Gigel",
    hasReplies: true,
    replies: [{ commentText: "reply text", userName: "dan armeanca" }],
  },
  {
    commentText: "some comment text",
    userName: "Gigel",
    hasReplies: false,
    replies: [{ commentText: "first reply", userName: "dan armeanca" }],
  },
  { commentText: "just comment text", userName: "Crsiti", hasReplies: true },
]);

let showComments = ref(false);
let someVariable = ref(false);

function toggle() {
  console.log("function was accesed");
  someVariable.value = !someVariable.value;
  console.log(someVariable);
}

onMounted(async () => {
  loadPagedIdeas(4, 0, 'title', 'ASC')
});
</script>

<template>
  <div class="container">
    <div class="idea-card">
      <h1>{{ props.title }}</h1>

      <button @click="showComments = !showComments" class="showComments">
        ...
      </button>
      <div class="something">
        <div class="number-of-comments">
          Nr. Comments: {{ numberOfComments }}
        </div>
        <div class="author-info">Author: {{ authorName }}</div>
        <div class="title">Title: {{ Title }}</div>
        <div class="text">Text: {{ Text }}</div>
        <div class="status">
          Status: {{ Status }}
          <select v-model="statusValue" @change="handleChangeStatus">
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>

      <div class="buttons-container">
        <button class="edit-button" @click="editIdea">Edit</button>
        <router-link :to="`/viewidea`" class="view-button"> View </router-link>
        <router-link :to="`/delete`" class="delete-button">
          Delete
        </router-link>
      </div>
      <img
        class="idea-image"
        src="https://play-lh.googleusercontent.com/5MTmOL5GakcBM16yjwxivvZD10sqnLVmw6va5UtYxtkf8bhQfiY5fMR--lv1fPR1i2c=w240-h480-rw"
        alt="image"
      />
      <div class="input-container">
        <input type="text" />
        <button>POST</button>
        <button @click="loadComments(4, 0, 'id', 0)">TEST</button>
        <button @click="postComment('dragos', 0, 'merge sau nu merge')">
          COMM
        </button>
        <button @click="postReply('dragos', 0, 'merge sau nu merge')">
          Reply
        </button>
        <button @click="loadPagedIdeas(4, 0, 'title', 'ASC')">ideas</button>
      </div>
    </div>
    <div
      class="comment-container"
      v-if="showComments"
      v-for="comment in comments"
      :key="comment.userName"
    >
      <CustomComment
        :text="comment.commentText"
        :userName="comment.userName"
        :hasReplies="comment.hasReplies"
        @showReplies="toggle()"
      />

      <div
        class="reply-container"
        v-if="someVariable"
        v-for="commentReply in comment.replies"
      >
        <CustomComment
          :text="commentReply.commentText"
          :userName="commentReply.userName"
        />
      </div>
    </div>
  </div>
</template>
 -->