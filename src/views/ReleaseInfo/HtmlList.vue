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
      <el-table-column label="关联版本" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.related }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.op_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.operated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
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

  </div>
</template>

<script>
import { htmllist } from '@/api/Deploy/htmllist'
import Pagination from '@/components/Pagination'

export default {
  name: 'HtmlList',
  components: { Pagination },
  data() {
    return {
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
  },
  methods: {
    getList() {
      this.listLoading = true
      htmllist(this.listQuery).then(response => {
        if (response.status == 0) {
          this.list = response.data.items
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleCreate() {
    },
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
