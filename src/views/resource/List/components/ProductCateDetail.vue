<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="编号：" prop="serial" :rules="[{
        required:true,
        message:'编号必填'
      }]">
        <el-input v-model="productCate.serial"></el-input>
      </el-form-item>

      <el-form-item label="标题：" prop="title" :rules="[{
        required:true,
        message:'标题必填'
      }]">
        <el-input v-model="productCate.title"></el-input>
      </el-form-item>


      <el-form-item label="头像：" prop="headImageUrl">
        <single-upload v-model="productCate.headImageUrl"></single-upload>
      </el-form-item>

      <el-form-item label="链接：" prop="link" :rules="[{
        required:true,
        message:'链接必填'
      }]">
        <el-input v-model="productCate.link"></el-input>
      </el-form-item>

      <el-form-item label="国家：" prop="region" :rules="[{
        required:true,
        message:'国家必填'
      }]">
        <el-select v-model="productCate.region" style="width: 100%">
          <el-option value="">请选择</el-option>
          <el-option v-for="(item,index) in selectProductCateList" :key="index" :value="item.name"
                     :label="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="平台：" prop="platform" :rules="[{
        required:true,
        message:'平台必填'
      }]">
        <el-input v-model="productCate.platform"></el-input>
      </el-form-item>
      <el-form-item label="产品平台：" prop="productPlatform" :rules="[{
        required:true,
        message:'产品平台必填'
      }]">
        <el-input v-model="productCate.productPlatform"></el-input>
      </el-form-item>
      <el-form-item label="会员数：" prop="members" :rules="[{
        required:true,
        message:'会员数必填'
      }]">
        <el-input-number v-model="productCate.members"></el-input-number>
      </el-form-item>
      <el-form-item label="日推数：" prop="dayPush" :rules="[{
        required:true,
        message:'日推数必填'
      }]">
        <el-input-number v-model="productCate.dayPush"></el-input-number>
      </el-form-item>


      <el-form-item label="关联帖子：" prop="fansNumber">
        <el-row v-for="(item,index) in productCate.whResourceItemsList" :key="index">
          <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 10px">
            <div style="display: flex;flex-direction: column;width: 100%">

              <div style="display: flex;align-items: center;margin-bottom: 10px;" >
                <span style="flex: 0 0 60px">上帖率:</span>
                <el-input-number v-model="item.rate" ></el-input-number>
              </div>
              <div style="display: flex;align-items: center;margin-bottom: 10px">
                <span style="flex: 0 0 60px">价格:</span>
                <el-input-number v-model="item.price"></el-input-number>
              </div>
              <div style="display: flex;align-items: center;margin-bottom: 10px">
                <span style="flex: 0 0 60px">描述:</span>
                <el-input type="textarea" v-model="item.description"></el-input >
              </div>

             <div style="display: flex;justify-content: end">
               <a href="#" style="flex: 0 0 auto;margin-left: 10px;color: dodgerblue"
                  @click="handlerFansDelete(index)">删除</a>
             </div>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="small" @click="handlerFansAdd">添加</el-button>
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
import {fetchList, createProductCate, updateProductCate} from '@/api/whResource'

import {fetchList as fetchCateList} from '@/api/whRegion'
import SingleUpload from '@/components/Upload/singleUpload.vue'

export default {
  name: 'ProductCateDetail',
  components: {SingleUpload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productCate: {
        id: '',
        name: '',
        categoryId: '',
        headImageUrl: '',
        whResourceItemsList: [],
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
  created() {
    // 获取国家列表
    fetchCateList({
      pageSize: 999999,
      pageNum: 1
    }).then((res) => {
      this.selectProductCateList = res.data.list || []
    })

    if (this.isEdit) {
      fetchList(this.$route.query.id).then(response => {
        console.log('>>>>>>>>response', response)
        this.productCate = response.data.list[0]
      })
    } else {
      this.productCate = {
        id: '',
        name: '',
        categoryId: '',
        headImageUrl: '',
        whResourceItemsList: [],
        status: 0
      }
    }

  },
  methods: {
    handlerVideoDelete(index) {
      this.productCate.userVideos.splice(index, 1)
    },
    handlerFansDelete(index) {
      this.productCate.whResourceItemsList.splice(index, 1)
    },
    handlerFansAdd() {
      this.productCate.whResourceItemsList.push(
          {
            'description': '',
            'rate': '',
            'price': ''
          }
      )

      this.$forceUpdate()
    },
    handlerVideoAdd() {
      this.productCate.userVideos.push(
          {
            'title': '',
            'url': '',
            'platform': ''
          }
      )

      this.$forceUpdate()
    },

    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {

              updateProductCate(this.$route.query.id, this.productCate).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })

              })
            } else {


              createProductCate(this.productCate).then(response => {
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
              // this.$router.push("/wh/resource")
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.productCate = {}
      this.getSelectProductCateList()
      this.filterProductAttrList = [{
        value: []
      }]
    },
    removeFilterAttr(productAttributeId) {
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
    handleAddFilterAttr() {
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
    filterLabelFilter(index) {
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
