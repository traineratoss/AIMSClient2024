<script setup>
import CarouselImage from "../components/CarouselImage.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import CustomDialog from "../components/CustomDialog.vue";
import { createIdea,addImage, getImage } from "../services/idea.service";
import { watch, ref, onMounted } from "vue";
import {  useRoute } from "vue-router";
import router from "../router";
import { getCategory, getUser } from "../services/idea.service";
import { getCurrentUsername } from "../services/user_service";



const inputValue = ref("");
const statusValue = ref("");
const textValue = ref("");
const categoryOptions = ref([]);
const categoriesSelected = ref({});
const titleError = ref(false);
const statusError = ref(false);
const textError = ref(false);
const categoryError = ref(false);

const currentUsername= getCurrentUsername();
const slideImages = ref({});



watch(categoriesSelected, (newValue) => {
  console.log("Selected categories changed. New value:", newValue);
});

const handleSelectedCategories = (selectedCategories) => {
  categoriesSelected.value = selectedCategories;
};


onMounted(async() => {
  categoriesSelected.value = [];
  titleError.value = false;
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;
  console.log(categoryOptions.value);

  slideImages.value = [];
  const dataImage = await getImage();
  const imageUrls = dataImage.map(item => {
    return `data:image/${item.fileType};base64,${item.base64Image}`;
  });
  slideImages.value = imageUrls;
  console.log(imageUrls);

});

async function createIdeaFunction() {
  const rawCategoriesValue = categoriesSelected.value;

  const setError = (errorFlag, errorMessage) => {
    if (errorFlag) {
      console.log(errorMessage);
      return true;
    }
    return false;
  };

  const categoryErrorFlag = !Array.isArray(rawCategoriesValue) || rawCategoriesValue.length === 0;
  const titleErrorFlag = inputValue.value === null || inputValue.value === "";
  const statusErrorFlag = statusValue.value === null || statusValue.value === "";
  const textErrorFlag = textValue.value === null || textValue.value === "";

  categoryError.value = setError(categoryErrorFlag, "Please select at least one category");
  titleError.value = setError(titleErrorFlag, "Please select a title");
  statusError.value = setError(statusErrorFlag, "Please select a status");
  textError.value = setError(textErrorFlag, "Please select a text");

  if (!titleErrorFlag && !textErrorFlag && !statusErrorFlag && !categoryErrorFlag) {
    const categoryTexts = rawCategoriesValue.map((category) => ({ text: category }));
    const data = await createIdea(
      inputValue.value,
      statusValue.value.toUpperCase(),
      textValue.value,
      categoryTexts,
      currentUsername
    );
    return data;
  }

}
const disableFields = useRoute().query.disableFields === 'true';
const fieldsDisabled = ref(disableFields);
    
const showDeletePopup = useRoute().query.showDeletePopup === 'true';
const deletePopup = ref(showDeletePopup);


const customDialog = ref(null);

async function handleCancel() {
  customDialog.value.close();
  await router.push({ path: '/all' });
};

async function handleConfirm() {
  customDialog.value.close();
  await router.push({ path: '/all' });
};

const fileUpload1 = ref(null);
function onImageUpload (event){
  const file = event.target.files[0];
  fileUpload1.value = new FormData();
  fileUpload1.value.append("file", file);
  slideImages.push(URL.createObjectURL(file));
}

function clickImageButton(){
  const file = fileUpload1.value;
  addImage(file);
  //"research" send byte []

}


</script>

<template>
    <div class="create-idea-container">
        <div class="idea" >
            <label for="title-idea" class="label">Title:</label>
            <CustomInput 
            v-model="inputValue" 
            :disabled="fieldsDisabled" 
            :placeholder="titleError ? 'Select a title' : ''"
            :error="titleError" 
            />   
        </div>
        <div class="idea">
         <label for="status-idea" class="label">Status:</label>
            <select v-model="statusValue" :class="{status:statusError}" name="status-idea" id="status-idea" class="input-width" :disabled="fieldsDisabled">
                <option value="open">Open</option>
                <option value="draft">Draft</option>
            </select> 

        </div>
        <div class="idea" >
            <label for="category-idea" class="label" >Category:</label>
            <CustomDropDown 
              @update:selectedCategories="handleSelectedCategories"
             :disabled="fieldsDisabled"
             :variants="categoryOptions"
             :error="categoryError"
             :canAddInDropdown="true"
             >
            </CustomDropDown>
        </div>

        <div class="idea-text">
            <label for="category-idea" class="label-text" >Idea text:</label>
            <textarea 
            v-model="textValue" 
            :disabled="fieldsDisabled" 
            :placeholder="textError ? 'Select a text' : ''" 
            :class="{textarea:textError}"></textarea>
        </div>
        <div class="idea">
             <CarouselImage :images="slideImages"/>
        </div>
        <div class="add-image" >
            <input type="file" id="upload" hidden :disabled="fieldsDisabled" ref="fileUpload" @change="onImageUpload"/>
            <label   for="upload" class="add-image-idea" v-if="!deletePopup">Upload Image</label>
        </div>
        <div>
            <CustomButton id="create-idea"  @click="createIdeaFunction"  :disabled="fieldsDisabled" v-if="!deletePopup"> Create Idea</CustomButton>
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

.create-idea-container{
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    height: 80vh;
    margin-top: 10px; 
    
}

.status {
  border-color: red;
  border-radius: 1px;
}

.textarea::placeholder {
  color: red;
}

.textarea {
  border-color: red;
  border-radius: 1px;
}
.add-image-idea{
    background-color: gray;
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    cursor: pointer;
    margin-top: 1rem;
}
.input-width{
  width: 200px;
}

.idea{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width:30vh;
}
.label{
    padding-right: 20px;
}
.idea-text{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.label-text{
    padding-top: 20px;
    padding-bottom: 20px;
}
textarea{
    width:30vh;
    height:10vh;
    resize: none;
}
input{
    width: 10vw;
}
select{
    width: 10vw;
}
.add-image{
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