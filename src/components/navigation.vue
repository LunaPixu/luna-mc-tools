<template>
  <div id="nav" class="box">
    <router-link to="/"><button class="nav-button"
      ><div class="nav-icon"><font-awesome-icon icon="house" /></div>Home</button
    ></router-link>
    <router-link to="/tradereader"><button class="nav-button"
      ><div class="nav-icon"><font-awesome-icon icon="comments-dollar"/></div>Trade Reader</button
    ></router-link
    ><router-link to="/trimgenerator"><button class="nav-button"
      ><div class="nav-icon"><font-awesome-icon icon="shield-halved"/></div>Trim Generator</button
    ></router-link>
  </div>
</template>

<style scoped>
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