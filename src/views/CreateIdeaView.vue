<script setup>
import CarouselImage from "../components/CarouselImage.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import { createIdea } from "../services/idea.service";
import { watch, ref } from "vue";

const inputValue = ref("");
const statusValue = ref("");
const textValue = ref("");
const categoriesValue = ref({});
const slideImages = [
    {url: 'https://imageio.forbes.com/specials-images/imageserve/5f85be4ed0acaafe77436710/0x0.jpg?format=jpg&width=1200'},
    {url: 'https://th-thumbnailer.cdn-si-edu.com/XJFrDNlNhvtv1uH-U6FKdBJ_U2U=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/04/8e/048ed839-a581-48af-a0ae-fac6fec00948/gettyimages-168346757_web.jpg'},
    {url: 'https://www.freecodecamp.org/news/content/images/2022/12/main-image.png'},
    {url: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/34246/images/i9SaP0vNQZWCZNsLaVhr_Hobby.jpg'}
];

watch(categoriesValue, (newValue) => {
  console.log("Selected categories changed. New value:", newValue);
});

const handleSelectedCategories = (selectedCategories) => {
  categoriesValue.value = selectedCategories;
};

watch(textValue, (newValue) => {
  console.log(textValue.value);
});

// watch(statusValue, (newValue) => {
//   console.log("Status value changed. New value:", newValue);
// });

const categoryList = ref([
        {
            "text": "Fun"
        }
    ])

async function createIdeaFunction() {
    console.log(categoryList.value);
    console.log(categoriesValue.value);
    const data = await createIdea(inputValue.value, statusValue.value.toUpperCase(), textValue.value, categoryList.value,'AdminPopescu1');
}
</script>

<template>
    <div class="create-idea-container">
        <div class="idea">
            <label for="title-idea" class="label">Title:</label>
            <CustomInput v-model="inputValue" />   
        </div>
        <div class="idea">
         <label for="status-idea" class="label">Status:</label>
            <select v-model="statusValue" name="status-idea" id="status-idea" class="label">
                <option value="open">OPEN</option>
                <option value="draft">DRAFT</option>
                <option value="implemented">IMPLEMENTED</option>
            </select> 
        </div>
        <div class="idea">
            <label for="category-idea" class="label">Category:</label>
            <CustomDropDown @update:selectedCategories="handleSelectedCategories"></CustomDropDown>
        </div>

        <div class="idea-text">
            <label for="category-idea" class="label-text">Idea text:</label>
            <textarea v-model="textValue"></textarea>
        </div>
        <div class="idea">
             <CarouselImage :images="slideImages" />
                    
            
        </div>
        <div class="add-image">
            <input type="file" id="upload" hidden/>
            <label for="upload" class="add-image-idea">Choose file</label>
           
        </div>
        <div>
            <CustomButton id="create-idea" @click="createIdeaFunction"> Create Idea</CustomButton>
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

</style>