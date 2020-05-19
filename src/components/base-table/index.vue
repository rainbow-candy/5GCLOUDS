<template>
  <el-table
    ref="elTable"
    @row-click="rowClick"
    @selection-change="$emit('selection-change', $event)"
    class="base-table full-width"
    :class="{ ksColor: colorType }"
    :data="data"
    :size="size"
    :border="border"
    :stripe="stripe"
    :default-sort="defaultSort"
    :max-height="height"
    :height="height"
    :show-summary="showSummary"
    :tree-props="treeProps"
    row-key="id"
    highlight-current-row
    @select="select"
    :row-style="{ height:'47px' }"
    :cell-style="{padding:'0px'}"
  >
    <el-table-column
      v-if="selection"
      width="42"
      type="selection"
      :reserve-selection="true"
    ></el-table-column>
    <el-table-column
      v-if="order"
      align="center"
      label="序号"
      width="60"
      type="index"
    ></el-table-column>
    <template v-for="item in columns">
      <el-table-column
        v-if="!item.filter"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :sortable="item.sortable"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="{ row }">
          <template v-if="item.clickEnable">
            <el-button @click="$emit('click', row, item)" type="text">
              {{ formatData(item, row) }}
            </el-button>
          </template>
          <template v-if="item.backColor">
            <div  v-bind:class="[ {'backColor0': formatData(item, row) === '执行成功'}, {'backColor1': formatData(item, row) === '正在执行'}, {'backColor2': formatData(item, row) === '未执行'}, {'backColor3': formatData(item, row) === '执行失败'}  ]">
            <!-- <div  v-bind:class="[ formatData(item, row) === '正在执行' ? 'backColor1' : 'backColor2'  ]"> -->
              {{formatData(item, row)}}
            </div>
          </template>
          <template v-else-if="item.backColorqk">
            <div v-bind:class="[ formatData(item, row) === '在线' ? 'backColor1' : 'backColor2'  ]">
              {{formatData(item, row)}}
            </div>
          </template>
          <template v-else-if="item.type === 'dic'">
            <dictionary-span
              :type="item.dicType"
              :binddata="row[item.prop]"
            ></dictionary-span>
          </template>
          <template v-else>
            {{ formatData(item, row) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="item.filter"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :sortable="item.sortable"
        :filters="item.filterData"
        :filter-method="filterTag"
        show-overflow-tooltip
        align="center"
      >
      <template slot-scope="{ row }">
          <template v-if="item.backColor">
            <div  v-bind:class="[ {'backColor0': formatData(item, row) === '执行成功'}, {'backColor1': formatData(item, row) === '正在执行'}, {'backColor2': formatData(item, row) === '未执行'}, {'backColor3': formatData(item, row) === '执行失败'}  ]">
            <!-- <div  v-bind:class="[ formatData(item, row) === '正在执行' ? 'backColor1' : 'backColor2'  ]"> -->
              {{formatData(item, row)}}
            </div>
          </template>
          <template v-else>
            {{ formatData(item, row) }}
          </template>
      </template>
      </el-table-column>
    </template>
    <slot></slot>
  </el-table>
</template>

<script>
import { format } from 'date-fns';

/**
 * 基础表格
 *
 * @prop {Array} data 表格数据，example：[{ [prop]: String }]
 * @prop {Array} columns 表格栏目
 * - example：[{
 *     prop: String, label: String, width: Number, sortable: Boolean,
 *     clickEnable: Boolean, type: String, dateFormat: String, formatter: Function
 *   }]
 * - sortable 是否排序
 * - clickEnable 是否可点击，会触发表格的 click 事件，详情见下面的 click 事件
 * - type 数据类型，date 为时间戳 dic为字典
 * - dateFormat 时间转换格式， 默认 'yyyy-MM-dd HH:mm:ss'
 * - formatter(value) 格式化单元格数据，参数为当前单元格数据，需返回展示的内容
 *
 * @prop {Boolean} border 是否有边框，默认无
 * @prop {Boolean} stripe 是否斑马条纹，默认有
 * @prop {String} size 表格大小，默认 mini
 * @prop {Boolean} order 是否有序号，默认无
 * @prop {Object} defaultSort 默认排序，example：{ prop: 'area', order: 'descending' }
 * @prop {String} height 表格高度
 * @prop {Boolean} showSummary 是否展示总计行，默认 false
 * @prop {Boolean} selection 是否展示复选框，默认 false
 * @prop {Object} treeProps 树形菜单的 props 对应参数，默认 { children: 'children' }
 *
 * @event selection-change 复选框勾选事件
 * @event click(data, column) 栏目点击事件，data 当前行的数据，column 当前栏目的数据
 * @event row-click(row, column, cell, event 行点击事件
 *
 * @method setCurrentRow(row) 设置当前行
 */
export default {
  name: 'baseTable',
  props: {
    data: Array,
    columns: Array,
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    defaultSort: Object,
    height: {
      type: String,
      default: 'auto'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    colorType: {
      type: Boolean,
      default: false
    },
    treeProps: {
      type: Object,
      default () {
        return { children: 'children' };
      }
    }
  },
  methods: {
    // 日期填充0
    dataAdd0 (value) {
      if (value >= 10) {
        return value;
      } else {
        return '0' + value;
      }
    },
    // 单元格数据格式化
    formatData (column, row) {
      const value = row[column.prop];
      if (value) {
        if (column.type === 'date') {
          return format(value, column.dateFormat || 'yyyy-MM-dd HH:mm:ss');
        } else if (column.type === 'time') {
          var d = new Date(value);
          return d.getFullYear() + '-' + this.dataAdd0(d.getMonth() + 1) + '-' + this.dataAdd0(d.getDate()) + ' ' + this.dataAdd0(d.getHours()) + ':' + this.dataAdd0(d.getMinutes()) + ':' + this.dataAdd0(d.getSeconds());
        } else if (column.formatter instanceof Function) {
          return column.formatter(value);
        } else {
          return value;
        }
      } else {
        return value;
      }
    },

    // 表格行点击事件
    rowClick (row, column, cell, event) {
      this.$emit('row-click', row, column, cell, event);
    },

    // 设置当前行
    setCurrentRow (row) {
      this.$refs.elTable.setCurrentRow(row);
    },

    // 勾选复选框
    select (selection, row) {
      this.$emit('select', selection, row)
    },

    // 勾选
    toggleSelection (row, state) {
      if (row) {
        this.$refs.elTable.toggleRowSelection(row, state);
      } else {
        this.$refs.elTable.clearSelection();
      }
    },

    // 清空勾选
    clearSelection () {
      this.$refs.elTable.clearSelection();
    },

    // 滚动
    handleCurrentChange () {
      this.$refs.elTable.bodyWrapper.scrollTop = 0;
    },

    filterTag (value, row, column) {
      const property = column.property;
      return row[property] === value;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/css/common-variables.scss';
@import '~@/assets/css/public.scss';

.base-table {
  // 文字是否换行
  .el-button {
    @extend .text-ellipsis;
    max-width: 100%;
  }
  /deep/ .cell {
    @extend .text-ellipsis;
    font-size: 15px;
    color: black;
  }
  .dyColor {
    /deep/ .is-checked {
      /deep/ .el-checkbox__inner {
        background-color: black;
        border-color: black;
      }
    }
  }
  .ksColor {
    /deep/ .is-checked {
      /deep/ .el-checkbox__inner {
        background-color: #e68048 !important;
        border-color: #e68048;
      }
    }
  }
  .backColor0 {
    background-color: #52b7da;
  }
  .backColor1 {
    background-color:#82B745;
  }
  .backColor2 {
    background-color:#ccc;
  }
  .backColor3 {
    background-color: #e06262;
  }
}
/deep/ .el-table__column-filter-trigger i {
  font-size: 20px;
}
</style>
