<script setup lang="ts">
import { ref } from "vue";

const rootStyle = document.querySelector(":root") as HTMLElement;
//This is kinda shoddy and might break stuff
const baseSidebarWidth: string = rootStyle === null ? "152px" : getComputedStyle(rootStyle).getPropertyValue("--sidebar-width");

const navCollapsed = ref(false);
function collapseNav(): void {
  if (rootStyle === null) return;
  if (navCollapsed.value) {
    rootStyle.style.setProperty("--sidebar-width", baseSidebarWidth);
    setTimeout(() => {
      navCollapsed.value = false
    }, isMobileSize.value ? 0 : 300);
    return;
  }
  navCollapsed.value = true;
  setTimeout(() => {
    rootStyle.style.setProperty("--sidebar-width", "3.5em")
  }, isMobileSize.value ? 0 : 300);
}

const isMobileSize = ref(window.innerWidth <= 750);
function checkMobileSize(): void {
  isMobileSize.value = window.innerWidth <= 750;
}
let resizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(checkMobileSize, 200);
});
</script>

<template>
  <div id="nav" class="box">
    <button id="nav-collapse" @click=collapseNav()><font-awesome-icon icon="bars" /></button>
    <Transition><router-link to="/" v-if="!navCollapsed || !isMobileSize"><button class="nav-button">
          <div class="nav-icon"><font-awesome-icon icon="house" /></div>
          <Transition><span v-if="!navCollapsed">Home</span></Transition>
        </button></router-link></Transition>
    <Transition><router-link to="/tradereader" v-if="!navCollapsed || !isMobileSize"><button class="nav-button">
          <div class="nav-icon"><font-awesome-icon icon="comments-dollar" /></div>
          <Transition><span v-if="!navCollapsed">Trade Reader</span></Transition>
        </button></router-link></Transition>
    <Transition><router-link to="/trimgenerator" v-if="!navCollapsed || !isMobileSize"><button class="nav-button">
          <div class="nav-icon"><font-awesome-icon icon="shield-halved" /></div>
          <Transition><span v-if="!navCollapsed">Trim Generator</span></Transition>
        </button></router-link></Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.nav-button {
  width: 95%;
  margin: 0.5em auto;
  padding: 0.4em 0.3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#nav {
  overflow-y: auto;
  left: 0px;
  top: 0px;
  transition: width 0.5s;

  position: fixed;
  width: var(--sidebar-width);
  height: 100vh;
  margin: 0;
  border-radius: 0px;
}
#nav-collapse {
  background: none;
  margin: 0;

  width: 95%;
}

@media only screen and (max-width: 750px) {
  #nav {
    position: relative;
    width: auto;
    max-width: 800px;
    min-width: 300px;
    height: auto;
    margin: 0 auto;
    margin-bottom: 0.5em;
    border-radius: 10px;
  }
  #nav-collapse {
    width: auto;
  }
}
</style>
