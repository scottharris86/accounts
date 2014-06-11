var App={

	init: function(){

		this.$el=$('.nav');
		this.$el.find('.item').show();
		$('#profiles').addClass('active');

		FMEX.Session.check();
		//intialize objects
		this.components = [
		this.showProfiles
		];

		for (var c in this.components){
        this.components[c].init();
    	}
	},

	showProfiles : {

		init: function(){

			this.$el=$('section.for-table');
			this.$el.find('.row');
		},

		Get : function(){
			var profiles=FMEX.Services.Auth.Get();

			
			 console.log(profiles);
			
			for(var profile in profiles){

				/*$(".table > tbody").append("<tr><td>"+accounts[account].description+
					"</td><td>"+accounts[account].status+"</td><td>"+accounts[account].email+"</td><td>"+
					accounts[account].notional_limit+"</td><td>"+accounts[account].impression_limit+"</td><td>"+
					accounts[account].notional_avail+"</td><td>"+accounts[account].impression_avail+"</td></tr>");*/

					$(".table > tbody").append("<tr><td>"+profiles[profile].firstName+
						"</td><td>"+profiles[profile].lastName+"</td><td>"+profiles[profile].userName+
						"</td><td>"+profiles[profile].email+"</td><tr>");
			}


		}

	}


};

$(document).ready(function(){
	App.init();
	App.showProfiles.Get();
	
});

