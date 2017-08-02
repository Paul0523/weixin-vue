<template>
  <el-row class="tac" style="height: 600px; width: 800px; margin: 50px auto;">
    <el-col :span="6" style=" background: #2E3238; height: 100%; position:relative; color: white;">
      <div style="height: 70px; line-height: 70px; text-align: left; padding-left: 20px;"><img :src="'/back/getContactIcon?userName=' + myAcount.userName" style="width: 40px; height: 40px; border-radius: 4px; vertical-align: middle;"/> <p style="margin: 0 0 0 10px; display: inline-block;">{{myAcount.nickName}}</p></div>
      <div style="height: 40px; line-height: 40px;"><input type="text" style="border-radius: 4px; outline: none; padding: 0 10px; border: solid 1px #3a3a3a; font-size: 12px; color: #fff; height: 30px; line-height: 30px; background-color: #26292E;" placeholder="搜索" v-model="filterContacts"/></div>
      <div class="wrapper" style="position: absolute; top: 120px; bottom: 0px; width: 100%;">
        <el-menu id="contacts" style="width: 100%; height: 100%; background: #2E3238;" :default-active="defaultActiveIndex" class="el-menu-vertical-demo scrollbar-macosx">
          <el-menu-item v-bind:index="index.toString()" v-for="(item, index) in items" v-bind:key="index" @click="clickItem(item.userName)">
            <el-badge v-bind:value="item.msgCount" class="item" style="overflow: hidden;" :max="99">
              <img :src="'/back/getContactIcon?userName=' + item.userName" style="height: 30px; width: 30px; border-radius: 3px; vertical-align: middle;"/><p style="display: inline-block; margin: 0 0 0 10px;">{{item.remarkName? item.remarkName:item.nickName}}</p>
            </el-badge>
          </el-menu-item>
        </el-menu>
      </div>
    </el-col>
    <el-col :span="18" style="height: 100%; position: relative; background: #eeeeee;">
      <div style="height: 30px; background: #EEEEEE; margin: 0 19px; padding: 10px 0; border-bottom: 1px solid #d6d6d6;">{{title}}</div>
      <div class="wrapper" style="position: absolute; bottom: 200px; top: 50px; width: 100%;">
        <div id="chatWin" style="width: 100%; height: 100%;" class="scrollbar-macosx">
          <chat-item-r v-bind:message="item" v-for="(item, index) in chatMsgs" v-bind:key="index"></chat-item-r>
        </div>
      </div>
      <div style="bottom: 0px; height: 200px; background: #EEEEEE; position: absolute; width: 100%;">
        <div style="width: 100%; height: 150px; background: white;">
          <textarea style="box-sizing: border-box; width: 100%; height: 100%; outline: none; border: none; resize: none; padding: 10px;" v-model="txAreaMsg" @keyup.enter.ctrl="send">
          </textarea>
        </div>
        <div style="position: absolute; height: 50px; bottom: 0px; width: 100%; line-height: 50px; text-align: right;">
          <span style="display: inline-block; margin-right: 10px; color: #a4a4a4;">按下ctrl+enter发送</span><el-button type="info" style="margin-right: 30px;" @click="send">发送</el-button>
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
  .el-menu-item:last-child {
    margin-right: 0;
    border-bottom: #000 1px solid;
  }
  .el-menu li {
    list-style: none;
    border-top: #000 1px solid;
  }

  .el-badge {
    text-align: left;
    width: 100%;
  }

  .wrapper>div {
    height: 100%;
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
    watch: {
      chatMsgs() {
        this.$nextTick(() => {
          document.getElementById('chatWin').scrollTop = document.getElementById('chatWin').scrollHeight;
        })

      },
      filterContacts() {
        this.clearActiveContact()
        this.refreshContactsWithFiter()
      }
    },
    data : function () {
      return {
        myAcount : {},
        contactsMap : {}, //载入的联系人
        chatMsgs : [],  //聊天窗口信息
        items : [],  //联系人列表
        title : "",  //聊天窗口顶栏
        activeContactId : "",
        defaultActiveIndex : "-1",
        txAreaMsg : "",  //发送信息窗口
        filterContacts : ""  //过滤框
      }
    },
    mounted : function () {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      //初始化滚动条
      jQuery('.scrollbar-macosx').scrollbar();
      this.loadMyAcount()
      //加载联系人信息
      this.loadContacts()
      //获取消息
      this.loadMessage()
    },
    methods: {
      clearActiveContact() {
        this.defaultActiveIndex = (-Math.random()) + ""
        this.activeContactId = ""
        this.title = ""
        this.chatMsgs = []
        this.txAreaMsg = ""
      },
      //读取并且显示聊天记录
      readAndShowMsg(userName) {
        var target = this.contactsMap[userName]
        this.title = target.nickName
        while (target.msgs.length > 0) {
          var msg = target.msgs.pop();
          target.readedMsgs.push(msg)
        }
        this.chatMsgs = [];
        target.readedMsgs.forEach((value) => {
          this.chatMsgs.push(value)
        })
      },
      refreshContactsWithFiter() {
        var filterContacts = this.filterContacts;
        var items =  this.getContactsFromContactsMap().filter(function (item) {
          return item.remarkName.toLowerCase().indexOf(filterContacts.toLowerCase()) != -1 || item.nickName.toLowerCase().indexOf(filterContacts.toLowerCase()) != -1
        });
        this.refreshContacts(items)
      },
      clickItem(userName) {
          this.activeContactId = userName
          this.readAndShowMsg(userName)
          this.refreshContactsWithFiter()
      },
      //加载联系人
      loadContacts() {
        axios.get('/back/getContact').then(response => {
          var contacts = response.data
          //将联系人转换为key，value形式
          contacts.forEach((value, index) => {
            value.msgs = [] //未读消息
            value.readedMsgs = [] //已读消息
            console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            value.lastModifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
            this.contactsMap[value.userName] = value
          })
          this.refreshContacts(this.getContactsFromContactsMap())
        })
      },
      //弹出通知框
      notifyMsg(target, msg) {
        const h = this.$createElement;
        var that = this
        var content = ""
        if (msg.msgType == 3)
            content = "图片消息"
        else if (msg.msgType == 34)
            content = "语音消息"
        else
            content = msg.content
        this.$notify({
          title: target.remarkName == ""? target.nickName:target.remarkName,
          message: h('i', { style: 'color: teal'}, content),
          onClick : function () {
            that.readAndShowMsg(msg.fromUserName)
            that.filterContacts = ""
            that.refreshContactsWithFiter()
            that.items.forEach((value, index) => {
                if (value.userName == msg.fromUserName) {
                  that.defaultActiveIndex = index + ""
                  that.activeContactId = value.userName
                }
            })
            this.close()
          }
        });
      },
      //刷新联系人列表
      refreshContacts(items) {
        var timeSortedItems = []
        var msgSortedItems = []
        function timeSort(a, b) {
          if (a.lastModifyTime < b.lastModifyTime)
            return 1
          else if (a.lastModifyTime > b.lastModifyTime)
            return -1
          else
            return 0
        }
        items.forEach(function (item) {
          if (item.msgCount > 0) {
            msgSortedItems.push(item);
          }else {
            timeSortedItems.push(item)
          }
        })
        timeSortedItems.sort(timeSort)
        msgSortedItems.sort(timeSort)
        timeSortedItems.forEach(function (item) {
          msgSortedItems.push(item)
        })
        this.items = msgSortedItems
      },
      //将contactsMap转化为list
      getContactsFromContactsMap() {
        var contacts = []
        for (var key in this.contactsMap) {
          var item = this.contactsMap[key]
          //使用深拷贝避免数据耦合
          contacts.push({userName : item.userName, remarkName : item.remarkName, nickName : item.nickName, msgCount : item.msgs.length, lastModifyTime : item.lastModifyTime})
        }
        return contacts;
      },
      send() {
        if (this.activeContactId == '') {
          alert("请选择要发送的对象！")
          return
        }
        if (this.txAreaMsg == "") {
            alert("不能发送空内容！")
          return
        }
        var contact = this.contactsMap[this.activeContactId]
        axios.get('/back/sendMsg?name=' + contact.nickName + "&content=" + this.txAreaMsg)
          .then(response => {
              console.log(response.data)
              var msg = {
                  content : this.txAreaMsg,
                  type : 1
              }
              contact.readedMsgs.push(msg)
              this.chatMsgs.push(msg)
              contact.lastModifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
              this.txAreaMsg = ""
            })
      },
      loadMessage() {
        var that = this
        axios.get('/back/syncLoadMessage')
          .then(response => {
            console.log(response.data)
            response.data.forEach((value) => {
              if (!(value.msgType == 1 || value.msgType == 3 || value.msgType == 34))
                return

              if (value.msgType == 3) {
                  value.content = '<img src="/back/getMediaFile?msgId=' + value.msgId + '&type=0"/>'
              }

              if (value.msgType == 34) {
                value.content = '<audio src="/back/getMediaFile?msgId=' + value.msgId + '&type=1" controls="controls" >'
              }

              var target = this.contactsMap[value.fromUserName]
              if (target) {
                value.type = 0
                target.lastModifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
                if (this.activeContactId == value.fromUserName) {
                  target.readedMsgs.push(value)
                  this.readAndShowMsg(value.fromUserName)
                }else {
                  target.msgs.push(value)
                  this.notifyMsg(target, value)
                }
                this.refreshContactsWithFiter()
                console.log("消息处理完毕")
              }
            })
            setTimeout(this.loadMessage(), 0);
          })
      },
      loadMyAcount() {
        axios.get('/back/getMyAcount')
          .then(response => {
              this.myAcount = response.data
          })
      }
    }
  }
</script>
