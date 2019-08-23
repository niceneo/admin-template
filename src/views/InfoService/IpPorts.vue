<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="keywords" placeholder="暂时不可用" style="margin-bottom:30px; width: 200px;" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      :key="tablekey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="服务名" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发环境" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dev }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试环境" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.test }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性能环境" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预发布环境" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产环境" style="width: 100%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.prd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" style="width: 100%" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="服务名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="开发环境" :label-width="formLabelWidth">
          <el-input v-model="temp.dev" />
        </el-form-item>
        <el-form-item label="测试环境" :label-width="formLabelWidth">
          <el-input v-model="temp.test" />
        </el-form-item>
        <el-form-item label="性能环境" :label-width="formLabelWidth">
          <el-input v-model="temp.uat" />
        </el-form-item>
        <el-form-item label="预发布环境" :label-width="formLabelWidth">
          <el-input v-model="temp.sit" />
        </el-form-item>
        <el-form-item label="生产环境" :label-width="formLabelWidth">
          <el-input v-model="temp.prd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listdata, createdata, updatedata, deletedata } from '@/api/ipports'
import { setTimeout } from 'timers'
import Pagination from '@/components/Pagination'

export default {
  name: 'IpPorts',
  components: { Pagination },
  data() {
    return {
      list: null,
      tablekey: 0,
      keywords: '',
      listLoading: true,
      rules: {
        name: [{ required: true, message: '服务名字必须填写', trigger: 'blur' }]
      },
      temp: {
        id: undefined
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'id'
      },
      total: 0
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listdata(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createdata(this.temp).then((response) => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (response.status == 0) {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Failed',
                message: 'Create Failed',
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatue = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatedata(tempData).then((response) => {
            if (response.status == 0) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.dialogFormVisible = false
              this.$$notify({
                title: 'Failed',
                message: 'Update Failed',
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      const id = row.id
      deletedata(id).then((response) => {
        if (response.status == 0) {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        } else {
          this.$$notify({
            title: 'Success',
            message: 'Delete Failed',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['服务名', '开发环境', '测试环境', '性能环境', '预发布环境', '生产环境']
        const filterVal = ['name', 'dev', 'test', 'uat', 'sit', 'prd']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'ipports'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

