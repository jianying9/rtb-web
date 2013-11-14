/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-list', {
    finishedListener:{
    },
    eventListener:{
        extendListener:{
            click:function (yy) {
                var extendPanel = yy.findInModule('10000-extend');
                var rtbList = yy.getContext('rtbList');
                if(rtbList) {
                    var state = rtbList[yy.id];
                    if(state || state == 1) {
                        extendPanel.removeChildren();
                        rtbList[yy.id] = 0;
                    } else {
                        extendPanel.loadModule('rtb-click-history');
                        extendPanel.loadModule('rtb-bidding-history');
                        rtbList[yy.id] = 1;
                    }
                } else {
                    extendPanel.loadModule('rtb-click-history');
                    extendPanel.loadModule('rtb-bidding-history');
                    var rtbList = {};
                    rtbList[yy.id] = 1;
                    yy.setContext({rtbList:rtbList});
                }
            }
        },
        publishListener:{
            click:function (yy) {
                var publishForm = yy.findInModule('publish-form');
                var state = yy.getContext('publishForm');
                if(state || state == 1) {
                    publishForm.hide();
                    yy.setContext({publishForm: 0});
                } else {
                    publishForm.show();
                    yy.setContext({publishForm: 1});
                }
            }
        }
    },
    messageListener:{
    }
});