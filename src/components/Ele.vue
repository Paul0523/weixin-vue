<template>
  <el-row class="tac" style="height: 100%;">
    <el-col :span="5" style=" background: #13CE66; height: 100%; overflow-y: scroll;">
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="select">
        <el-menu-item v-bind:index="index.toString()" v-for="(item, index) in items" v-bind:key="item"><i class="el-icon-menu"/>{{item.remarkName? item.remarkName:item.nickName}}</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="19" style="height: 100%; position: relative;">
      <div style="height: 30px; background: #F7BA2A; margin: 0 19px; padding: 10px 0; border-bottom: 1px solid #d6d6d6;">{{title}}</div>
      <div style="position: absolute; bottom: 50px; top: 50px; background: #324057; width: 100%;">

      </div>
      <div style="bottom: 0px; height: 200px; background: #99A9BF; position: absolute; width: 100%;">
        <div style="width: 100%; height: 150px;">
          <textarea style="width: 99%; height: 95%;">

          </textarea>
        </div>
        <div style="position: absolute; height: 50px; bottom: 0px; background: #13CE66; width: 100%; line-height: 50px; text-align: right;">
          <el-button type="info" style="margin-right: 30px;">信息按钮</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>


<script>
  import Test from "../test"
  import axios from "axios"
  export default {
    name : "ele",
    data : function () {
      return {
        items : [],
        title : ""
      }
    },
    mounted : function () {
//        this.items = Test.a
      axios.get('/back/getContact')
        .then(response => {
            console.log(response)
            this.items = response.data})
    },
    methods: {
      select(index) {
        this.title = this.items[index].nickName
      }
    }
  }
</script>
