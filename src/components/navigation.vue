<template>
  <div id="nav" class="box">
    <span
      ><router-link to="/"><button>Home</button></router-link>
      <router-link to="/tradereader"><button>Trade Reader</button></router-link
      ><router-link to="/trimgenerator"
        ><button>Trim Generator</button></router-link
      ></span
    >
  </div>
</template>
<style scoped>
#nav {
  width: var(--sidebar-width);
  height: 100vh;
  margin: 0;
  overflow-y: auto;
  position: fixed;
  left: 0px;
  top: 0px;
  border-radius: 0px;
}
@media only screen and (max-width: 750px) {
  #nav {
    position: relative;
    margin: 0 auto;
    height: auto;
    max-width: 800px;
    min-width: 300px;
    width: auto;
    margin-bottom: 0.5em;
    border-radius: 10px;
  }
}
</style>