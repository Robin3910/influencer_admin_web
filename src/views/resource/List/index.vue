<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>

      <el-row style="margin-top: 10px">
        <el-col :span="12" style="display: flex;align-items: center">
          <span style="flex: 0 0 auto;margin-right: 10px">名称:</span>
          <el-input clearable v-model="listQuery.title" style="margin-right: 10px" size="small"></el-input>
          <el-button size="small" type="primary" @click="handlerSearch">查询</el-button>
          <el-button
              class="btn-add"
              @click="handleAddProductCate()"
              type="primary"
              size="small"
          >
            添加
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>

        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.headImageUrl"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="链接" align="center">
          <template slot-scope="scope">
            <a :href=" scope.row.link" target="_blank" style="text-decoration: underline;color: skyblue">链接</a>
          </template>
        </el-table-column>

        <el-table-column label="国家" align="center">
          <template slot-scope="scope">{{ scope.row.region }}</template>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <template slot-scope="scope">{{ scope.row.platform }}</template>
        </el-table-column>
        <el-table-column label="product_platform" align="center">
          <template slot-scope="scope">{{ scope.row.productPlatform }}</template>
        </el-table-column>
        <el-table-column label="members" align="center">
          <template slot-scope="scope">{{ scope.row.members }}</template>
        </el-table-column>
        <el-table-column label="day_push" align="center">
          <template slot-scope="scope">{{ scope.row.dayPush }}</template>
        </el-table-column>


        <el-table-column v-if="false" label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
                @change="handleShowStatusChange(scope.$index, scope.row)"
                :active-value="0"
                :inactive-value="-1"
                v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :current-page.sync="listQuery.pageNum"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {fetchList, deleteProductCate, updateShowStatus, updateNavStatus} from '@/api/whResource'

export default {
  name: 'productCateList',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        name: "",
        pageNum: 1,
        pageSize: 5
      },
      parentId: 0
    }
  },
  created() {

    this.getList()
  },
  watch: {
    $route(route) {

      this.getList()
    }
  },
  methods: {
    handlerSearch() {
      this.listQuery.pageNum = 1
      this.list = []
      this.getList()

    },
    handleAddProductCate() {
      this.$router.push('/resource/addList')
    },
    getList() {

      this.listLoading = true
      fetchList({...this.listQuery}).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleNavStatusChange(index, row) {
      const data = new URLSearchParams()
      const ids = []
      ids.push(row.id)
      data.append('ids', ids)
      data.append('navStatus', row.navStatus)
      updateNavStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleShowStatusChange(index, row) {

      updateShowStatus(row.id, {
        status: row.status
      }).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleShowNextLevel(index, row) {
      this.$router.push({path: '/pms/productCate', query: {parentId: row.id}})
    },
    handleTransferProduct(index, row) {
      console.log('handleAddProductCate')
    },
    handleUpdate(index, row) {
      this.$router.push({path: '/resource/updateList', query: {id: row.id}})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductCate(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>

</style>
