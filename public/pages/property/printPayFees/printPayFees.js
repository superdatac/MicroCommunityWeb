(function (vc) {

    vc.extends({
        data: {
            printPayFeeInfo: {
                communityName: '',
                receiptId:'',
                roomName: '',
                type: '',
                month: '',
                amount: 0.00,
                fees: [],
                feeTime: '',
                wechatName:'',
                content:'',
                qrImg:''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printPayFeeInfo.receiptId = vc.getParam('receiptId');
            $that.printPayFeeInfo.roomName = vc.getParam('roomName');
            $that.printPayFeeInfo.type = vc.getParam('type');
            $that.printPayFeeInfo.month = vc.getParam('month');

            //$that.printPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());

            $that.printPayFeeInfo.communityName = vc.getCurrentCommunity().name;

            $that._loadReceipt();

            $that._loadPrintSpec();
        },
        _initEvent: function () {


        },
        methods: {
            _initPayFee: function () {

            },
            _loadReceipt:function(){

                var param = {
                    params: {
                        page:1,
                        row:20,
                        receiptId:$that.printPayFeeInfo.receiptId,
                        roomName:$that.printPayFeeInfo.roomName,
                        type:$that.printPayFeeInfo.type,
                        month:$that.printPayFeeInfo.month,

                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptNew',
                    param,
                    function (json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        // console.log(_feeReceiptManageInfo);

                       let _feeReceipt = _feeReceiptManageInfo.data[0];

                        $that.printPayFeeInfo.roomArea = _feeReceipt.roomArea;
                        $that.printPayFeeInfo.roomName = _feeReceipt.objName;
                        $that.printPayFeeInfo.name = _feeReceipt.name;
                        $that.printPayFeeInfo.feeTime = _feeReceipt.createTime;
                        $that.printPayFeeInfo.userName = _feeReceipt.userName;
                        $that.printPayFeeInfo.amount = 0;

                        for(var i =0 ; i<_feeReceiptManageInfo.data.length; i++){
                            $that.printPayFeeInfo.amount += parseFloat(_feeReceiptManageInfo.data[i].amount)*1000000000000;
                        }
                        $that.printPayFeeInfo.amount = $that.printPayFeeInfo.amount/1000000000000;
                        $that.printPayFeeInfo.fees  = _feeReceiptManageInfo.data;

                        // $that._loadReceiptDetail();
                    
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadReceiptDetail:function(){

                var param = {
                    params: {
                        page:1,
                        row:100,
                        receiptId:$that.printPayFeeInfo.receiptId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptDetail',
                    param,
                    function (json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                       let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        $that.printPayFeeInfo.fees = _feeReceiptDetails;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadPrintSpec: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        specCd: 2020,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feePrintSpec/queryFeePrintSpec',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        var _data = _json.data;
                        if (_data.length > 0) {
                            $that.printPayFeeInfo.content = _data[0].content;
                            $that.printPayFeeInfo.qrImg = _data[0].qrImg;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            _printPurchaseApplyDiv: function () {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none";//隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });

})(window.vc);
