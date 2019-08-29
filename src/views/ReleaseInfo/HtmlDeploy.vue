<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="success">
        <svg-icon icon-class="icon-run" />
        运行
      </el-button>
      <el-button class="filter-item run" type="primary">
        <svg-icon icon-class="ShutDown" />
        关闭
      </el-button>
      <el-button class="filter-item" type="danger">
        <svg-icon icon-class="editor-undo" />
        回滚
      </el-button>
    </div>

    <el-container class="body-container">
      <el-container class="detail-contanier">
        <el-main>
          <span>版本详情</span>
          <div class="ibox-content">
            <table class="detail-table">
              <tbody>
                <tr>
                  <td width="20%;">发版主题:</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>项目全称:</td>
                  <td>HTML全量发版</td>
                </tr>
                <tr>
                  <td>项目目录:</td>
                  <td>zuche</td>
                </tr>
                <tr>
                  <td>关联版本:</td>
                  <td>无关联</td>
                </tr>
                <tr>
                  <td>来源目录:</td>
                  <td>10.91.138.111:/qhapp/apps/html/prd/</td>
                </tr>
                <tr>
                  <td>目的机器:</td>
                  <td>(10.91.138.36,10.91.138.99):/qhapp/apps/html/</td>
                </tr>
                <tr>
                  <td>提单人:</td>
                  <td>梁雾成</td>
                </tr>
                <tr>
                  <td>申请时间:</td>
                  <td>2019-08-12 19:24:24</td>
                </tr>
                <tr>
                  <td>操作人:</td>
                  <td>梁雾成</td>
                </tr>
                <tr>
                  <td>操作时间:</td>
                  <td>2019-08-12 19:30:30</td>
                </tr>
                <tr>
                  <td>回滚文件:</td>
                  <td>无</td>
                </tr>
                <tr>
                  <td>状态:</td>
                  <td>提交中</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-main>
      </el-container>
      <el-container class="log-container">
        <el-main>
          <span>发版日志</span>
          <div>
            sadasdasdsadefefsedfdsfdsfsdfsdf23423<br>
            4dfgdfgdfgfdgfdkjgfdkgjkdfjgkldfklgjl<br>
            dfjglfdjkgjfdlkgjldfkjglkdfjglkjflgjd<br>
            lfjglkdfjlgkjdflkgjlfkdjglkfdjglkjfdl<br>
            kgjdflkgjlkdfjglkdfjglkfjdklgjldkfj<br>
            glkfdjgldfjlkgjdflkgjlkdfjglkfdjggroove<br>
            lkfdjglkdfjlgkjdflkgjdflkgjlkdfjgfldgjl<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
            dfkgjlkdfjglkdfjglkdfjglkdfjglkfdjlkgjfdklgjdflkgjklg
          </div>
        </el-main>
      </el-container>
    </el-container>
    <br><br><br>
    <div class="check-container">
      <el-steps :space="200" :active="1" finish-status="success">
        <el-step title="已完成" />
        <el-step title="进行中" />
        <el-step title="步骤 3" />
      </el-steps>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      hid: this.$route.params && this.$route.params.id,
      data: '',
      listLoading: true,
      listdata: ''
    }
  },
  created() {
    this.gethid()
  },
  methods: {
    gethid() {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.body-container {
  margin-top: 10px;
  margin-left: 10px;
  .detail-contanier {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    width: 200px;
    .detail-table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      tr {
        border-bottom: 1px groove;
        font-size: 15px;
        td {
          padding-bottom: 10px;
          padding-top: 10px;
        }
      }
    }
    span {
      text-align: center;
      display: block;
      font-size: 20px;
    }
  }
  .log-container {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    span {
      text-align: center;
      display: block;
      font-size: 20px;
    }
    div {
      word-break: break-all;
      border-style: 1px groove;
      border-radius: 4px;
      overflow: auto;
      height: 500px;
    }
  }
  .check-container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
}
</style>
