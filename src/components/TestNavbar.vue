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
        </ul>
    </nav>


    <div>
        <router-view />
    </div>
</template>

  
<style scoped>
nav{
    width: 100vw;
    top: 0;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #666;
}

li {
    float: left;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li a:hover {
    background-color: #111;
}
</style>