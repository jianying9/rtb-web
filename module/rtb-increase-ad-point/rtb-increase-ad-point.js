/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-increase-ad-point', {
    finishedListener:{
    },
    eventListener:{
        addAdPointListener: {
            click: function(yy) {
                var adId = yy.getContext('adId');
                var increaseAdForm = yy.findInModule('increase-ad-form');
                var msg = increaseAdForm.getData();
                msg.act = 'INCREASE_AD_POINT';
                msg.adId = adId;
                increaseAdForm.sendMessage(msg);
            }
        }
    },
    messageListener:{
    }
});