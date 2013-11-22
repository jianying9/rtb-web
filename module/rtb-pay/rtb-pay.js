/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-pay', {
    finishedListener:{
    },
    eventListener:{
        parForPointListener: {
            click: function(yy) {
                var payForm = yy.findInModule('pay-form');
                var msg = payForm.getData();
                msg.act = 'PAY_FOR_POINT';
                payForm.sendMessage(msg);
            }
        }
    },
    messageListener:{
    }
});