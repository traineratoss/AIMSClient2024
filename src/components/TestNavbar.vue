<!-- 
    FlorinCP
    Shall be either deleted of modified 
    It was created in order to assure better fiting for the components development

 -->
<script setup>

</script>

<template>
    <nav>
        <ul>
            <li>
                <router-link to="/comment">
                    Comment TEST</router-link>
            </li>
            <li>
                <router-link to="/all">
                    All Ideas TEST</router-link>
            </li>
            <li>
                <router-link to="/my">
                    My Ideas TEST</router-link>
            </li>
        </ul>
    </nav>


    <div>
        <router-view />
    </div>
</template>

  
<style scoped>
nav{
    width:auto;
    top: 0;
    border: 1px solid black;
    background-color: #ffffff;
    height: 7vh;
    padding-left: 3rem;
    padding-right: 3rem;
    
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}

li {
    float: left;
}

li a {
    display: block;
    color: rgb(0, 0, 0);
    text-align: center;

    text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li a:hover {
    background-color: #ffa941
;
}
</style>