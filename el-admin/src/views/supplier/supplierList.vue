<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 500px;" placeholder="请输入供应商名/联系人/联系电话"  @keyup.enter.native="handleFilter" v-model="listQuery.p">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"  @keyup.enter="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="供应商名ID" prop="id" sortable v-if="false" >
      </el-table-column>

      <el-table-column align="center" label="供应商名" prop="supplierName">
      </el-table-column>
      
      <el-table-column align="center" label="联系人" prop="contact">
      </el-table-column>

      <el-table-column align="center" label="联系电话码" prop="tel">
      </el-table-column>

      <el-table-column align="center" label="邮箱" prop="email">
      </el-table-column>

      <el-table-column align="center" label="传真" prop="fax">
      </el-table-column>
      
      <el-table-column align="center" label="地址" prop="address">
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="right" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="供应商id" prop="id" v-show="false">
          <el-input v-model="dataForm.id"></el-input>
        </el-form-item>
        <el-form-item label="供应商名" prop="supplierName">
          <el-input v-model="dataForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="dataForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话码" prop="tel">
          <el-input v-model="dataForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="dataForm.fax"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="dataForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createSupplier, updateSupplier, deleteSupplier } from '@/api/supplier'

export default {
  name: 'List',
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        p: undefined,
        sort: 'update_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        supplierName: '',
        tel: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        supplierName: [{ required: true, message: '供应商名不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话码不能为空', trigger: 'blur' }],
        contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
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
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        supplierName: '',
        tel: '',
        contact: '',
        fax: '',
        email: '',
        address: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSupplier(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 3000
            })
            this.handleFilter()
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateSupplier(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 3000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除供应商: [' + row.supplierName + '] ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
        })
      }).catch(() => {
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['供应商名', '联系人', '联系电话码', '传真', '邮箱', '地址']
        const filterVal = ['supplierName', 'contact', 'tel', 'fax', 'email', 'address']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '供应商')
        this.downloadLoading = false
      })
    }
  }
}
</script>
