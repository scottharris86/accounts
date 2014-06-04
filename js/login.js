var App = {
    init : function() {
        this.checkHTML5();
        this.checkFlashMessage();

        // Remove any old session tokens
        FMEX.Session.clear();

        this.components = [
            this.Login,
            this.UI
        ];

        for (var c in this.components) {
            this.components[c].init();
        }
    },

      Login : {
        init : function() {
            this.$el = $('div.login-form');
            this.$el.find('input[name=username]').focus();
            this.$el.find('input').on('keypress', {parent : this}, this.UI._inputKeypress);
            this.$el.find('.signin').click({parent : this}, this.UI._clickLoginButton);
            this.$el.find('form[action="index"]').submit({parent : this}, this.UI._submitForm);
        },

        UI : {
            _inputKeypress : function(e) {
                if (!e.which || e.which != 13) return;
                e.data.parent.login();
                e.preventDefault();
            },
            _clickLoginButton : function(e) {
                e.data.parent.login();
            },
            _submitForm : function(e) {
                if (!FMEX.Session.get()) e.preventDefault();
            }
        },
        login : function() {
            var that = this;
            this.$el.find('.warning').slideUp();

            var response = FMEX.Services.Auth.Login(
                this.$el.find('input[name=username]').val(),
                this.$el.find('input[name=password]').val()
            );

            if (response.accepted == true) {
                FMEX.Auctions.clear();
                FMEX.Session.set(response.secret);
                FMEX.Session.setName(response.name);
                this.$el.find('input[name=username]').val(''),
                this.$el.find('input[name=password]').val('')
                that.$el.find('form[action="create"]').submit();
            } else {
                this.$el.find('.warning').slideDown();
            }
        },
    },

        UI : {
        init : function() {
            $('a.signup').click({parent : this}, function() {
                App.SignUp.show();
            });
        }
    },

    checkHTML5 : function() {
        if (!FMEX._hasStorage) {
            // Your browser is not supported.<br/>Upgrade to an HTML5-enabled browser.
            $('section.signup .signin').attr('disabled', 'disabled');
        }
    },
    checkFlashMessage : function() {
        if (FMEX._hasStorage && sessionStorage.getItem('flash')) {
            sessionStorage.removeItem('flash');
        }
    }
};


$(document).ready(function() {
    App.init();
});

