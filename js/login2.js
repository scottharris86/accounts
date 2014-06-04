var loginTest2= function () {
    FMEX.Session.clear();
    console.log("in the function!!!")
    var that=this;
    var response = FMEX.Services.Auth.Login(document.getElementById('username').value, 
        document.getElementById('password').value);
    if (response.accepted==true){
        FMEX.Session.set(response.secret);
        FMEX.Session.setName(response.name);
        //this.getElementById('username').value;
        //this.getElementById('password').value;
           this.document.getElementById('form').submit();

    }
        else{
            console.log("Failed to Login!!!");
            document.getElementById('form').action="login.html";
        }

}
var changeUrl = function (){
    //document.getElementById('form').action=;
}





