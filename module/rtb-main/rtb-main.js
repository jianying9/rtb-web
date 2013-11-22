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
            }
        }
    }
});