<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="keywords" placeholder="IP搜索" style="width: 200px;" />
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
      <el-table-column label="IP地址" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.hostname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="磁盘" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.disk }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统版本" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.systemversion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据中心" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.datacenter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Box" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.boxname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="status" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="handleRefresh(row)">
            Refresh
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
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
          <el-input v-model="temp.ip" />
        </el-form-item>
        <el-form-item label="数据中心" :label-width="formLabelWidth" prop="datacenter">
          <el-radio-group v-model="temp.datacenter">
            <el-radio label="DMZ" />
            <el-radio label="APP" />
            <el-radio label="Mange" />
            <el-radio label="Local" />
          </el-radio-group>
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
import { listdata, updatedata, createdata, deletedata } from '@/api/InfoService/hostsinfo'
import { setTimeout } from 'timers'
import Pagination from '@/components/Pagination'

export default {
  name: 'BoxList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        failed: 'danger'
      }
      return statusMap[status]
    }
  },
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
        ip: [{ required: true, message: 'ip地址必须填写', trigger: 'blur' }],
        datacenter: [{ required: true, message: '机器所属数据中心必须选择', trigger: 'blur' }]
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
    handleRefresh(row) {
      const tempData = Object.assign({}, row)
      updatedata(tempData).then(response => {
        if (response.status == 0) {
          console.log(response.data)
          for (const v of this.list) {
            if (v.id === tempData.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, response.data)
              break
            }
          }
          this.$notify({
            title: 'Success',
            message: 'Refresh Successfully',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: 'Failed',
            message: 'Refresh Failed',
            type: 'warnning',
            duration: 2000
          })
        }
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['IP地址', '主机名', 'CPU', '内存', '磁盘', '系统版本', '数据中心', 'Box', 'Status']
        const filterVal = ['ip', 'hostname', 'cpu', 'memory', 'disk', 'systemversion', 'datacenter', 'boxname', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'boxlist'
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

<style lang="scss" scope>
</style>
