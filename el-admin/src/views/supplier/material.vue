<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 300px;" placeholder="请输入物料编码/物料名/条形码/规格"  @keyup.enter.native="handleFilter" v-model="listQuery.p">
      </el-input>
      <el-select clearable class="filter-item" style="width: 400px;" v-model="listQuery.materialTypes" placeholder="请选择物料类型" :filter-method="filterMaterialType" filterable multiple default-first-option >
        <el-option
          v-for="item in materialTypeOptions"
          :key="item.materialType"
          :label="item.materialTypeName"
          :value="item.materialType">
          <span style="float: left">{{ item.materialTypeName }}</span>
          <span style="color: #8492a6; font-size: 13px">({{ item.materialType }})</span>
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"  @keyup.enter="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="物料ID" prop="id" sortable v-if="false" >
      </el-table-column>
      <el-table-column align="center" label="物料编码" prop="materialCode">
      </el-table-column>
      <el-table-column align="center" label="物料名" prop="materialName">
      </el-table-column>
      <el-table-column align="center" label="计量单位" prop="unitCn">
      </el-table-column>
      <el-table-column align="center" label="辅助单位" prop="auxiliaryUnitCn">
      </el-table-column>
      <el-table-column align="center" label="物料类型" prop="materialTypeName">
      </el-table-column>
      <el-table-column align="center" label="条形码" prop="barCode">
      </el-table-column>
      <el-table-column align="center" label="库存数量" prop="quantity">
      </el-table-column>      
      <el-table-column align="center" label="规格" prop="specs">
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
        <el-form-item label="物料id" prop="id" v-show="false">
          <el-input v-model="dataForm.id"></el-input>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="dataForm.materialCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名" prop="materialName">
          <el-input v-model="dataForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-select clearable class="filter-item" style="width: 300px;" v-model="dataForm.unit" :filter-method="filterUnit" filterable default-first-option >
            <el-option
              v-for="item in unitOptions"
              :key="item.unit"
              :label="item.unitCn"
              :value="item.unit">
              <span style="float: left">{{ item.unitCn }}</span>
              <span style="color: #8492a6; font-size: 13px">({{ item.unit }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="辅助单位" prop="auxiliaryUnit">
          <el-select clearable class="filter-item" style="width: 300px;" v-model="dataForm.auxiliaryUnit" :filter-method="filterAuxiliaryUnit" filterable default-first-option >
            <el-option
              v-for="item in auxiliaryUnitOptions"
              :key="item.unit"
              :label="item.unitCn"
              :value="item.unit">
              <span style="float: left">{{ item.unitCn }}</span>
              <span style="color: #8492a6; font-size: 13px">({{ item.unit }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料类型" prop="materialType">
          <el-select clearable class="filter-item" style="width: 300px;" v-model="dataForm.materialType" :filter-method="filterEditMaterialType" filterable default-first-option >
            <el-option
              v-for="item in materialTypeEditOptions"
              :key="item.materialType"
              :label="item.materialTypeName"
              :value="item.materialType">
              <span style="float: left">{{ item.materialTypeName }}</span>
              <span style="color: #8492a6; font-size: 13px">({{ item.materialType }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认供应商" prop="defaultSupplierId">
          <el-input v-model="dataForm.defaultSupplierId"></el-input>
        </el-form-item>
        <el-form-item label="条形码" prop="barCode">
          <el-input v-model="dataForm.barCode"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="quantity">
          <el-input-number v-model="dataForm.quantity"  style="width: 300px;" :precision="3" :step="1" controls-position="right" :min="0" ></el-input-number>
        </el-form-item>
        <el-form-item label="参考价(元)" prop="marketRefPrice">
          <el-input-number v-model="dataForm.marketRefPrice"  style="width: 300px;" :precision="3" :step="1" controls-position="right"  :min="0">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="规格" prop="specs">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入规格"
            v-model="dataForm.specs">
          </el-input>
        </el-form-item>
        <el-form-item label="库存数量上限" prop="maxQuantity">
          <el-input-number v-model="dataForm.maxQuantity"  style="width: 300px;" :precision="3" :step="1" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="库存数量下限" prop="minQuantity">
          <el-input-number v-model="dataForm.minQuantity"  style="width: 300px;" :precision="3" :step="1" controls-position="right"  :min="0"></el-input-number>
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
import { fetchList, createMaterial, updateMaterial, deleteMaterial } from '@/api/material'
import { all as allUnitList } from '@/api/unit'
import { all as fetchMaterialTypeList } from '@/api/materialType'
import { all as fetchSupplierList } from '@/api/supplier'

export default {
  name: 'List',
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      unitList: [],
      materialTypeList: [],
      materialTypeOptions: [],
      materialTypeEditOptions: [],
      unitOptions: [],
      auxiliaryUnitOptions: [],
      supplierList: [],
      supplierOptions: [],
      unitMap: new Map(),
      materialTypeMap: new Map(),
      supplierMap: new Map(),
      listQuery: {
        page: 1,
        limit: 20,
        p: undefined,
        materialTypes: [],
        sort: 'update_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        materialCode: '',
        materialName: '',
        unit: '',
        auxiliaryUnit: '',
        materialType: '',
        defaultSupplierId: '',
        barCode: '',
        quantity: '',
        marketRefPrice: '',
        specs: '',
        maxQuantity: '',
        minQuantity: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        materialName: [{ required: true, message: '物料名不能为空', trigger: 'blur' }],
        materialCode: [{ required: true, message: '物料编码不能为空', trigger: 'blur' }]

      },
      downloadLoading: false
    }
  },
  created() {
    this.init()
    this.getList()
  },
  methods: {
    init() {
      allUnitList().then(response => {
        this.unitList = response.data.data.items
        this.unitOptions = this.unitList
        this.auxiliaryUnitOptions = this.unitList
        for (const i of response.data.data.items) {
          console.log(i)
          this.unitMap.set(i.unit, i)
        }
      })
      fetchMaterialTypeList().then(response => {
        this.materialTypeList = response.data.data.items
        this.materialTypeOptions = this.materialTypeList
        this.materialTypeEditOptions = this.materialTypeList
        for (const i of response.data.data.items) {
          console.log(i)
          this.materialTypeMap.set(i.materialType, i)
        }
      })
      fetchSupplierList().then(response => {
        this.supplierList = response.data.data.items
        for (const i of response.data.data.items) {
          console.log(i)
          this.supplierMap.set(i.id, i)
        }
      })
    },
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
        materialName: undefined,
        materialCode: undefined,
        unit: undefined,
        auxiliaryUnit: undefined,
        materialType: undefined,
        defaultSupplierId: undefined,
        barCode: undefined,
        quantity: undefined,
        marketRefPrice: undefined,
        specs: undefined,
        maxQuantity: undefined,
        minQuantity: undefined,
        pic1Url: undefined
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
          createMaterial(this.dataForm).then(response => {
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
          updateMaterial(this.dataForm).then(() => {
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
      this.$confirm('确认删除物料: [' + row.materialName + '] ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterial(row.id).then(() => {
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
        const tHeader = ['物料名', '联系人', '联系电话码', '传真', '邮箱', '地址']
        const filterVal = ['materialName', 'contact', 'tel', 'fax', 'email', 'address']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '物料')
        this.downloadLoading = false
      })
    },
    filterMaterialType: function(value) {
      this.materialTypeOptions = this.filterMtype(this.materialTypeOptions, value)
    },
    filterEditMaterialType: function(value) {
      this.materialTypeEditOptions = this.filterMtype(this.materialTypeEditOptions, value)
    },
    filterMtype: function(options, value) {
      if (!value || value.trim() === '') {
        options = this.materialTypeList
        return options
      }
      options = this.materialTypeList.filter(p => {
        const exp = new RegExp(value.trim(), 'i')
        return exp.test(p.materialType) || exp.test(p.materialTypeName)
      })
      return options
    },
    filterUnit: function(value) {
      this.unitOptions = this.filterCommonUnit(this.unitOptions, value)
    },
    filterAuxiliaryUnit: function(value) {
      this.auxiliaryUnitOptions = this.filterCommonUnit(this.auxiliaryUnitOptions, value)
    },
    filterCommonUnit: function(options, value) {
      if (!value || value.trim() === '') {
        options = this.unitList
        return options
      }
      options = this.unitList.filter(p => {
        const exp = new RegExp(value.trim(), 'i')
        return exp.test(p.unit) || exp.test(p.unitCn)
      })
      return options
    },

    refreshMaterialTypes: function(event) {
      event.cancelBubble = true
      fetchMaterialTypeList().then(response => {
        this.materialTypeList = response.data.data.items
        this.materialTypeOptions = this.materialTypeList
        this.materialTypeMap.clear()
        for (const i of response.data.data.items) {
          console.log(i)
          this.materialTypeMap.set(i.materialType, i)
        }
      })
    }
  }
}
</script>
