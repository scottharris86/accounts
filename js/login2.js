var loginTest2= function () {
    var that=this;
    var response = FMEX.Services.Auth.Login(document.getElementsById('username').val(), 
        document.getElementsById('password').val());
    if (response.accepted==true){
        FMEX.Session.set(response.secret);
        FMEX.Session.setname(response.name);
        this.getElementsById('username').val('');
        this.getElementsById('password').val('');
        that.getElementsById('form').submit();
        else{
            console.log("Failed to Login!!!")
        }

    }
}


