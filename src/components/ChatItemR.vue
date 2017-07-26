<template>
  <div :class="message.type == 0 ? 'chatitem-r-wrap chatitem-wrap': 'chatitem-l-wrap chatitem-wrap'">
    <div class="content" style="">{{message.content}}</div>
  </div>
</template>

<style>

  .chatitem-wrap{
    padding: 0 10px;
    margin: 10px 0;
  }

  .chatitem-r-wrap{
    text-align: right;
  }

  .chatitem-l-wrap{
    text-align: left;
  }

  .chatitem-r-wrap .content{
    border-radius: 5px;
    background: #13CE66;
    margin-right: 0px;
    display: inline-block;
    text-align: center;
    padding: 5px 10px;
  }

  .chatitem-l-wrap .content{
    border-radius: 5px;
    background: #8492A6;
    margin-right: 0px;
    display: inline-block;
    text-align: center;
    padding: 5px 10px;
  }
</style>

<script>
  export default {
      name: "chatItemR",
      props: [
        'message'
      ]
  }
</script>
