<script setup>
import CarouselImage from "../components/CarouselImage.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import { createIdea } from "../services/idea.service";
import { watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import router from "../router";
import { getCategory, getUser } from "../services/idea.service";


const inputValue = ref("");
const statusValue = ref("");
const textValue = ref("");
const categoryOptions = ref([]);
const categoriesSelected = ref({});
const titleError = ref(false);
const statusError = ref(false);
const textError = ref(false);
const categoryError = ref(false);
const slideImages = [
    {url: 'https://imageio.forbes.com/specials-images/imageserve/5f85be4ed0acaafe77436710/0x0.jpg?format=jpg&width=1200'},
    {url: 'https://th-thumbnailer.cdn-si-edu.com/XJFrDNlNhvtv1uH-U6FKdBJ_U2U=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/04/8e/048ed839-a581-48af-a0ae-fac6fec00948/gettyimages-168346757_web.jpg'},
    {url: 'https://www.freecodecamp.org/news/content/images/2022/12/main-image.png'},
    {url: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/34246/images/i9SaP0vNQZWCZNsLaVhr_Hobby.jpg'}
];

watch(categoriesSelected, (newValue) => {
  console.log("Selected categories changed. New value:", newValue);
});

const handleSelectedCategories = (selectedCategories) => {
  categoriesSelected.value = selectedCategories;
};


// watch(textValue, (newValue) => {
//   console.log(textValue.value);
// });

// watch(statusValue, (newValue) => {
//   console.log("Status value changed. New value:", newValue);
// });

onMounted(async() => {
  categoriesSelected.value = [];
  titleError.value = false;
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;
  console.log(categoryOptions.value);
})

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
      'AdminPopescu1'
    );
    return data;
  }
}

const disableFields = useRoute().query.disableFields === 'true';
const fieldsDisabled = ref(disableFields);
    
const showDeletePopup = useRoute().query.showDeletePopup === 'true';
const deletePopup = ref(showDeletePopup);

const closePopup = () => {
  router.replace({ query: {} });
};

const deleteIdea = () => {
  // Perform the delete logic here
  alert('Idea deleted!'); 
  closePopup();
};



</script>

<template>
    <div class="create-idea-container">
        <div class="idea" >
            <label for="title-idea" class="label">Title:</label>
            <CustomInput 
            v-model="inputValue" 
            :disabled="fieldsDisabled" 
            :placeholder="titleError ? 'Select a title' : ''"
            :error="titleError" />   
        </div>
        <div class="idea">
         <label for="status-idea" class="label">Status:</label>
            <select v-model="statusValue" :class="{status:statusError}" name="status-idea" id="status-idea" class="input-width" :disabled="fieldsDisabled">
                <option value="open">Open</option>
                <option value="draft">Draft</option>
                <option value="implemented">Implemented</option>
            </select> 

        </div>
        <div class="idea" >
            <label for="category-idea" class="label" >Category:</label>
            <CustomDropDown 
              @update:selectedCategories="handleSelectedCategories"
             :disabled="fieldsDisabled"
             :variants="categoryOptions"
             :error="categoryError"
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
             <CarouselImage :images="slideImages" :disabled="fieldsDisabled"/>
        </div>
        <div class="add-image" >
            <input type="file" id="upload" hidden :disabled="fieldsDisabled"/>
            <label for="upload" class="add-image-idea" >Choose Image</label>
           

        </div>
        <div>
            <CustomButton id="create-idea" @click="createIdeaFunction" :disabled="fieldsDisabled"> Create Idea</CustomButton>
        </div>

        <div v-if="deletePopup" class="popup idea">
            <dialog open class="popup-content">
                <span class="close-popup" @click="closePopup">&times;</span>
                <p>Delete Idea?</p>
                <button @click="deleteIdea">Confirm</button>
            </dialog>
        </div>

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
        /* border-radius: 0.3rem; */
        cursor: pointer;
        margin-top: 1rem;
    }
    
    .idea{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        width:25vh;
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

.popup {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
  text-align: center;
}

.close-popup {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-popup:hover {
  color: #000;
}

</style>