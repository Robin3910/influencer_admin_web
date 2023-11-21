<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="categoryId" :rules="[{
        required:true,
        message:'分类必填'
      }]">
        <el-select v-model="productCate.categoryId" multiple style="width: 100%">
          <el-option v-for="(item,index) in selectProductCateList" :key="index" :value="item.id"
                     :label="item.title"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称：" prop="name" :rules="[{
        required:true,
        message:'名称必填'
      }]">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>

      <el-form-item label="头像：" prop="headImageUrl">
        <single-upload v-model="productCate.headImageUrl"></single-upload>
      </el-form-item>
      <el-form-item label="粉丝数：" prop="fansNumber">
        <el-row v-for="(item,index) in productCate.fansList" :key="index">
          <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 10px">

            <span style="flex: 0 0 auto">链接:</span>
            <el-input v-model="item.url"></el-input>
            <span style="flex: 0 0 auto">平台:</span>
            <el-input v-model="item.platform"></el-input>
            <span style="flex: 0 0 auto">数量:</span>
            <el-input v-model="item.count"></el-input>
            <a href="#" style="flex: 0 0 auto;margin-left: 10px;color: dodgerblue"
               @click="handlerFansDelete(index)">删除</a>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="small" @click="handlerFansAdd">添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="非会员价：" prop="price">
        <el-input v-model.number="productCate.price"></el-input>
      </el-form-item>
      <el-form-item label="会员价格：" prop="realPrice">
        <el-input v-model.number="productCate.realPrice"></el-input>
      </el-form-item>
      <el-form-item label="视频链接：" prop="realPrice">
        <el-row v-for="(item,index) in productCate.userVideos" :key="index">
          <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 10px">
            <span style="flex: 0 0 auto">标题:</span>
            <el-input v-model="item.title"></el-input>
            <span style="flex: 0 0 auto">链接:</span>
            <el-input v-model="item.url"></el-input>
            <span style="flex: 0 0 auto">备注:</span>
            <el-input v-model="item.platform"></el-input>
            <a href="#" style="flex: 0 0 auto;margin-left: 10px;color: dodgerblue"
               @click="handlerVideoDelete(index)">删除</a>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="small" @click="handlerVideoAdd">添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productCate.status">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="-1">否</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchList, createProductCate, updateProductCate, getProductCate } from '@/api/whList'

import { fetchList as fetchCateList } from '@/api/whProductCate'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import interval from "echarts/src/scale/Interval";
import {number} from "echarts/lib/export";

export default {
  name: 'ProductCateDetail',
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      productCate: {
        id: '',
        name: '',
        categoryId: '',
        headImageUrl: '',
        userVideos: [],
        status: 0
      },
      selectProductCateList: [],
      rules: {
        title: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 140,
            message: '长度在 2 到 140 个字符',
            trigger: 'blur'
          }
        ]
      },
      filterAttrs: [],
      filterProductAttrList: [{
        value: []
      }]
    }
  },
  created () {
    // 获取分类列表
    fetchCateList({
      pageSize: 999999,
      pageNum: 1
    }).then((res) => {
      console.log('>>>>>>>>>>>请求的结果', res)
      this.selectProductCateList = res.data.list || []
    })
    if (this.isEdit) {
      getProductCate(this.$route.query.id).then(response => {
        console.log('>>>>>>>>response1', response)
        this.productCate = response.data.list[0]

        if(this.productCate.categoryId&&Array.isArray(this.productCate.categoryId.split(","))){
          this.productCate.categoryId=this.productCate.categoryId.split(",").map(i=>new Number(i).valueOf())
        }
      })
    } else {
      this.productCate = {
        id: '',
        name: '',
        categoryId: [],
        headImageUrl: '',
        userVideos: [],
        fansList:[],
        status: 0
      }
    }

  },
  methods: {
    handlerVideoDelete (index) {
      this.productCate.userVideos.splice(index, 1)
    },
    handlerFansDelete (index) {
      this.productCate.fansList.splice(index, 1)
    },
    handlerFansAdd () {
      this.productCate.fansList.push(
        {
          'url': '',
          'platform': '',
          'count':''
        }
      )

      this.$forceUpdate()
    },
    handlerVideoAdd () {
      this.productCate.userVideos.push(
          {
            'title': '',
            'url': '',
            'platform': ''
          }
      )

      this.$forceUpdate()
    },

    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {

              updateProductCate(this.$route.query.id, {
                ...this.productCate,
                categoryId:this.productCate.categoryId.join(",")
              }).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })

              })
            } else {


              createProductCate(
                {
                  ...this.productCate,
                  categoryId:this.productCate.categoryId.join(",")
                }
              ).then(response => {
                // this.$refs[formName].resetFields()
                // this.resetForm(formName)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
              })
            }
            setTimeout(() => {
              // this.$router.push("/wh/list")
            }, 1000)
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.productCate = {}
      this.getSelectProductCateList()
      this.filterProductAttrList = [{
        value: []
      }]
    },
    removeFilterAttr (productAttributeId) {
      if (this.filterProductAttrList.length === 1) {
        this.$message({
          message: '至少要留一个',
          type: 'warning',
          duration: 1000
        })
        return
      }
      var index = this.filterProductAttrList.indexOf(productAttributeId)
      if (index !== -1) {
        this.filterProductAttrList.splice(index, 1)
      }
    },
    handleAddFilterAttr () {
      if (this.filterProductAttrList.length === 3) {
        this.$message({
          message: '最多添加三个',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.filterProductAttrList.push({
        value: null,
        key: Date.now()
      })
    }
  },
  filters: {
    filterLabelFilter (index) {
      if (index === 0) {
        return '筛选属性：'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>

</style>
