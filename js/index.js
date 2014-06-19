var App={

	init: function(){

		this.$el=$('.nav');
		this.$el.find('.item').show();
		$('#accounts').addClass('active');

		FMEX.Session.check();
		//intialize objects
		this.components = [
		this.AccountList,
		this.ModifyAccount,
		this.UI
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
					notional_limit : account.notional_limit,
					impression_limit : account.impression_limit,
					notional_avail : account.notional_avail,
					impression_avail : account.impression_avail

				}));
			}

		}

	},//showAccounts

	onClickAccount : function(e) {
		e.preventDefault();
		$('#create-account').hide();
		var that = e.data.parent;
		id = $(this).attr('data-id');
		selectedAccount=that.accounts[id];
		var list=$(".table > tbody");
		list.empty();
		list.append(_.template(that.rowTemplate, {
			id : selectedAccount.id,
			description : selectedAccount.description,
			status : selectedAccount.status,
			email : selectedAccount.email,
			notional_limit : selectedAccount.notional_limit,
			impression_limit : selectedAccount.impression_limit,
			notional_avail : selectedAccount.notional_avail,
			impression_avail : selectedAccount.impression_avail
			
		})),
		$('.buttons').show();
	},

	UI : {
		init: function(){
			this.$el=$('#create-account');
			this.$el.on('click', {parent: this}, App.onClickCreate);
			this.formTemplate=$('#template-modify-accounts').html();
		},

	},
	Modify : {
		init : function(){
			this.$el=$('.account-form');
			this.$el.find('button[name=submit]').on('click', {parent: this}, App.onClickModifySubmit);

		},
			modify : function(){
			this.$el=$('.account-form');
			var desc=$('input[name=description]').val();
			var status=this.$el.find('select[name=status]').val();
			var email=this.$el.find('input[id=email]').val();

		},

	},

	ModifyAccount : {

		init : function(){
			this.$el=$('#modify-button');
			this.$el.on('click', {parent: this}, App.onClickModify);
			this.formTemplate=$('#template-modify-accounts').html();

		},
	
		

	},

	CreateUser : {

		init: function(){
			this.$el=$('.account-form');
			this.$el.find('button[name=submit]').on('click', {parent: this}, App.onClickCreateSubmit);

		},


	},

	onClickModify : function(e) {
		var that=e.data.parent;
		$('section.for-table').hide();
		$('#modify-button').hide();
		//var id = $(that).attr('data-id');
		//selectedAccount=that.accounts[id];
		var list = $('section.for-form');
		list.empty();
		list.append(_.template(that.formTemplate, {
			legend : 'Modify',
			name : selectedAccount.name,
			description : selectedAccount.description,
			status : selectedAccount.status,
			email : selectedAccount.email,
			notional_limit : selectedAccount.notional_limit,
			impression_limit : selectedAccount.impression_limit,
			notional_avail : selectedAccount.notional_avail,
			impression_avail : selectedAccount.impression_avail
			
		}))
		$('.account-form').show();
		$('#delete-button').hide();
		App.Modify.init();

	},
	onClickCreate : function(e) {
		e.preventDefault();
		var that=e.data.parent;
		$('.buttons').hide();
		$('section.for-table').hide();
		$('#create-account').hide();
		var list = $('section.for-form');
		var blank='';
		list.empty();
		list.append(_.template(that.formTemplate, {
			legend : 'Create New',
			name : blank,
			description : blank,
			status : 'active',
			email : blank,
			notional_limit : blank,
			impression_limit : blank,
			notional_avail : blank,
			impression_avail : blank
		}))
		$('.account-form').show();
		App.CreateUser.init();

	},
	onClickModifySubmit : function(e){
		e.preventDefault();
		this.$el=$('.account-form');
		var result=FMEX.Services.Account.UpdateAndSave(selectedAccount.id, this.$el.find('input[name=name]').val(), this.$el.find('input[name=description]').val(),
			this.$el.find('select[name=status]').val(), this.$el.find('input[name=email]').val(), this.$el.find('input[name=notional_limit]').val(), 
			this.$el.find('input[name=impression_limit]').val(), this.$el.find('input[name=notional_avail]').val(), 
			this.$el.find('input[name=impression_avail]').val());
		if(result==true){
			window.location="index.html";
		}
	
	},
	onClickCreateSubmit : function(e){
		e.preventDefault();
		this.$el=$('.account-form');
		//var that=id;

		var test=this.$el.find('input[name=description]').val();
		var test2=this.$el.find('select[name=status]').val();
		var result=FMEX.Services.Account.CreateAndSave(this.$el.find('input[name=name]').val(), this.$el.find('input[name=description]').val(),
			this.$el.find('select[name=status]').val(), this.$el.find('input[name=email]').val(), this.$el.find('input[name=notional_limit]').val(), 
			this.$el.find('input[name=impression_limit]').val(), this.$el.find('input[name=notional_avail]').val(), 
			this.$el.find('input[name=impression_avail]').val());
		if(result==true){
			window.location="index.html";
		}
	},

//------------------------------------------------------------------------------------------------------------------------
	//End of onClickCreate Submit!!!!!! Need to Rewrite at Some point to be like Profiles.js...
	//I'm going to seperate the code from here for white list to be more readable and useable and we can just re-use it.

	//						This Will be The Beginning of Whitelist 
//------------------------------------------------------------------------------------------------------------------------
	ShowWhitelists : {
		init : function(){
			
			
		},

	},//End of ShowWhitelists
	
	








//--------------------------
};//End of App
//--------------------------

$(document).ready(function(){
	App.init();
	App.AccountList.Get();
	App.AccountList.Render();
	
});

