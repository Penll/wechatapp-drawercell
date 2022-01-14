import Util from '../../../utils/util';

/* 侧滑 菜单 */
const CELL_MAX_MOVE = 200; //单位px
const CELL_MIN_MOVE = 60; //滑动最小多少距离  就会自动继续滑

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      // 是否显示
      type: Boolean,
      value: false
    },
    isRadiusCorner: {
      type: Boolean,
      value: false
    },
    dataList: {
      // 数组集合
      type: Array,
      value: []
    },

    operateNameList: {
      // 操作数组集合
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    operateItemWidth: CELL_MAX_MOVE
  },

  attached: function (e) {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击
     */
    _bindCellTapHandler: function (e) {
      let index = e.currentTarget.dataset.index;
      let tapItem = e.currentTarget.dataset.value;
      console.log('点击选项，', tapItem);
      this.triggerEvent('onCellTap', {
        index: index,
        tapItem: tapItem
      });
    },
    _closeOperateItems: function (index) {
      if (typeof index != "undefined") {
        this.lastIndex = index;
      }

      this.translateXItem(this.lastIndex, 0, 100)

      this.isOpen = false;
    },
    /**
     * 操作列
     */
    _bindOperateTapHandler: function (e) {
      let index = e.currentTarget.dataset.index;
      let tapItem = e.currentTarget.dataset.value;
      this.triggerEvent('onOperateTap', {
        index: index,
        tapItem: tapItem
      });
      this._closeOperateItems();
    },
    currentIndex: -1,
    lastIndex: -1,
    /**
     * 触摸起始
     */
    _cellTouchStart: function (e) {
      //点击新的区域，同时判断，是否已经有一个滑出的，就立刻关闭旧的
      if (typeof this.lastIndex != "undefined" && this.lastIndex > -1 && this.isOpen) {
        this._closeOperateItems();
      }

      //判断是否只有一个触摸点
      this.currentIndex = e.currentTarget.dataset.index;
      let startX = e.touches[0].clientX;
      let startY = e.touches[0].clientY;

      if (e.touches.length != 1) {
        console.log('多指触摸不触发 cellTouchStart');
        return;
      }

      this.setData({
        startX: startX, //记录触摸起始位置的X坐标
        startY: startY
      });

    },

    currentX: 0,
    isReachTop: false,
    isOpen: false,
    /**
     * 触摸移动
     */
    _cellTouchMove: function (e) {
      if (e.touches.length != 1) {
        console.log('多指触摸不触发 cellTouchMove');
        return;
      }

      //记录触摸点位置的X坐标
      let touchX = e.touches[0].clientX;
      // let touchY = e.touches[0].clientY;

      let moveX = e.touches[0].clientX - this.data.startX
      let moveY = e.touches[0].clientY - this.data.startY

      //计算手指起始点的 X 坐标与当前触摸点的 X 坐标的差值
      let disX = this.data.startX - touchX;

      //已触发垂直滑动，由scroll-view处理滑动操作
      if (this.swipeDirection === 2) {
        return;
      }
      //未触发滑动方向
      if (this.swipeDirection === 0) {
        if (Math.abs(moveY) > Math.abs(moveX)) {
          //触发垂直操作
          this.swipeDirection = 2;
          console.log('--- 触发垂直滑动');
          return;
        }
      } else {
        this.swipeDirection = 1;
      }

      if (this.isOpen) {
        if (disX > 0) {
          console.log('|<-------isOpen 已经到 左边 顶到了...');
          return;
        }
      }

      if (this.currentX > 0) {
        this.currentX = disX;
      } else {
        //初始
        //初始的时候，不让往右滑
        if (disX < 0 && !this.isOpen) {
          this.isReachTop = true;
          console.log('------->| 已经到 右边 顶到了...');
          return;
        }
      }

      //大于最大宽度，就不再滑 CELL_MAX_MOVE
      if (disX > CELL_MAX_MOVE) {
        this.isReachTop = true;
        console.log('|<------- 已经到 左边 顶到了...');
        return;
      }

      if (moveX > -10) {//只是拖动一点点，就不动
        console.log('|<--->| 只是左右动一点点...');
        return;
      }

      if (this.isOpen) {
        disX = disX + CELL_MAX_MOVE;
      }

      this.translateXItem(this.currentIndex, -disX, 1)
    },
    /**
     * 触摸结束
     */
    _cellTouchEnd: function (e) {
      if (e.changedTouches.length != 1) {
        console.log('多指触摸不触发 cellTouchEnd');
        return;
      }

      if (this.swipeDirection !== 1) {
        return;
      }

      let endX = e.changedTouches[0].clientX;
      let disX = this.data.startX - endX;

      let endY = e.changedTouches[0].clientY;
      let disY = this.data.startY - endY;

      if (this.isReachTop) {
        if (disX > 0) {
          //左滑到顶
          this.isOpen = true;
          console.log('cellTouchEnd <--左滑到顶 重置为', CELL_MAX_MOVE);
          disX = CELL_MAX_MOVE;
        } else {
          disX = 0; //右滑到顶
          this.isOpen = false;
          console.log('cellTouchEnd -->右滑到顶 重置为', 0);
        }
      }

      console.log('----- end disX', disX, disY, this.isOpen);

      if (this.isOpen) {
        //在打开状态下，只要稍微右滑，就自动关闭
        // if (disX < -CELL_MIN_MOVE) {
        //   //右滑距离大于 MIN 自动关闭
        //   this._closeOperateItems();
        // } else {
        if (disX >= -CELL_MIN_MOVE) {
          //自动回弹再打开
          this.isOpen = true;
          this.lastIndex = this.currentIndex;

          return this.translateXItem(this.currentIndex, -CELL_MAX_MOVE - 15, 200)
        }
      } else {
        //判断滑了375 中的 MAX 就算左滑，然后，自动打开
        if (disX > CELL_MIN_MOVE) {
          //是否加 disX<CELL_MAX_MOVE  有bug就加  因为前面已经判断isReacheTop
          this.isOpen = true;
          this.lastIndex = this.currentIndex;

          return this.translateXItem(this.currentIndex, -CELL_MAX_MOVE - 15, 200)
        }

      }
      this.currentX = 0; //滑动完，重置
      this.isReachTop = false;

      this._closeOperateItems(this.currentIndex);
    },

    _bindReset: function () {
      let param = {}
      for (let itemIndex of Object.keys(this.data.dataList)) {
        let animation = wx.createAnimation({
          duration: 300,
        })
        animation.translateX(0).step()
        let indexString = `dataList[${itemIndex}].animation`
        param[indexString] = animation.export()
      }
      this.setData(param)

    },

    translateXItem(itemIndex, x, duration) {
      let animation = wx.createAnimation({
        duration: duration,
      })
      animation.translateX(x).step()
      this.animationItem(itemIndex, animation)
    },

    animationItem(itemIndex, animation) {
      if (Util.isEmpty(itemIndex)) {
        itemIndex = 0;
      }
      let param = {}
      let indexString = `dataList[${itemIndex}].animation`
      param[indexString] = animation.export()
      this.setData(param)
    },
  }
});
