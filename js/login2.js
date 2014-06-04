var login = function() {
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
                that.$el.find('form[action="index"]').submit();
            } else {
                this.$el.find('.warning').slideDown();
            }
        },
    },
