/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-login', {
    finishedListener: {
        initListener: function(yy) {
            var bottomPanel = yy.findInModule('login-bottom-panel');
            bottomPanel.loadModule('rtb-bottom');
        }
    },
    eventListener: {
        registerListener: {
            click: function(yy) {
                var registerForm = yy.findInModule('register-form');
                var msg = registerForm.getData();
                msg.act = 'REGISTER';
                registerForm.sendMessage(msg);
            }
        },
        toLoginListener: {
            click: function(yy) {
                var registerPanel = yy.findInModule('register-panel');
                var loginPanel = yy.findInModule('login-panel');
                var registerLink = yy.findInModule('register-link-panel');
                var loginLink = yy.findInModule('login-link-panel');
                registerPanel.hide();
                loginLink.hide();
                registerLink.show();
                loginPanel.show();
            }
        },
        loginListener: {
            click: function(yy) {
                var loginForm = yy.findInModule('login-form');
                var msg = loginForm.getData();
                msg.act = 'LOGIN';
                loginForm.sendMessage(msg);
            }
        },
        toRegisterListener: {
            click: function(yy) {
                var registerPanel = yy.findInModule('register-panel');
                var loginPanel = yy.findInModule('login-panel');
                var registerLink = yy.findInModule('register-link-panel');
                var loginLink = yy.findInModule('login-link-panel');
                registerLink.hide();
                loginPanel.hide();
                registerPanel.show();
                loginLink.show();
            }
        }
    },
    messageListener: {
        registerMessageListener: {
            REGISTER: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var registerPanel = yy.findInModule('register-panel');
                    var loginPanel = yy.findInModule('login-panel');
                    var registerLink = yy.findInModule('register-link-panel');
                    var loginLink = yy.findInModule('login-link-panel');
                    registerPanel.hide();
                    loginLink.hide();
                    registerLink.show();
                    loginPanel.show();
                    //
                    var loginForm = yy.findInModule('login-form');
                    loginForm.loadData(message.data);
                }
            }
        },
        loginMessageListener: {
            LOGIN: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    yy.setSession({
                        loginNickName: data.nickName,
                        loginUserId: data.userId,
                        loginUserEmail: data.userEmail
                    });
                    //
                    var loginModule = yy.findInModule('rtb-login');
                    loginModule.remove();
                    $.yyLoadModule('rtb-main');
                }
            }
        }
    }
});