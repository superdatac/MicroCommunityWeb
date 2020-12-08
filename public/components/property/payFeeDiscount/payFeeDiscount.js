/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            payFeeDiscountInfo: {
                feeDiscounts: [],
                feeId: '',
                communityId: vc.getCurrentCommunity().communityId,
                cycles: 1,
                quanDiscount: false,
                selectDiscountIds: [],
            }
        },
        watch: { // 监视双向绑定的数据数组
            payFeeDiscountInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.payFeeDiscountInfo.selectDiscountIds.length == $that.payFeeDiscountInfo.feeDiscounts.length) {
                        $that.payFeeDiscountInfo.quanDiscount = true;
                    } else {
                        $that.payFeeDiscountInfo.quanDiscount = false;
                    }

                    //计算优惠
                    $that._computeFeeDiscount();
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('payFeeDiscount', 'computeFeeDiscount', function (_param) {
                $that.payFeeDiscountInfo.selectDiscountIds = [];
                vc.copyObject(_param, $that.payFeeDiscountInfo);
                if ($that.payFeeDiscountInfo.cycles < 0) {
                    return;
                }
                vc.component._listFeeDiscounts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeDiscounts: function (_page, _rows) {
                let param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: DEFAULT_ROWS,
                        feeId: $that.payFeeDiscountInfo.feeId,
                        communityId: $that.payFeeDiscountInfo.communityId,
                        cycles: $that.payFeeDiscountInfo.cycles
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeDiscount/computeFeeDiscount',
                    param,
                    function (json, res) {
                        let _payFeeDiscountInfo = JSON.parse(json);
                        $that.payFeeDiscountInfo.feeDiscounts = _payFeeDiscountInfo.data;
                        $that.payFeeDiscountInfo.feeDiscounts.forEach(item => {
                            $that.payFeeDiscountInfo.selectDiscountIds.push(item.discountId);
                            item.discountPrice = Math.floor(item.discountPrice);
                        })
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeDiscountModal: function () {
                vc.emit('addFeeDiscount', 'openAddFeeDiscountModal', {});
            },
            checkAllDiscount: function (e) {
                var checkObj = document.querySelectorAll('.checkDiscountItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            let _value = checkObj[i].value;
                            vc.component.payFeeDiscountInfo.selectDiscountIds.push(_value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.payFeeDiscountInfo.selectDiscountIds = [];
                }
            },
            _computeFeeDiscount: function () {
                let _totalDiscountMoney = 0.0;
                let _selectDiscount = [];
                $that.payFeeDiscountInfo.selectDiscountIds.forEach(item => {
                    $that.payFeeDiscountInfo.feeDiscounts.forEach(disItem => {
                        if (item == disItem.discountId && disItem.discountPrice > 0) {
                            _totalDiscountMoney += parseFloat(disItem.discountPrice);
                            _selectDiscount.push(disItem);
                        }
                    })

                });

                vc.emit('payFeeOrder', 'changeDiscountPrice', {
                    totalDiscountMoney: _totalDiscountMoney,
                    selectDiscount: _selectDiscount
                })
            }

        }
    });
})(window.vc);
