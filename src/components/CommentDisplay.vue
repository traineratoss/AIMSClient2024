<script setup>
import { ref, defineProps, defineEmits } from "vue";
import CommentOffensiveNotOffensiveModal from "./CommentOffensiveNotOffensiveModal.vue";
import { deleteComment, reportComment,
  deleteReports, updateReportedComment} from "../services/comment.service";

const props = defineProps({
  content: String,
  nrReports: Number,
  commentId: Number,
  userId: Number,
});

const showModal = ref(false);
const modalMessage = ref("");
const actionType = ref("");

const emit = defineEmits(["comment-updated"]);

function showModalDialog(action) {
  actionType.value = action;
  modalMessage.value =
    action === "offensive"
      ? "Are you sure you want to mark this comment as offensive?"
      : "Are you sure you want to mark this comment as not offensive?";
  showModal.value = true;
}

async function handleConfirm(action) {
  showModal.value = false;
  try {
    if (action === "offensive") {
      await updateReportedComment(props.commentId);
      setReviewStatus(props.commentId, "OFFENSIVE");
    } else {
      await deleteReports(props.commentId);
      setReviewStatus(props.commentId, "NOT_OFFENSIVE");
    }
  } catch (error) {
    console.error("Error!", error);
  }
}

function handleCancel() {
  showModal.value = false;
}
</script>

<template>
  <div class="comment">
    <div class="comment-container">
      <div class="animation-container"></div>
      <span class="content">{{ content }}</span>
      <span class="report-count">Reports: {{ nrReports }}</span>
    </div>
    <div class="comment-buttons">
      <button @click="showModalDialog('not-offensive')">Not Offensive</button>
      <button @click="showModalDialog('offensive')">Offensive</button>
    </div>
    <Teleport to="body">
      <CommentOffensiveNotOffensiveModal
        :show="showModal"
        :message="modalMessage"
        :actionType="actionType"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.report-count {
  margin-left: 100px;
  color: rgb(136, 118, 118);
  width: 70px;
}
.content {
  width: 700px;
  word-wrap: break-word;
}
.comment {
  background-color: white;
  width: 60vw;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  align-items: center;
}

.comment-buttons {
  display: flex;
  gap: 15px;
  height: 40px;
  width: 60vw;
  padding-left: 65px;
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

.comment-container {
  width: 50vw;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
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

.isSelected {
  background-color: var(--selected-color);
}
</style>
