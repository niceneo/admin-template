<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="keywords" placeholder="Box名字搜索" style="width: 200px;" />
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
      <el-table-column label="Box名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.boxname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="dubbo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dubbo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jetty" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jetty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jmx" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jmx }}</span>
        </template>
      </el-table-column>
      <el-table-column label="health" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.health }}</span>
        </template>
      </el-table-column>
      <el-table-column label="desc" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="margin-left: 30px;">
        <el-form-item label="Box名" :label-width="formLabelWidth" prop="boxname">
          <el-input v-model="temp.boxname" />
        </el-form-item>
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
          <el-input v-model="temp.ip" />
        </el-form-item>
        <el-form-item label="dubbo" :label-width="formLabelWidth" prop="dubbo">
          <el-input v-model="temp.dubbo" />
        </el-form-item>
        <el-form-item label="jetty" :label-width="formLabelWidth" prop="jetty">
          <el-input v-model="temp.jetty" />
        </el-form-item>
        <el-form-item label="jmx" :label-width="formLabelWidth" prop="jmx">
          <el-input v-model="temp.jmx" />
        </el-form-item>
        <el-form-item label="health" :label-width="formLabelWidth" prop="health">
          <el-input v-model="temp.health" />
        </el-form-item>
        <el-form-item label="desc" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="temp.desc" />
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
import { listdata, updatedata, createdata, deletedata } from '@/api/InfoService/boxlist'
import { setTimeout } from 'timers'
import Pagination from '@/components/Pagination'

export default {
  name: 'BoxList',
  components: { Pagination },
  data() {
    return {
      keywords: '',
      downloadLoading: false,
      tablekey: 0,
      listLoading: true,
      list: null,
      listQuery: {
        page: 1,
        limit: 15,
        sort: 'id'
      },
      total: 0,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        create: 'Create',
        update: 'Edit'
      },
      temp: {
        id: undefined
      },
      formLabelWidth: '120px',
      rules: {
        boxname: [{ required: true, message: 'box名字必须填写', trigger: 'blur' }],
        ip: [{ required: true, message: 'ip地址必须填写', trigger: 'blur' }],
        dubbo: [{ required: true, message: 'dubbo端口必须填写', trigger: 'blur' }],
        jetty: [{ required: true, message: 'jetty端口必须填写', trigger: 'blur' }],
        jmx: [{ required: true, message: 'jmx端口必须填写', trigger: 'blur' }],
        health: [{ required: true, message: 'health端口必须填写', trigger: 'blur' }]
      }
    }
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
        console.log(this.list)
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
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createdata(this.temp).then((response) => {
            if (response.status == 0) {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
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
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(row) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatedata(tempData).then(response => {
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
              this.$notify({
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
      deletedata(id).then(response => {
        if (response.status == 0) {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: 'Failed',
            message: 'Delete Failed',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    handleDownload() {}
  }

}
</script>

<style lang="scss" scope>
</style>
