<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="keywords" placeholder="版本搜索" style="width: 200px;" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <br>
    <el-table
      :key="tablekey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="标题" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.ps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.types }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全量/增量" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ IsFull[scope.row.is_full] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.op_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.operated_at | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联版本" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.related }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="success" size="mini" icon="el-icon-check" @click="handleDeploy(row)">
            Deploy
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="Add" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="ps">
          <el-input v-model="temp.ps" />
        </el-form-item>
        <el-form-item label="项目" :label-width="formLabelWidth" prop="types">
          <!-- <el-input v-model="temp.types" /> -->
          <el-select ref="select" v-model="provalue" placeholder="请选择">
            <el-option v-for="item in prooptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="is_full">
          <el-select ref="select" v-model="typevalue" placeholder="请选择">
            <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件" :label-width="formLabelWidth" prop="uploadfile">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传zip格式得压缩文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="关联" :label-width="formLabelWidth" prop="is_full">
          <el-select ref="select" v-model="value" placeholder="请选择关联版本">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false ">
          Cancel
        </el-button>
        <el-button type="primary" @click="createData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { htmllist, GetProjectTypes } from '@/api/Deploy/htmllist'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'HtmlList',
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      Add: 'Add',
      dialogFormVisible: false,
      rules: {},
      temp: {
        id: undefined
      },
      provalue: '',
      typevalue: '',
      value: '',
      options: [],
      prooptions: [
        { value: '选项1', label: '黄金糕' }
      ],
      typeoptions: [
        { value: '选项1', label: '黄金糕' }
      ],
      formLabelWidth: '80px',
      keywords: '',
      tablekey: 0,
      list: null,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        sort: '+id'
      },
      total: 0,
      IsFull: {
        0: '全量',
        1: '增量'
      }
    }
  },
  created() {
    this.getList()
    this.getaddprojectdata()
  },
  methods: {
    getList() {
      this.listLoading = true
      htmllist(this.listQuery).then(response => {
        if (response.status == 0) {
          this.list = response.data
          this.total = response.data.length
          console.log(response.data)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    getaddprojectdata() {
      GetProjectTypes().then(response => {
        if (response.status == 0) {
          console.log(response.data)
        }
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {},
    handleDownload() {
    },
    handleUpdate(row) {
    },
    handleDeploy(row) {
      const hid = row.hid
      this.$router.push({ path: `/release/htmlorders/${hid}` })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
