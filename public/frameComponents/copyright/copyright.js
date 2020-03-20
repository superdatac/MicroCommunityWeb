/**
 版权 处理
 **/
(function (vc) {
    var vm = new Vue({
        el: '#copyright',
        data: {
            copyrightInfo: {
                logo: 'HC',
                company: 'java110官方团队',
                date: '2017-2019',
                openSource: '代码 https://github.com/java110/MicroCommunity'
            }
        },
        mounted: function () {
            this._initSysInfo();
            //this.getUserInfo();
        },
        methods: {
            _initSysInfo: function () {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    this.copyrightInfo.logo = "HC";
                    return;
                }
                this.copyrightInfo.logo = sysInfo.logo;
            },
            _initView: function () {

                let footer = document.getElementsByClassName('footer')[0];
                windowH = document.documentElement.clientHeight;
                bodyH = document.body.offsetHeight;
                bodyH < windowH ? (footer.style.position = 'fixed', footer.style.bottom = '0') : (footer.style.position = '');
                
            }
        }
    });

    window.onresize = function () { vm._initView() }

})(window.vc)