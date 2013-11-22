/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-add-ad-point', {
    finishedListener:{
    },
    eventListener:{
        addAdPointListener: {
            click: function(yy) {
                var adId = yy.getContext('adId');
                var addForm = yy.findInModule('add-form');
                var msg = addForm.getData();
                msg.act = 'ADD_AD_POINT';
                msg.adId = adId;
                addForm.sendMessage(msg);
            }
        }
    },
    messageListener:{
        adPointMessageListener: {
            ADD_AD_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                }
            }
        }
    }
});