//订单查询
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            storeOrderCartManageInfo:{
                orderCarts:[],
                total:0,
                records:1,
                orderDetail:false,
                conditions:{
                    cartId:'',
                    state:'',
                    prodName:''
                }
            }
        },
        _initMethod:function(){
            vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            vc.on('storeOrderCartManage','goBack',function(_param){
                vc.component.storeOrderCartManageInfo.orderDetail = false;
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listOrders(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listOrders:function(_page, _rows){
                vc.component.storeOrderCartManageInfo.conditions.page = _page;
                vc.component.storeOrderCartManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.storeOrderCartManageInfo.conditions
               };
               //发送get请求
               vc.http.apiGet('/storeOrder/queryStoreOrderCart',
                             param,
                             function(json,res){
                                var _storeOrderCartManageInfo=JSON.parse(json);
                                vc.component.storeOrderCartManageInfo.total = _storeOrderCartManageInfo.total;
                                vc.component.storeOrderCartManageInfo.records = _storeOrderCartManageInfo.records;
                                $that.storeOrderCartManageInfo.orderCarts = _storeOrderCartManageInfo.data;

                                let _orderCarts = $that.storeOrderCartManageInfo.orderCarts;

                                _orderCarts.forEach(item => {
                                        let _productSpecDetails = item.productSpecDetails;
                                        let _specValue = '';
                                        _productSpecDetails.forEach(detail => {
                                            _specValue += (detail.detailValue+"/");
                                        });

                                        item.specValue = _specValue;
                                });

                                vc.emit('pagination','init',{
                                     total:vc.component.storeOrderCartManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _queryOrdersMethod:function(){
                vc.component._listOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openOrderDetailModel:function(_order){
                vc.component.storeOrderCartManageInfo.orderDetail = true;
                vc.emit('orderDetailManage','listOrderDetails',_order.cBusiness);
            }
        }
    });
})(window.vc);
