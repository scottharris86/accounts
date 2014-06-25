var App = {

  init : function(){

      //remove any old session tokens
      FMEX.Session.clear();

      //Initialize Objects
      this.components = [
        this.Login
      ];

      for (var c in this.components){
        this.components[c].init();
      }
  },

    Login : {

      init : function(){
        this.$el=$('section.signin');
        this.$el.find('input[name=username]').focus();
        this.$el.find('input').on('keypress', {parent : this}, this.UI._inputKeypress);
        this.$el.find('.signin').click({parent : this}, this.UI._clickLoginButton);
        this.$el.find('form[action="index.html"]').submit({parent : this}, this.UI._submitForm);

      },
      UI : {
        _inputKeypress : function(e){
          if (!e.which || e.which !=13) return;
          e.data.parent.login();
          e.preventDefault();
        },
        _clickLoginButton : function(e){
          e.data.parent.login();
        },
        _submitForm : function(e){
          if(!FMEX.Session.get()) e.preventDefault();
        }

      },

      login : function() {
        var that=this;

        var response=FMEX.Services.Auth.Login(this.$el.find('input[name=username]').val(), 
                                              this.$el.find('input[name=password]').val());
        if(response.accepted==true){
          FMEX.Session.set(response.secret);
          FMEX.Session.setName(response.name);
          this.$el.find('input[name=username]').val('');
          this.$el.find('input[name=password]').val('');
          that.$el.find('form[action="accounts.html"').submit();
        }
        else{
          $('.alert').fadeIn(1750);
        }
      },
    }
};


    

$(document).ready(function(){
  App.init();
});


