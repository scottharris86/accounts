var App={

	init: function(){

		this.$el=$('.nav');
		this.$el.find('.item').show();
		$('#accounts').addClass('active');

		FMEX.Session.check();
		//intialize objects
		this.components = [
		this.AccountList
		];

		for (var c in this.components){
        this.components[c].init();
    	}
	},

	AccountList : {

		 accounts : [],

		init: function(){
			this.$el=$('section.for-table');
			this.$el.on('click', '.account', {parent: this}, App.onClickAccount);
			this.rowTemplate=$('#accounts-template').html();

			
		},

		Get : function(){
			this.accounts=FMEX.Services.Account.Get();

			},

			Render : function(){
				var list=this.$el.find(".table > tbody");
				list.empty();

			
			for (var idx=0; idx<this.accounts.length; idx++){
				var account=this.accounts[idx];

				list.append(_.template(this.rowTemplate, {
					id : idx,
					description : account.description,
					status : account.status,
					email : account.email,
					notation_limit : account.notional_limit,
					impression_limit : account.impression_limit,
					notation_avail : account.notional_avail,
					impression_avail : account.impression_avail

				}));
			}

		}

	},//showAccounts

	onClickAccount : function(e) {
		var that = e.data.parent;
		var id = $(this).attr('data-id');
		test=that.accounts[id];
		console.log(test);
		var list=$(".table > tbody");
		list.empty();
		list.append(_.template(that.rowTemplate, {
			id : test.id,
			description : test.description,
			status : test.status,
			email : test.email,
			notation_limit : test.notional_limit,
			impression_limit : test.impression_limit,
			notation_avail : test.notional_avail,
			impression_avail : test.impression_avail
			
		}))

	},

	UI : {





	}

};

$(document).ready(function(){
	App.init();
	App.AccountList.Get();
	App.AccountList.Render();
});

