var FMEX = {
    _hasStorage : function(){
        //Detect localStorage
        var uid = new Date,
            result;
        try {
            localStorage.setItem(uid, uid);
            result = localStorage.getItem(uid) == uid;
            localStorage.removeItem(uid);

            // Checking if this works
            console.log("We have Storage!!!");
            return result && localStorge;
        } catch(e){}
    }, // end of _hasStorage

    Services : {
        //ServiceHost : '54.205.222.178',
        ServiceHost : '10.211.55.6',

        // Return a web service URL
        WebServiceURL : (function (port, resource, limits, append){
            var params = {};

            var doAppend = (typeof(append) === 'undefined') ? true : append;
            if (doAppend === true){
                params = FMEX.Session.appendParam(params);
            }

            if (typeof(limits) !== 'undefined'){
                if (limits.hasOwnProperty('limit') && limits.hasOwnProperty('offset')){
                    params.limit = limits.limit;
                    params.offset = limit.offset;
                }
            }

            return 'http://' + FMEX.Services.ServiceHost + ':' + port + '/' +
                resource + FMEX.Session.getParam();
        }), // end of WebServiceURL

        Auth : {
            LoginUrl : function(){
                var domain = FMEX.Services.ServiceHost;

                return 'http://'+domain+':8081/auth/login'
            },// end of LoginUrl

            Login : function(data){

                var result = false;
                $.ajax({
                    url : FMEX.Services.Auth.LoginUrl(),
                    type : 'POST',
                    contentType : 'application/json',
                    dataType : 'json',
                    data : JSON.stringify(data),
                    async : false,
                    success : function(data){
                        FMEX.Session.set(data.secret);
                        result = true;
                    },
                    error : function(e){
                        console.log(e);
                    },
                });

                return result;
            },// end of Login

            // Gets all the User profiles from the database
            Get : function(){
                var profiles = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'auth/all'),
                    type: 'GET',
                    dataType : 'json',
                    async : false,
                    success : function(data){
                        profiles = data;
                    },
                    error : function(e){
                        console.log("error: " + e);
                    var error = e;
                    },
                });

                return profiles
            },// end of Get

            CreateUser : function(data){
                var result = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'auth/user'),
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data : JSON.stringify(data),
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e.status);
                        console.log(JSON.stringify(data));
                        result = e;
                    },
                });

                return result;
            },// end of CreateUser

            ChangePassword : function(id, data){
                var result = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'auth/user/' + id +'/password'),
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data : JSON.stringify(data),
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e.status);
                        console.log(JSON.stringify(data));
                        result = e;
                    },
                });

                return result;
            },// end of ChangePassword

            ModifyUser : function(id, data){
                console.log(data);
                var result = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'auth/user/' + id),
                    type: 'PATCH',
                    contentType: 'application/json',
                    dataType: 'json',
                    data : JSON.stringify(data),
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e.status);
                        console.log(JSON.stringify(data));
                        result = e;
                    },
                });

                return result;
            },// end of ModifyUser

            ModifyCapabilities : function(id, data){
                console.log(data);
                var result = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'auth/modify_capabilities/' + id),
                    type: 'PATCH',
                    contentType: 'application/json',
                    dataType: 'json',
                    data : JSON.stringify(data),
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e.status);
                        console.log(JSON.stringify(data));
                        result = e;
                    },
                });
                return result;
            },// end of ModifyCapabilities
        }, // end of Auth

        // Retrieves all people in database.
        Account : {
            Get : function(){
                var accounts = [];
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'acct/all'),
                    type: 'GET',
                    dataType : 'json',
                    async : false,
                    success : function(response){
                        accounts = response;
                    },
                    error : function(e){
                        console.log("error: " + e);
                        var error = e;
                    }
                });

                return accounts;
            }, // end of Get

            UserGet : function(userId){
                var accounts = [];
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'acct/user/' + userId),
                    type: 'GET',
                    dataType : 'json',
                    async : false,
                    success : function(response){
                        accounts = response;
                    },
                    error : function(e){
                        console.log("error: " + e);
                        var error = e;
                    }
                });

                return accounts;
            }, // end of UserGet

            ModifyMapping : function(id, stack){
                var result = false;
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'acct/user/' + id),
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data : JSON.stringify(stack),
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e.status);
                        console.log(JSON.stringify(stack));
                        result = e;
                    },
                });

                return result;
            },// end of ModifyMapping

            UpdateAndSave : function(data){

                var result = false;
                $.ajax(FMEX.Services.WebServiceURL(8081,'acct'), {

                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    async: false,
                    success: function(response){
                        result = true;
                    },
                    error : function(e){
                        alert("The request do not go through. Please refresh the page.");
                    }
                });

            }// end of Update
        }, // end of Account

        Whitelist : {

            Get : function(){

                var result = [];
                $.ajax({
                    url : FMEX.Services.WebServiceURL(8081,'wls/all'),
                    type: 'GET',
                    dataType : 'json',
                    async : false,
                    success : function(response){
                        result = response;
                    },
                    error : function(e){
                        console.log("error: " + e);
                    }
                });

                return result;
            },// end of Get
        },// end of Whitelist
    }, // end of Services

    Session : {
        key : 's',
        getParam : function() {
            return '?' + this.key + '=' + localStorage.getItem(this.key);
        },//end of getParam

        // add the query parameter to the given object as a kvp
        appendParam : function (params) {
            params[this.key] = localStorage.getItem(this.key);
            return params;
        }, // end of appendParam

        clear : function() {
            localStorage.removeItem(this.key);
        }, // end of clear

        // I do not think i can use this part.
        // Also, i do not have fmex.local as the local host...
        check : function() {
            if (!FMEX._hasStorage || !this.get()) {
                localStorage.setItem('flash', 'Your session has expired. Please log in again.');
                if(window.location.host != 'fmex.local') window.location = 'login';
            }
        }, // end of check

        get : function() {
            return localStorage.getItem(this.key);
        }, // end of get

        set : function(token) {
            localStorage.setItem(this.key, token);
        }, // end of set

        getName : function() {
            // Looks like he got lazy.
            // Need: change the hardcoded 'n'
            return localStorage.getItem('n');
        }, // end of getName

        setName : function(token) {
            localStorage.setItem("n", token);
        }, // end of setName

        // I cannot use this as is.
        // Need: change or get rid of
        display : function() {
            var el = $('.top_header .userName');
            el.text(this.getName());
        } //end of display
    } // end of Session
}; // end of FMEX
