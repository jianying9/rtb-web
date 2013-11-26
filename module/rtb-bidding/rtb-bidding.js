/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-bidding', {
    finishedListener: {
        initListener: function(yy) {
            //初始化position-list
            var positionList = yy.findInModule('position-list');
            positionList.init({
                key: 'positionId',
                itemEventListener: 'rtb-bidding.positionItemListener',
                dataToHtml: function(data) {
                    var result = '<div class="position_button">' + data.positionName + '</div>';
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
        }
    },
    eventListener: {
        positionItemListener: {
            click: function(yy) {
                yy.selected();
                var data = yy.getData();
                var biddingForm = yy.findInModule('bidding-form');
                biddingForm.loadData(data);
            }
        },
        biddingListener: {
            click: function(yy) {
                var biddingForm = yy.findInModule('bidding-form');
                var msg = biddingForm.getData();
                msg.act = 'AD_BIDDING';
                var adId = yy.getContext('adId');
                msg.adId = adId;
                yy.sendMessage(msg);
            }
        }
    },
    messageListener: {
    }
});