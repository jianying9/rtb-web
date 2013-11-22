/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-list', {
    finishedListener: {
        initListener: function(yy) {
            //初始化ad-list
            var adList = yy.findInModule('ad-list');
            adList.init({
                key: 'adId',
                dataToHtml: function(data) {
                    var result = '<canvas id="image-' + data.imageId + '" class="yy_image fl" yyWidth="48" yyHeight="48" yyMessageListener="rtb-list.loadImageMessageListener"></canvas>'
                            + '<div class="fl rtb_item_content">'
                            + '<div class="title">' + data.adName + '</div>'
                            + '<div class="h10"></div>'
                            + '<div class="small">'
                            + '<div class="fl">累计点击次数：</div><div class="fl">' + data.clickNumber + '次</div>'
                            + '<div class="fl">&nbsp;•&nbsp;累计花费:</div><div class="fl">' + data.clickPoint + '点</div>'
                            + '<div class="fl">&nbsp;•&nbsp;剩余点数:</div><div class="fl">' + data.adPoint + '点</div>'
                            + '<div class="fl">&nbsp;•&nbsp;最后操作时间：</div><div class="fl">' + data.lastUpdateTime + '</div>'
                            + '</div>'
                            + '</div>'
                            + '<div class="yy_ignore clear fc">'
                            + '<div class="yy_button link fr" yyEventListener="rtb-list.toAddAdPointListener">增加点数</div>'
                            + '<div class="yy_button link fr">竞价</div>'
                            + '</div>'
                            + '<div id="' + data.adId + '-add-point" class="yy_panel border item_inner yy_hide"></div>'
                            + '<div id="' + data.adId + '-bidding" class="yy_panel border item_inner yy_hide"></div>';
                    return result;
                }
            });
            //加载当前登录用户的广告
            var msg = {
                act: 'INQUIRE_AD'
            };
            yy.sendMessage(msg);
        }
    },
    eventListener: {
        toPublishListener: {
            click: function(yy) {
                var publishForm = yy.findInModule('publish-form');
                var state = yy.getContext('publishForm');
                if (state || state === 1) {
                    publishForm.hide();
                    yy.setContext({publishForm: 0});
                } else {
                    publishForm.show();
                    yy.setContext({publishForm: 1});
                }
            }
        },
        publishListener: {
            click: function(yy) {
                var publishForm = yy.findInModule('publish-form');
                var file = publishForm.getFile('imagePath');
                if (file) {
                    var imageWarmPanel = yy.findInModule('image-warn-panel');
                    if (file.size < 204800) {
                        imageWarmPanel.hide();
                        var fileReader = new FileReader();
                        fileReader.onload = function loaded(evt) {
                            var dataUrl = evt.target.result;
                            var msg = {
                                act: 'INSERT_IMAGE',
                                dataUrl: dataUrl
                            };
                            yy.sendMessage(msg);
                        };
                        fileReader.readAsDataURL(file);
                    } else {
                        imageWarmPanel.show();
                    }
                }
            }
        },
        toAddAdPointListener: {
            click: function(yy) {
                var listItem = yy.group;
                var itemData = listItem.getData();
                var pointId = itemData.adId + '-add-point';
                var biddingId = itemData.adId + '-bidding';
                var biddingPanel = yy.findInModule(biddingId);
                biddingPanel.hide();
                var pointPanel = yy.findInModule(pointId);
                var state = yy.getContext(pointId);
                var context = {};
                if (state) {
                    if (state === 'show') {
                        pointPanel.hide();
                        context[pointId] = 'hide';
                    } else {
                        pointPanel.show();
                        context[pointId] = 'show';
                    }
                } else {
                    pointPanel.loadModule('rtb-add-ad-point', {adId: itemData.adId});
                    context[pointId] = 'show';
                    pointPanel.show();
                }
                yy.setContext(context);
            }
        }
    },
    messageListener: {
        imageMessageListener: {
            INSERT_IMAGE: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var msg = yy.getData();
                    msg.imageId = data.imageId;
                    msg.act = 'INSERT_AD';
                    yy.sendMessage(msg);
                }
            }
        },
        loadImageMessageListener: {
            INQUIRE_IMAGE_BY_KEY: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var key = 'image-' + data.imageId;
                    if (yy.key === key) {
                        var image = new Image();
                        image.src = data.dataUrl;
                        yy.drawImage(image, 0, 0, 48, 48);
                    }
                }
            }
        },
        adMessageListener: {
            INSERT_AD: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var adList = yy.findInModule('ad-list');
                    adList.addItemDataFirst(data);
                    var msg = {
                        act: 'INQUIRE_IMAGE_BY_KEY',
                        imageId: data.imageId
                    };
                    yy.sendMessage(msg);
                }
            },
            INQUIRE_AD: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    if (message.pageIndex === 1 && data.length === 0) {
                        //无广告纪录，展开
                        var toPublishButton = yy.findInModule('to-publish-button');
                        toPublishButton.$this.click();
                    } else {
                        var adList = yy.findInModule('ad-list');
                        adList.loadData(data);
                        //加载图片
                        var imageId;
                        var msg = {
                            act: 'INQUIRE_IMAGE_BY_KEY'
                        };
                        for (var index = 0; index < data.length; index++) {
                            imageId = data[index].imageId;
                            msg.imageId = imageId;
                            yy.sendMessage(msg);
                        }
                    }
                }
            }
        }
    }
});