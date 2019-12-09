<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userQuery.name.value" placeholder="账号、姓名、身份证" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="userQuery.type" placeholder="用户类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="userQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="userQuery.status" true-label="1" false-label="" class="filter-item" style="margin-left:15px;" @change="handleFilter">
        不显示停用账户
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="user_id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号"  width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.certificate_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="100px" align="center" >
        <template slot-scope="{row}">
          <el-tag type="danger" v-if="row.type==1" >管理员</el-tag>
          <el-tag type="sucess" v-if="row.type==2" >医生</el-tag>
          <span v-if="row.type==3" >患者</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="150px" align="center">
        <template slot-scope="{row}">
          <a :href= "'tel:'+row.mobile">{{ row.mobile }}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag type="danger" v-if="row.status==0" >已停用</el-tag>
          <el-tag type="sucess" v-if="row.status==1" >正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" mini-width="320px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=1" size="mini" type="success" @click="handleModifyStatus(row, 1)">
            启用
          </el-button>
          <el-button v-if="row.status!=0" size="mini" type="danger" @click="handleModifyStatus(row, 0)">
            停用
          </el-button>
          <el-button  size="mini" @click="handleReset(row)">
            重置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @dragDialog="handleDrag" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:50px;">
        <el-form-item label="类型" prop="type">
          <el-select ref="select" v-model="temp.type" class="filter-item" placeholder="请选择用户类型">
            <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="身份证号" prop="certificate_no">
          <el-input v-model="temp.certificate_no" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchUserList, createUser, updateUser } from '@/api/users'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui



const userTypeOptions = [
  { key: '2', display_name: '医生' },
  { key: '1', display_name: '管理员' },
  { key: '3', display_name: '患者' }
]

// arr to obj
const userTypeKeyValue = userTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, elDragDialog },
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
      tableKey: 0,
      list: null,
      total: 0,
      count: 0,
      listLoading: true,
      userQuery: {
        page: 1,
        limit: 20,
        type: undefined,
        name: {
          key: '',
          opt: 'like', 
          value: ''
        },
        status: undefined,
        sort: '-id'
      },
      userTypeOptions,
      sortOptions: [{ label: '正序排列', key: '+id' }, { label: '倒序排列', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        account: '',
        password: '',
        name: '',
        certificate_no: '',
        mobile: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建用户'
      },
      dialogPvVisible: false,
      //表单校验
      rules: {
        type: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        account: [{
            required: true, 
            message: '请填写账号信息', 
            trigger: 'blur' 
        }, {
            pattern: /^(\w){4,20}$/,
            message: '账号长度为4到20个字符，只允许字母、数字、下划线'
        }],
        name: [{ required: true, message: '姓名不允许为空', trigger: 'blur' }],
        certificate_no: [{ 
          required: true, 
          message: '请填写身份证号', 
          trigger: 'blur' 
          }, {
              pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 
              message: '你的身份证格式不正确' 
          }],
        mobile:[{ 
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
          }, {
              validator:function(rule,value,callback){
                if(/^1[34578]\d{9}$/.test(value) == false){
                  callback(new Error("请输入正确的手机号"));
                }else{
                  callback();
                }
              }, 
              trigger: 'blur'}
    ]
    //   pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
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
      fetchUserList(this.userQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.userQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleReset(row) {
      this.$confirm('此操作将重置该用户密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row.user_id)
          //console.log(this.row.user_id)
          // this.$message({
          //   type: 'success',
          //   message: '重置密码成功!'
          // });
        })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'user_id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.userQuery.sort = '+id'
      } else {
        this.userQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        account: '',
        password: '123456',
        name: '',
        certificate_no: '',
        mobile: '',
        user_type: '',
        status: 1
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
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建用户成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(this.temp)
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      //this.temp.timestamp = new Date(this.temp.timestamp)
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
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData)
          updateUser(tempData).then(() => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.userQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    }
  }
}
</script>


