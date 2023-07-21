<script setup>
import CarouselImage from "../components/CarouselImage.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CarouselSlide from "../components/CarouselSlide.vue";
import CustomInput from "../components/CustomInput.vue";
import { watch, ref } from "vue";

const inputValue = ref("");


</script>

<template>

    <div class="create-idea-container">
        <div class="idea">
            <label for="title-idea" class="label">Title:</label>
            <CustomInput v-model="inputValue" />   
        </div>
        <div class="idea">
             
        </div>
        <div class="idea">
            <label for="category-idea" class="label">Category:</label>
            <input type="text" name="category-idea" list="category" id="category-idea">
                <datalist id="category">
                    <option>Fun</option>
                    <option>IT</option>
                    <option>Food</option>
            </datalist>
        </div>

        <div class="idea-text">
            <label for="category-idea" class="label-text">Idea text:</label>
            <textarea v-model="text"></textarea>
        </div>
        <div class="idea">
             <CarouselImage>
                    
            </CarouselImage> 
        </div>
        <div class="add-image">
            <CustomButtonGray id="add-photo" label="Import Image"></CustomButtonGray>
        </div>
        <div>
            <CustomButton id="create-idea"> Create Idea</CustomButton>
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