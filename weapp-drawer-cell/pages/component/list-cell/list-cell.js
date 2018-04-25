/* 侧滑 菜单 */
let CELL_MAX_MOVE = 166; //单位px
const CELL_MIN_MOVE = 60; //滑动最小多少距离  就会自动继续滑
const UPDATE_MILE_SEC = 50; //自动关闭、打开 每次刷新毫秒

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    hidden: { // 是否显示
      type: Boolean,
      value: false,
    },
    dataList: { // 数组集合
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    operateItemWidth: CELL_MAX_MOVE
  },

  attached: function (e) {
    //TODO:请获取屏幕宽度，计算出最大左滑宽度 ,这里就不给出方法了，只要app launch 的时候 wx.getSystemInfoSync 然后，存入缓存中
    // let screenWidth = UserAgentBiz.UserAgent["Width"];
    // if (screenWidth != 375) {
    //   CELL_MAX_MOVE = Math.floor(screenWidth * CELL_MAX_MOVE / 375);
    // }
    // console.log('计算后的 CELL_MAX_MOVE', CELL_MAX_MOVE)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isClickToClose: false,
    /**
     * 点击 
     */
    _bindCellTapHandler: function (e) {
      if (this.isClickToClose) {
        console.log('isOpen不触发 详情页');
        this.isClickToClose = false;
        return;
      }
      let index = e.currentTarget.dataset.index;
      let tapItem = e.currentTarget.dataset.value;
      console.log('点击选项，', tapItem)
      this.triggerEvent('onCellTap', {
        index: index,
        tapItem: tapItem
      });
    },
    _closeOperateItems: function () {
      this.setData({
        ["dataList[" + this.lastIndex + "].cellMoveLeftDistance"]: 0,
      });
      this.isOpen = false;
      this.isClickToClose = true;
      this.lastIndex = 0;
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
      if (this.lastIndex > -1 && this.isOpen) {
        this._closeOperateItems();
      }

      //判断是否只有一个触摸点
      this.currentIndex = e.currentTarget.dataset.index;
      let startX = e.touches[0].clientX;


      if (e.touches.length != 1) {
        console.log('多指触摸不触发 cellTouchStart');
        return;
      }

      this.setData({
        startX: startX //记录触摸起始位置的X坐标
      });

      console.log('start', this.data.startX)
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
      let moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      let disX = this.data.startX - moveX;
      // console.log('move', disX)

      if (this.isOpen) {
        if (disX > 0) {
          console.log('|<-------isOpen 已经到 左边 顶到了...');
          return;
        }
      }

      if (this.currentX > 0) {
        this.currentX = disX;
      } else { //初始
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

      if (this.isOpen) {
        disX = disX + CELL_MAX_MOVE;
      }

      // let vw = disX / 375;
      this.setData({
        ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -disX //-(Math.round(vw * 100)) //计算成vw
      });
    },
    /**
     * 触摸结束
     */
    _cellTouchEnd: function (e) {
      if (e.changedTouches.length != 1) {
        console.log('多指触摸不触发 cellTouchEnd');
        return;
      }

      let endX = e.changedTouches[0].clientX;
      let disX = this.data.startX - endX;
      if (this.isReachTop) {
        if (disX > 0) { //左滑到顶
          this.isOpen = true;
          console.log('cellTouchEnd <--左滑到顶 重置为', CELL_MAX_MOVE);
          disX = CELL_MAX_MOVE;
        } else {
          disX = 0; //右滑到顶  
          this.isOpen = false;
          console.log('cellTouchEnd -->右滑到顶 重置为', 0);
        }
      }

      console.log('----- end disX', disX);

      if (this.isOpen) { //在打开状态下，只要稍微右滑，就自动关闭
        if (disX < -CELL_MIN_MOVE) { //右滑距离大于 MIN 自动关闭
          //右滑是负数
          // let newX = -(CELL_MAX_MOVE + disX);
          // for (let i = newX; i <= 0; i++) {//TODO：由于setTimeOut会导致，卡顿，动画进行很慢，所以，不采用。只有一个项的时候，是正常的
          // let vw = Math.round(i / 375 * 100); //计算成vw
          // setTimeout(() => {
          this.setData({
            //["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: i
            ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: 0
          });
          // }, UPDATE_MILE_SEC)
          // }
          this.isOpen = false;
        } else { //自动回弹再打开
          // let initDisX = CELL_MAX_MOVE + disX;
          // for (let i = initDisX; i < CELL_MAX_MOVE; i++) {//TODO：由于setTimeOut会导致，卡顿，动画进行很慢，所以，不采用。只有一个项的时候，是正常的
          // let vw = -(Math.round((i) / 375 * 100)); //计算成vw
          // setTimeout(() => {
          this.setData({
            // ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -i
            ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -CELL_MAX_MOVE
          });
          // }, UPDATE_MILE_SEC)
          // }
          this.isOpen = true;
        }
      } else {
        //判断滑了375 中的 MAX 就算左滑，然后，自动打开
        if (disX > CELL_MIN_MOVE) { //是否加 disX<CELL_MAX_MOVE  有bug就加  因为前面已经判断isReacheTop
          this.isOpen = true;
          // for (let i = disX; i < CELL_MAX_MOVE; i++) {//TODO：由于setTimeOut会导致，卡顿，动画进行很慢，所以，不采用。只有一个项的时候，是正常的
          // let vw = -(Math.round((i) / 375 * 100)); //计算成vw
          // setTimeout(() => {
          this.setData({
            // ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -i
            ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -CELL_MAX_MOVE
          });
          // }, UPDATE_MILE_SEC)
          // }
        } else { //回退距离小于 MAX 自动关闭
          this.isOpen = false;
          // for (let i = disX; i > -1; i--) {//TODO：由于setTimeOut会导致，卡顿，动画进行很慢，所以，不采用。只有一个项的时候，是正常的
          // let vw = -(Math.round((i) / 375 * 100)); //计算成vw
          // setTimeout(() => {
          this.setData({
            // ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: -i,
            ["dataList[" + this.currentIndex + "].cellMoveLeftDistance"]: 0,
          });
          // }, UPDATE_MILE_SEC)
          // }
        }
      }
      this.currentX = 0; //滑动完，重置
      this.isReachTop = false;
      if (this.isOpen) {
        this.lastIndex = this.currentIndex;
      }
    },
  }
})