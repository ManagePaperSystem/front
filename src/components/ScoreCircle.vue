<template>
  <div id="score">
    <Progress :radius="150" :strokeWidth="20"  v-bind:value=Value>
      <template v-slot:footer/>
    </Progress>
  </div>
</template>

<script>
import Progress from 'easy-circular-progress/src/index'


export default {
  name: 'ScoreCircle',
  components: {
    Progress,
  },
  props: {
    Value:Number
  }
}


</script>

<style>
#score {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
}


</style>