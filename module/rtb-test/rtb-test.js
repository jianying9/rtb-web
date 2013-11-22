/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-test', {
    finishedListener: {
        initListener: function(yy) {
            var bottomPanel = yy.findInModule('login-bottom-panel');
            bottomPanel.loadModule('rtb-bottom');
        }
    },
    eventListener: {
        uploadListener: {
            click: function(yy) {
                var uploadForm = yy.findInModule('upload-form');
                var file = uploadForm.getFile('uploadFile');
                if (file) {
                    var fileReader = new FileReader();
                    fileReader.onload = function loaded(evt) {
                        var dataUrl = evt.target.result;
                        var imageCanvas = yy.findInModule('image-canvas');
                        var image = new Image();
                        image.src = dataUrl;
                        imageCanvas.drawImage(image, 0, 0, 100, 100);
                    };
                    fileReader.readAsDataURL(file);
                }
            }
        }
    },
    messageListener: {
        uploadProcessListener: {
            UPLOAD_FILE: function(yy, message) {
            }
        }
    }
});