<script setup>
import { ref} from 'vue';

let dragging = false, startX = 0, startY = 0;

const left = ref(window.innerWidth/2);
const top = ref(window.innerHeight/2);

const startDrag = (event) => {
    dragging = true;
    startX = event.clientX - left.value;
    startY = event.clientY - top.value;

    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);
}

const drag = (event) => {
    if (dragging) {
        left.value = event.clientX - startX;
        top.value = event.clientY - startY;
    }
}

const stopDrag = () => {
    dragging = false;
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
}

</script>

<template>
    <Teleport to="body">
        <section 
            class="drag-section" 
            :style="{ left: `${left}px`, top: `${top}px` }"
            @mousedown="startDrag"
        >
            <header class="header">
                <slot name="header"></slot>
            </header>
            <main class="main style1">
                <slot name="main"></slot>
            </main>
            <footer class="footer">
                <slot name="footer"></slot>
            </footer>
        </section>
    </Teleport>
</template>

<style scoped lang="scss">
.drag-section{
    position: fixed;
    transform: translate(-50%, -50%);
    padding: 20px 50px;
    box-shadow: 0 0 1px 2px #ddd;
    border-radius: 10px;
    z-index: 10;
    background-color: #fff;
    height: calc(100% - 80px);
    cursor: grab;
    .header{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
    }
    .main{
        height: calc(100% - 100px);
        overflow-y: auto;
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
    }
}
</style>