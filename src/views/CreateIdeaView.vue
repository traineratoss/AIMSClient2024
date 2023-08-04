<script setup>
import CarouselImage from "../components/CarouselImage.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import CustomDialog from "../components/CustomDialog.vue"
import { watch, ref, onMounted, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import {
  getCategory,
  getUser,
  getIdea,
  updateIdea,
  deleteIdea,
  getAllImages,
  createIdea
} from "../services/idea.service";
import { getCurrentUsername } from "../services/user_service";

const inputValue = ref("");
const statusValue = ref("");
const textValue = ref("");
const categoryOptions = ref([]);
const categoriesSelected = ref([]);
const titleError = ref(false);
const statusError = ref(false);
const textError = ref(false);
const categoryError = ref(false);

const currentUsername= getCurrentUsername();
const slideImages = ref([]);

const currentImageIndex = ref(null);

const updatedIdea = ref(null);
updatedIdea.value = useRoute().query;
const isWatchEffectExecuted = ref(false);

const onlyForDeleteCategories = ref([]);

const handleSelectedCategories = (selectedCategories) => {
  categoriesSelected.value = selectedCategories;
};

onMounted(async () => {
  if (updatedIdea.value == null) {
    categoriesSelected.value = [];
  }
  titleError.value = false;
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;

  slideImages.value = [];
  const dataImage = await getAllImages();
  const imageUrls = dataImage.map((item) => {
    return `data:image/${item.fileType};base64,${item.base64Image}`;
  });
  slideImages.value = imageUrls;

  console.log(currentUsername)
});

//If the component is handling the update, we update the fields only once, we dont wanna update them multiple times
// that s why we have a var
watchEffect(() => {
  if (!isWatchEffectExecuted.value && updatedIdea.value !== null) {
    updateIdeaFields();
    isWatchEffectExecuted.value = true;
  }
});

//This function is very important since it checks if the component is gonna update or create an idea
const isUpdatedIdeaEmpty = computed(() => {
  return JSON.stringify(updatedIdea.value) === "{}";
});

//This is the function that is handling the updating in the db
async function updateIdeaFunction() {
  const updatedIdeaId = updatedIdea.value.updateId;
  const newTitle = inputValue.value;
  const newStatus = statusValue.value;
  const newText = textValue.value;
  const newCategoryList = categoriesSelected.value.map((category) => {
    return { text: category };
  });
  console.log(newCategoryList);
  await updateIdea(
    updatedIdeaId,
    newTitle,
    newText,
    newStatus,
    newCategoryList.value,
    null
  );
  router.push({ name: 'my'})
}

//Checking what we want to do (update or create) since we use the same component
async function shouldCreateOrUpdate() {
  if (JSON.stringify(updatedIdea.value) === "{}") {
    createIdeaFunction();
  } else {
    updateIdeaFunction();
  }
}

//This is used for updating all the fields in the view when clicking update
async function updateIdeaFields() {
  if (updatedIdea.value != null) {
    inputValue.value = updatedIdea.value.updateTitle;
    textValue.value = updatedIdea.value.updateText;
    statusValue.value = updatedIdea.value.updateStatus.toLowerCase();
    const categoryArray = JSON.parse(updatedIdea.value.updateCategoryList);
    categoryArray.forEach((category, index) => {
      categoriesSelected.value.push(category.text);
    });
    console.log(categoriesSelected.value)
  }
}

// we stringify the categories selected and send it to the dropdown and then parse it there
const stringifyCategory = () => {
  return JSON.stringify(categoriesSelected.value);
};

const getCurrentIndex = (currentIndex) => {
  currentImageIndex.value = currentIndex;
};

async function createIdeaFunction() {
  const rawCategoriesValue = categoriesSelected.value;

  //CHECKING IF ALL THE FIELDS ARE CORRECTLY INTRODUCED
  const categoryErrorCheck =
    !Array.isArray(rawCategoriesValue) || rawCategoriesValue.length === 0;
  const titleErrorCheck = inputValue.value === null || inputValue.value === "";
  const statusErrorCheck =
    statusValue.value === null || statusValue.value === "";
  const textErrorCheck = textValue.value === null || textValue.value === "";


  // WE MIGHT USE THESE IF WE WANNA SHOW A KIND OF ERROR WHEN NOT INTRODUCING IN THE FIELD

  //const setError = (errorFlag, errorMessage) => {
  //   if (errorFlag) {
  //     return true;
  //   }
  //   return false;
  // };

  // categoryError.value = setError(
  //   categoryErrorFlag,
  //   "Please select at least one category"
  // );
  // titleError.value = setError(titleErrorFlag, "Please select a title");
  // statusError.value = setError(statusErrorFlag, "Please select a status");
  // textError.value = setError(textErrorFlag, "Please select a text");

  if (
    !titleErrorCheck &&
    !textErrorCheck &&
    !statusErrorCheck &&
    !categoryErrorCheck
  ) {
    const categoryTexts = rawCategoriesValue.map((category) => ({
      text: category,
    }));
    const data = await createIdea(
      inputValue.value,
      textValue.value,
      statusValue.value.toUpperCase(),
      categoryTexts,
      currentUsername
    );
    router.push({ name: 'my'})
    console.log(data);
    return data;
  }
}
const disableFields = useRoute().query.disableFields === "true";
const fieldsDisabled = ref(disableFields);

const showDeletePopup = useRoute().query.showDeletePopup === "true";
const deletePopup = ref(showDeletePopup);
const ideaId = useRoute().query.id;

if (showDeletePopup) loadIdeaForDelete();
if (disableFields) loadIdeaForDelete();

async function loadIdeaForDelete() {
  const response = await getIdea(ideaId);
  console.log(response);
  inputValue.value = response.title;
  statusValue.value = response.status.toLowerCase();

  for (let category of response.categoryList) {
    onlyForDeleteCategories.value.push(" " + category.text);
  }

  textValue.value = response.text;
}

const customDialog = ref(null);

async function handleCancel() {
  customDialog.value.close();
  await router.push({ path: "/all" });
}

async function handleConfirm() {
  await deleteIdea(ideaId);
  customDialog.value.close();
  await router.push({ path: "/all" });
}

const uploadedImage = ref(null);
async function uploadImage (event){

  uploadedImage.value = event.target.files[0];
  const blob = await ImageRenderFromBlob();
  const formData = new FormData();
  formData.append("file",uploadedImage.value);
    fetch('http://localhost:8080/aims/api/v1/images/addImage', {
        method: 'POST',
        body: formData,
      });
  slideImages.value.push(URL.createObjectURL(uploadedImage.value));
}


// async function blobFromImage() {
//   return new Blob([await new Response
//   (uploadedImage.value).arrayBuffer()], 
//   { type: 'application/json'});
// }

// async function ImageRenderFromBlob() {
//   var blob = await blobFromImage();
//   const array = new Uint8Array(await blob.arrayBuffer());
//   return array;
// }
function onMouseLeave() {}

function onMouseEnter() {}
</script>

<template>
  <div class="create-idea-container">
    <div class="idea">
      <label for="title-idea" class="label">Title:</label>
      <CustomInput
        v-model="inputValue"
        :disabled="fieldsDisabled"
        placeholder="Write your title here..."
        class="input-width"
      />
    </div>
    <div class="idea">
      <label
        for="status-idea"
        class="label"
        @mouseleave="onMouseLeave"
        @mouseenter="onMouseEnter"
        >Status:</label
      >
      <select
        v-model="statusValue"
        :class="{ status: statusError }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        name="status-idea"
        id="status-idea"
        class="input-width"
        :disabled="fieldsDisabled"
      >
        <option value="open">Open</option>
        <option value="draft">Draft</option>
        <option v-if="!isUpdatedIdeaEmpty" value="implemented">Implemented</option>
      </select>
    </div>
    <div class="idea">
      <label for="category-idea" class="label">Category:</label>
      <CustomDropDown
        v-if="!showDeletePopup && !disableFields"
        @update:selectedCategories="handleSelectedCategories"
        :disabled="fieldsDisabled"
        :variants="categoryOptions"
        :canAddInDropdown="true"
        :selectedObjects="stringifyCategory()"
        :input-placeholder="`Select your categories`"
        class="input-width"
      >
      </CustomDropDown>
      <input
        v-if="showDeletePopup || disableFields"
        v-model="onlyForDeleteCategories"
        class="input-width"
        :disabled="disableFields"
      />
    </div>

        <div class="idea-text">
            <label for="category-idea" class="label-text" >Idea text:</label>
            <textarea 
            v-model="textValue" 
            :disabled="fieldsDisabled" 
            placeholder="Write your text here..." 
            :class="{textarea:textError}"></textarea>
        </div>
        <div class="idea">
          <CarouselImage :images="slideImages" @current-index="getCurrentIndex" />
        </div>
        <div class="add-image" >
            <input type="file" id="upload" hidden :disabled="fieldsDisabled" ref="uploadedImage" v-on:change="uploadImage($event)"/>
            <label   for="upload" class="add-image-idea" v-if="!deletePopup">Upload Image</label>
        </div>
        <div>
            <CustomButton 
              id="create-idea" 
              @click="shouldCreateOrUpdate" 
              :disabled="fieldsDisabled" 
              v-if="!deletePopup"
            >
            {{ isUpdatedIdeaEmpty ? 'Create Idea' : 'Update Idea' }}

            </CustomButton>
        </div>
        <!-- <div>
            <CustomButton id="create-idea"  @click="clickImageButton"  :disabled="fieldsDisabled" v-if="!deletePopup"> Create Image</CustomButton>
        </div> -->
    <CustomDialog
      ref="customDialog"
      :open="deletePopup"
      title="Are you sure you want to delete?"
      message="This item will be deleted immediatly. You can't undo this action!"
    >
      <div class="dialog-actions">
        <button @click="handleCancel">Cancel</button>
        <button @click="handleConfirm">Confirm</button>
      </div>
    </CustomDialog>
  </div>
</template>

<style scoped>
.create-idea-container {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 80vh;
  margin-top: 10px;
}

.add-image-idea {
  background-color: gray;
  color: white;
  padding: 0.5rem;
  font-family: sans-serif;
  cursor: pointer;
  margin-top: 1rem;
}
.input-width {
  width: 200px;
}

.idea {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 30vh;
}
.label {
  padding-right: 20px;
}
.idea-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.label-text {
  padding-top: 20px;
  padding-bottom: 20px;
}
textarea {
  width: 30vh;
  height: 10vh;
  resize: none;
}
input {
  width: 10vw;
}
select {
  width: 10vw;
}
.add-image {
  padding-bottom: 10px;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-actions button {
  margin: 0 5px;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button:nth-child(1) {
  background-color: #f44336;
  color: white;
}

.dialog-actions button:nth-child(2) {
  background-color: #ffa941;
  color: black;
}
</style>
