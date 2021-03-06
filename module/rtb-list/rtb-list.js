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
                            + '<div class="yy_ignore fl rtb_item_content">'
                            + '<div class="title">' + data.adName + '</div>'
                            + '<div class="h10"></div>'
                            + '<div class="yy_ignore small">'
                            + '<div class="fl">累计点击次数：</div><div class="fl">' + data.clickNumber + '</div><div class="fl">次</div>'
                            + '<div class="fl">&nbsp;•&nbsp;累计花费:</div><div class="fl">' + data.clickPoint + '</div><div class="fl">点</div>'
                            + '<div class="fl">&nbsp;•&nbsp;剩余点数:</div><div id="' + data.adId + '-adPoint" class=" yy_label fl">' + data.adPoint + '</div><div class="fl">点</div>'
                            + '<div class="fl">&nbsp;•&nbsp;最后操作时间：</div><div class="fl">' + data.lastUpdateTime + '</div>'
                            + '</div>'
                            + '</div>'
                            + '<div class="yy_ignore clear fc">'
                            + '<div class="yy_button link fr" yyEventListener="rtb-list.toIncreaseAdPointListener" yyMessageListener="rtb-list.increaseAdPointMessageListener">增加点数</div>'
                            + '<div class="yy_button link fr" yyEventListener="rtb-list.toAdBiddingListener" yyMessageListener="rtb-list.biddingMessageListener">竞价</div>'
                            + '</div>'
                            + '<div id="' + data.adId + '-increase-point-panel" class="yy_panel border item_inner yy_hide"></div>'
                            + '<div id="' + data.adId + '-bidding-panel" class="yy_panel border item_inner yy_hide"></div>';
                    return result;
                }
            });
            //加载当前登录用户的广告
            adList.setPageSize(10);
            var msg = {
                act: 'INQUIRE_AD',
                pageIndex: 1,
                pageSize: 10
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
        toIncreaseAdPointListener: {
            click: function(yy) {
                var listItem = yy.group;
                var itemData = listItem.getData();
                var pointId = itemData.adId + '-increase-point-panel';
                var biddingId = itemData.adId + '-bidding-panel';
                var state = yy.getContext(biddingId);
                var context = {};
                if (state && state === 'show') {
                    var biddingPanel = yy.findInModule(biddingId);
                    biddingPanel.hide();
                    context[biddingId] = 'hide';
                    yy.setContext(context);
                }
                //
                var pointPanel = yy.findInModule(pointId);
                state = yy.getContext(pointId);
                context = {};
                if (state) {
                    if (state === 'show') {
                        pointPanel.hide();
                        context[pointId] = 'hide';
                    } else {
                        pointPanel.show();
                        context[pointId] = 'show';
                    }
                } else {
                    pointPanel.loadModule('rtb-increase-ad-point', {adId: itemData.adId});
                    context[pointId] = 'show';
                    pointPanel.show();
                }
                yy.setContext(context);
            }
        },
        toAdBiddingListener: {
            click: function(yy) {
                var listItem = yy.group;
                var itemData = listItem.getData();
                var pointId = itemData.adId + '-increase-point-panel';
                var biddingId = itemData.adId + '-bidding-panel';
                var state = yy.getContext(pointId);
                var context = {};
                if (state && state === 'show') {
                    var pointPanel = yy.findInModule(pointId);
                    pointPanel.hide();
                    context[pointId] = 'hide';
                    yy.setContext(context);
                }
                //
                var biddingPanel = yy.findInModule(biddingId);
                state = yy.getContext(biddingId);
                context = {};
                if (state) {
                    if (state === 'show') {
                        biddingPanel.hide();
                        context[biddingId] = 'hide';
                    } else {
                        biddingPanel.show();
                        context[biddingId] = 'show';
                    }
                } else {
                    biddingPanel.loadModule('rtb-bidding', {adId: itemData.adId});
                    context[biddingId] = 'show';
                    biddingPanel.show();
                }
                yy.setContext(context);
            }
        },
        nextListener: {
            click: function(yy) {
                var adList = yy.findInModule('ad-list');
                var pageSize = adList.getPageSize();
                var pageIndex = adList.getPageIndex();
                pageIndex++;
                var msg = {
                    act: 'INQUIRE_AD',
                    pageIndex: pageIndex,
                    pageSize: pageSize
                };
                yy.sendMessage(msg);
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
                    var publishForm = yy.findInModule('publish-form');
                    publishForm.clear();
                    var adList = yy.findInModule('ad-list');
                    var nowDate = new Date();
                    data.lastUpdateTime = $.yyShortDate(data.lastUpdateTime, nowDate);
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
                        //时间处理
                        var nowDate = new Date();
                        var lastUpdateTime;
                        for (var index = 0; index < data.length; index++) {
                            lastUpdateTime = data[index].lastUpdateTime;
                            data[index].lastUpdateTime = $.yyShortDate(lastUpdateTime, nowDate);
                        }
                        var adList = yy.findInModule('ad-list');
                        adList.loadData(data);
                        adList.setPageIndex(message.pageIndex);
                        adList.setPageSize(message.pageSize);
                        //判断是否显示下一页按钮
                        var nextButton = yy.findInModule('next-button');
                        if (data.length === message.pageSize) {
                            nextButton.show();
                        } else {
                            nextButton.hide();
                        }
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
        },
        increaseAdPointMessageListener: {
            INCREASE_AD_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var listItem = yy.group;
                    var itemData = listItem.getData();
                    if (itemData.adId === message.data.adId) {
                        var pointId = itemData.adId + '-increase-point-panel';
                        var state = yy.getContext(pointId);
                        if (state && state === 'show') {
                            var pointPanel = yy.findInModule(pointId);
                            pointPanel.hide();
                            var context = {};
                            context[pointId] = 'hide';
                            yy.setContext(context);
                        }
                        //
                        var labelId = itemData.adId + '-adPoint';
                        var adPointLabel = yy.findInModule(labelId);
                        adPointLabel.setLabel(message.data.adPoint);
                    }
                }
            }
        },
        biddingMessageListener: {
            AD_BIDDING: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var listItem = yy.group;
                    var itemData = listItem.getData();
                    var data = message.data;
                    if (itemData.adId === data.adId) {
                        var biddingId = itemData.adId + '-bidding-panel';
                        var state = yy.getContext(biddingId);
                        if (state && state === 'show') {
                            var biddingPanel = yy.findInModule(biddingId);
                            biddingPanel.hide();
                            var context = {};
                            context[biddingId] = 'hide';
                            yy.setContext(context);
                        }
                    }
                }
            }
        }
    }
});