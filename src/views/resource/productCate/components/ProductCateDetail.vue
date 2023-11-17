<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="productCate.sort"></el-input-number>
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
import { fetchList, createProductCate, updateProductCate, getProductCate } from '@/api/whRegion'



const defaultProductCate = {
  title: '',
  status: -1,
  sort:""
}
export default {
  name: 'ProductCateDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      productCate: Object.assign({}, defaultProductCate),
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
    if (this.isEdit) {
      getProductCate(this.$route.query.id).then(response => {
        console.log('>>>>>>>>response1',response)
        this.productCate = response.data.list[0]
      })
    } else {
      this.productCate = Object.assign({}, defaultProductCate)
    }

  },
  methods: {
    getSelectProductCateList () {
      fetchList(0, {
        pageSize: 100,
        pageNum: 1
      }).then(response => {
        this.selectProductCateList = response.data.list
        this.selectProductCateList.unshift({
          id: 0,
          name: '无上级分类'
        })
      })
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

              updateProductCate(this.$route.query.id, this.productCate).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })

              })
            } else {
              // this.productCate.productAttributeIdList = this.getProductAttributeIdList()
              createProductCate(this.productCate).then(response => {
                this.$refs[formName].resetFields()
                this.resetForm(formName)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
              })
            }
           setTimeout(()=>{
             this.$router.back();
           },1000)
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
      this.productCate = Object.assign({}, defaultProductCate)
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
