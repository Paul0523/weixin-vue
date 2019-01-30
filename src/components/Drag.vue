<template>
  <div>
    <my-tabs type="border-card" v-model="editableTabsValue" editable @edit="handleTabsEdit">
      <my-tab-pane label="用户管理">用户管理</my-tab-pane>
      <my-tab-pane label="配置管理">配置管理</my-tab-pane>
      <my-tab-pane label="角色管理">角色管理</my-tab-pane>
      <my-tab-pane label="定时任务补偿">定时任务补偿</my-tab-pane>
    </my-tabs>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import Sortable  from 'sortablejs'
  import MyTabs from './tabs/tabs'
  import MyTabPane from './tabs/tab-pane'

  export default {
    name: "drag",
    components: {
      draggable,
      Sortable,
      MyTabPane,
      MyTabs
    },
    data: function () {
      return {
        myArray: [{
          id: 1,
          name: "用户管理"
        }, {
          id: 1,
          name: "配置管理"
        }, {
          id: 1,
          name: "角色管理"
        }, {
          id: 1,
          name: "定时任务补偿",
          active: true
        }]
      }
    },
    methods: {
      getClass: function (item) {
        return "el-tabs__item is-top " + (item.active ? "is-active" : "")
      },
      clickTab: function (target) {
        if (target.active) {
            return;
        }

        this.myArray.forEach((item, index) => {
          item.active = false;
          this.$set(this.myArray, index, item);
        });

        console.log(this.myArray)
        target.active = true;
      }
    }
  }

</script>

<style>
  * {
    outline: none;
  }
</style>
