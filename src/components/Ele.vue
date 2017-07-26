<template>
  <el-row class="tac" style="height: 100%; width: 1000px; margin: 0 auto;">
    <el-col :span="5" style=" background: #13CE66; height: 100%; position:relative;">
      <div style="height: 100px;">我的信息</div>
      <el-menu style="position: absolute; top: 100px; bottom: 0px; overflow-y: scroll; width: 100%;" default-active="-1" class="el-menu-vertical-demo" @select="select">
        <el-menu-item v-bind:index="index.toString()" v-for="(item, index) in items" v-bind:key="index">
          <el-badge v-bind:value="item.msgs.length" class="item" :max="99">
            <i class="el-icon-menu"/>{{item.remarkName? item.remarkName:item.nickName}}
          </el-badge>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="19" style="height: 100%; position: relative;">
      <div style="height: 30px; background: #F7BA2A; margin: 0 19px; padding: 10px 0; border-bottom: 1px solid #d6d6d6;">{{title}}</div>
      <div id="chatWin" style="position: absolute; bottom: 200px; top: 50px; background: #324057; width: 100%; overflow-y: scroll;">
        <chat-item-r v-bind:message="item" v-for="(item, index) in chatMsgs" v-bind:key="index"></chat-item-r>
      </div>
      <div style="bottom: 0px; height: 200px; background: #99A9BF; position: absolute; width: 100%;">
        <div style="width: 100%; height: 150px;">
          <textarea style="width: 99%; height: 95%;" v-model="txAreaMsg" @keyup.enter.ctrl="send">

          </textarea>
        </div>
        <div style="position: absolute; height: 50px; bottom: 0px; background: #13CE66; width: 100%; line-height: 50px; text-align: right;">
          <el-button type="info" style="margin-right: 30px;" @click="send">发送</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style>
  .el-badge__content.is-fixed{
    top: 28px !important;
    right: -4px !important;
  }
</style>

<script>
  import Test from "../test"
  import axios from "axios"
  import Vue from 'vue'
  import ChatItemR from "./ChatItemR"
  export default {
    name : "ele",
    components : {
        ChatItemR
    },
    data : function () {
      return {
        chatMsgs : [],
        items : [],
        title : "",
        activeIndex : -1,
        txAreaMsg : ""
      }
    },
    mounted : function () {
      var that = this
      axios.get('/back/getContact')
        .then(response => {
          console.log(response)
          this.items = response.data
          this.items.forEach((value, index) => {
              value.msgs = []
              value.index = index;
              value.readedMsgs = [];
          })
        })
      setInterval(function () {
        axios.get('/back/loadMessage')
          .then(response => {
            console.log(response.data)
            var contacts = that.items
            var contactMap = {}
            contacts.forEach((value) => {contactMap[value.userName] = value});
            response.data.forEach((value) => {
              if (!(value.msgType == 1 || value.msgType == 3 || value.msgType == 34))
                  return
              value.type = 0 //接收的消息
              var target = contactMap[value.fromUserName]
              if (target) {
                if (that.activeIndex == target.index) {
                  target.readedMsgs.push(value)
                  that.chatMsgs.push(value)
                  console.log("push 完成")
                }else {
                  target.msgs.push(value)
                }
                Vue.set(that.items, target.index, target)
                const h = that.$createElement;
                that.$notify({
                  title: target.remarkName == ""? target.nickName:target.remarkName,
                  message: h('i', { style: 'color: teal'}, value.content),
                  duration: 0,
                  onClick: function () {
                    alert("点击了框框")
                  }
                });
              }
            })

          })
      }, 10000)
    },
    methods: {
      select(index) {
        var contact = this.items[index]
        this.title = this.items[index].nickName
        this.activeIndex = index;
        while (contact.msgs.length > 0) {
            var msg = contact.msgs.pop();
            contact.readedMsgs.push(msg)
        }
        this.chatMsgs = [];
        contact.readedMsgs.forEach((value) => {
            this.chatMsgs.push(value)
        })
      },
      send() {
        if (this.activeIndex == -1) {
          alert("请选择要发送的对象！")
          return
        }
        if (this.txAreaMsg == "") {
            alert("不能发送空内容！")
          return
        }
        var contact = this.items[this.activeIndex]
        axios.get('/back/sendMsg?name=' + contact.nickName + "&content=" + this.txAreaMsg)
          .then(response => {
              console.log(response.data)
              var msg = {
                  content : this.txAreaMsg,
                  type : 1
              }
              contact.readedMsgs.push(msg)
              this.chatMsgs.push(msg)
              this.txAreaMsg = ""
            })
      }
    },
    watch: {
      chatMsgs() {
        this.$nextTick(() => {
          document.getElementById('chatWin').scrollTop = document.getElementById('chatWin').scrollHeight;
        })

      }
    }
  }
</script>
