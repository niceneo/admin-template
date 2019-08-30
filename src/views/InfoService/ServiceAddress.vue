<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="keywords" v-focus placeholder="搜索服务名" style="width: 200px;" class="filter-item" /> -->
      <el-input v-model="keywords" v-focus placeholder="搜索服务名" style="width: 200px;" class="filter-item" @keyup.enter.native="search(keywords)" />
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search(keywords)">
        Search
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="search(keywords)"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="服务名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发环境" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.dev" target="_blank" class="buttonText">{{ scope.row.dev }}</a>
        </template>
      </el-table-column>
      <el-table-column label="测试环境" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.test" target="_blank" class="buttonText">{{ scope.row.test }}</a>
        </template>
      </el-table-column>
      <el-table-column label="性能环境" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.uat" target="_blank" class="buttonText">{{ scope.row.uat }}</a>
        </template>
      </el-table-column>
      <el-table-column label="预发布环境" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.sit" target="_blank" class="buttonText">{{ scope.row.sit }}</a>
        </template>
      </el-table-column>
      <el-table-column label="生产环境" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.prd" target="_blank" class="buttonText">{{ scope.row.prd }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="margin-left:30px;">
        <el-form-item label="服务名" :label-width="formLabelWidth" prop="servicename">
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

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      keywords: '',
      searchresult: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      formLabelWidth: '120px',
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        servicename: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        servicename: [{ required: true, message: 'servicename is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    search(keywords) {
      if (keywords == '') {
        return this.list
      } else {
        return this.list.filter(item => {
          if (item.servicename.includes(keywords)) {
            return item
          }
        })
      }
    },
    // handleFilter() {
    //   // this.listQuery.page = 1
    //   // this.getList()
    //   this.searchresult = []
    //   this.temp = this.list
    //   this.list.forEach(items => {
    //     if (items.servicename.includes(this.searchname)) {
    //       this.searchresult.push(items)
    //     }
    //   })
    //   this.list = this.searchresult
    // },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      console.log(data)
      const { prop, order } = data
      console.log(prop)
      console.log(order)
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
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
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['服务名', '开发环境', '测试环境', '性能环境', '预发布环境', '生产环境']
        const filterVal = ['servicename', 'dev', 'test', 'uat', 'sit', 'prd']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'serviceaddress'
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
