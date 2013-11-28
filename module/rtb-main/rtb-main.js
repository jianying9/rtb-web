/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-main', {
    finishedListener: {
        initListener: function(yy) {
            var mianPanel = yy.findInModule('rtb-main-panel');
            mianPanel.loadModule('rtb-list');
            //
            var bottomPanel = yy.findInModule('rtb-bottom-panel');
            bottomPanel.loadModule('rtb-bottom');
            //
            var nickNameForm = yy.findInModule('nick-name-form');
            var nickName = yy.getSession('loginNickName');
            nickNameForm.loadData({
                nickName: nickName
            });
            //查询剩余点数
            var msg = {
                act: 'INQUIRE_POINT'
            };
            yy.sendMessage(msg);
            //初始化position-list
            var positionList = yy.findInModule('position-list');
            positionList.init({
                key: 'positionId',
                itemMessageListener: 'rtb-main.positionMessageListener',
                dataToHtml: function(data) {
                    var result = '<div class="h20"></div>'
                            + '<div class="yy_ignore box">'
                            + '<div id="' + data.positionId + '-position-ad-title" class="yy_label box_header">' + data.positionName + '</div>'
                            + '<div class="yy_ignore box_content">'
                            + '<canvas class="yy_image position_ad" id="' + data.positionId + '-position-ad" yyHeight="250" yyWidth="250" yyEventListener="rtb-main.positionListener"></canvas>'
                            + '</div>'
                            + '</div>';
                    return result;
                }
            });
            //
            var listData = [
                {positionId: 0, positionName: '0号'},
                {positionId: 1, positionName: '1号'},
                {positionId: 2, positionName: '2号'},
                {positionId: 3, positionName: '3号'},
                {positionId: 4, positionName: '4号'},
                {positionId: 5, positionName: '5号'},
                {positionId: 6, positionName: '6号'},
                {positionId: 7, positionName: '7号'},
                {positionId: 8, positionName: '8号'},
                {positionId: 9, positionName: '9号'}
            ];
            positionList.loadData(listData);
            //加载广告位信息
            var msg = {
                act: 'INQUIRE_POSITION_AD'
            };
            for (var index = 0; index < listData.length; index++) {
                msg.positionId = listData[index].positionId;
                yy.sendMessage(msg);
            }
        }
    },
    eventListener: {
        logoutListener: {
            click: function(yy) {
                var mainModule = yy.findInModule('rtb-main');
                mainModule.remove();
                $.yyLoadModule('rtb-login');
            }
        },
        toPayListener: {
            click: function(yy) {
                var mainState = yy.getContext('mainState');
                if (!mainState || mainState !== 'rtb-pay') {
                    var mainPanel = yy.findInModule('rtb-main-panel');
                    mainPanel.removeChildren();
                    mainPanel.loadModule('rtb-pay');
                    yy.setContext({mainState: 'rtb-pay'});
                }
            }
        },
        toMyAdListener: {
            click: function(yy) {
                var mainState = yy.getContext('mainState');
                if (!mainState || mainState !== 'rtb-list') {
                    var mainPanel = yy.findInModule('rtb-main-panel');
                    mainPanel.removeChildren();
                    mainPanel.loadModule('rtb-list');
                    yy.setContext({mainState: 'rtb-list'});
                }
            }
        },
        positionListener: {
            click: function(yy) {
                var data = yy.getContext(yy.key);
                if (data) {
                    var url = data.url;
                    if (url.indexOf('http://') === -1) {
                        url = 'http://' + url;
                    }
                    window.open(url);
                }
            }
        }
    },
    messageListener: {
        pointMessageListener: {
            INQUIRE_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            },
            PAY_FOR_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            },
            ADD_AD_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            }
        },
        positionMessageListener: {
            INQUIRE_POSITION_AD: function(yy, message) {
                var data = message.data;
                var itemData = yy.getData();
                if (data.positionId === itemData.positionId) {
                    var positionAdId = itemData.positionId + '-position-ad';
                    var positionAd = yy.findInModule(positionAdId);
                    if (message.flag === 'SUCCESS') {
                        var context = {};
                        context[itemData.positionId + '-position-ad'] = data;
                        yy.setContext(context);
                        //
                        var image = new Image();
                        image.src = data.dataUrl;
                        positionAd.drawImage(image, 0, 0, 250, 250);
                        var positionAdTitleId = itemData.positionId + '-position-ad-title';
                        var positionAdTitle = yy.findInModule(positionAdTitleId);
                        var title = itemData.positionName + '  ›  最高竞价:' + data.bid + '点/次';
                        positionAdTitle.setLabel(title);
                    } else {
                        var image = new Image();
                        image.onload = function() {
                            positionAd.drawImage(image, 0, 0, 250, 250);
                        };
                        image.src = 'css/images/empty_ad.jpg';
                    }
                }
            }
        }
    }
});