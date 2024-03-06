<template>
    <button @click="playAnimation">
    Play
    </button>
</template>

<script setup>
    import Model from "../World/Model";

    let animationState = 0;     // 0 = Start, 1 = End, 2 = running

    function playAnimation() {
        if(animationState === 0) {
            Model.animation.actions.current.play();
        } else if(animationState === 1) {

        }
    }
// 
//  NOT FINISHED 
//     
</script>

<style>

</style>