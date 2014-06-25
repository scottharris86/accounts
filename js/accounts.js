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
			this.$el=$('section.accounts-table');
			this.$el.on('click', '.account', {parent: this}, App.onClickAccount);
			this.rowTemplate=$('#accounts-template').html();

			
		},

		Get : function(){
			this.accounts=FMEX.Services.Account.Get();

		},

		Render : function(){
				var list=this.$el.find(".account-row");
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
			$('.accounts-table').show();
			this.$el=$('button[name=whitelist-button]');
			this.$el.on('click', {parent: this}, App.onClickWhitelist);

		},
		onClickShowModal : function(){

		},
		

	},//showAccounts
	onClickWhitelist : function(e){
			App.ShowWhitelistsPage.init();
			App.ShowWhitelistsPage.GetAll();
		},

	onClickAccount : function(e) {
		e.preventDefault();
		$('section.create-button').hide();
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
			this.$el=$('button[name=create-account]');
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
		$('section.accounts-table').hide();
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
		$('section.accounts-table').hide();
		$('section.create-button').hide();
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
	//End of onClickCreate Submit   !!!!!!Need to Rewrite at Some point to be like Profiles.js...
	//I'm going to seperate the code from here for white list to be more readable and useable and we can just re-use it.

	//						This Will be The Beginning of Whitelist 
//------------------------------------------------------------------------------------------------------------------------
	ShowWhitelistsPage : {
		whitelists : [],

		init : function(){
			$('button[name=create-account]').hide();
			$('button[name=whitelist-button]').hide();
			$('section.accounts-table').hide();
			this.rowTemplate=$('#whitelist-table-template').html();
			$('button[name=create-whitelist-button]').on('click', {parent: this}, this.onClickCreateButton);
			this.$el=$('section.whitelist-table');
			this.$el.on('click', '.whitelist', {parent: this}, this.onClickWhitelistSelect);

		},
		GetAll : function(){
			var list = $('.whitelist-row');
			list.empty();
			this.whitelists = FMEX.Services.Whitelist.GetAll();
			for (var idx=0; idx< this.whitelists.length; idx++){
				var whitelist = this.whitelists[idx];
				selectedWhitelist = whitelist;
				list.append(_.template(this.rowTemplate, {
					id : whitelist.id,
					id2 : whitelist.id,
					name : whitelist.name,
					status : whitelist.status,
					accountName : FMEX.Services.Account.GetSpecificAcct(whitelist.account_id).description,
					userName : FMEX.Services.Auth.GetById(whitelist.user_id).userName 

				}));

			}
			$('section.whitelist-table').show();
			//App.ShowWhitelistsPage.init();
		},
		onClickCreateButton : function(e){
			App.CreateWhitelistFormPage.init();

		},
		
		onClickSubmitCreate : function(e){
			e.preventDefault();
			var name = $('input[name=name]').val();
			var status = $('select[name=status]').val();
			var userName = $('select[name=user-name]').val();
			var accountName = $('select[name=account-name]').val();
			if(name||status||userName||accountName==''){
				alert('No Nulls Allowed')
				return;
			}
			else{
				window.location="index.html";
			}

		},
		onClickWhitelistSelect : function(e){
			selectedId=$(this).attr('data-id');

			App.SelectedWhitelistPage.init();
		},

	},//End of ShowWhitelists
	CreateWhitelistFormPage : {
		init : function(){
				$('section.for-form').hide();
			$('section.whitelist-table').hide();
			var Profiles = FMEX.Services.Auth.Get();
			//selectedProfile = FMEX.Services.Auth.GetById(selectedWhitelist.user_id);
			//Accounts = FMEX.Services.Account.GetAccountsByID(selectedProfile.userId);
			Accounts = FMEX.Services.Account.Get();

			this.formTemplate=$('#template-modify-whitelist').html();
			var list = $('section.for-form');
			list.empty();
			list.append(_.template(this.formTemplate, {
				legend : 'Create New',
				name : '',
				status : 'active',
				thisAccountName : '',
				userName : ''
			}));

			for(var i in Profiles){
				var profile = Profiles[i];
				$('#user-name').append("<option>"+profile.userName+"</option>");
			}
			for(var i in Accounts){
				var account=Accounts[i];
				$('#account-name').append("<option>"+account.description+"</option>");
			}

			$('#user-name').on('change', function(){
				for(var i in Profiles){
					if($('#user-name').val()==Profiles[i].userName){
						selectedProfile=Profiles[i];
						Accounts = FMEX.Services.Account.GetAccountsByID(selectedProfile.userId);

					}
				}
				$('#account-name').empty();
				for(var i in Accounts){
					var account=Accounts[i];
					$('#account-name').append("<option>"+account.description+"</option>");
				}
				
			});	

			$('section.for-form').show();
			$('.manage-list').closest('.control-group').hide();
			$('button[name=submit]').on('click', {parent: this}, this.onClickSubmitCreate);
		},
		onClickSubmitCreate : function(e){
			e.preventDefault();
			var name = $('input[name=name]').val();
			var status = $('select[name=status]').val();
			var userName = $('select[name=user-name]').val();
			for(var i in Accounts){
				if($('select[name=account-name]').val()==Accounts[i].description){
				var accountName = Accounts[i];
				}
			}
			if(name === ''||status === ''||userName ===''||accountName ===''){
				alert('No Nulls Allowed')
				return;
			}
			else{
				FMEX.Services.Whitelist.Create(selectedProfile.id, accountName.id, name, status);
				window.location="index.html";
			}

		},


	},//End of CreateWhitelistFormPage
	SelectedWhitelistPage : {
		init : function(){
			$('section.whitelist-table').hide();
			$('button[name=create-whitelist-button]').hide();
			selectedWhitelist = FMEX.Services.Whitelist.GetAll();
			for(var i in selectedWhitelist){
				if(selectedId==selectedWhitelist[i].id){
					selectedWhitelist=selectedWhitelist[i];
					break;
				}


			}
			this.rowTemplate=$('#whitelist-table-template').html();
			var list = $('.whitelist-row');
			list.empty();
			list.append(_.template(this.rowTemplate, {
				id : selectedWhitelist.id,
				id2 : selectedWhitelist.id,
				name : selectedWhitelist.name,
				status : selectedWhitelist.status,
				accountName : FMEX.Services.Account.GetSpecificAcct(selectedWhitelist.account_id).description,
				userName : FMEX.Services.Auth.GetById(selectedWhitelist.user_id).userName

			}));
			$('section.whitelist-table').show();
			$('section.selected-whitelistpage-buttons').show();
			$('button[name=modify-whitelist-button]').on('click', {parent: this}, this.onClickModifyButton);

		},
		onClickModifyButton : function(e){
			$('section.whitelist-table').hide();
			$('section.selected-whitelistpage-buttons').hide();
			this.formTemplate=$('#template-modify-whitelist').html();
			var Profiles = FMEX.Services.Auth.Get();
			selectedProfile = FMEX.Services.Auth.GetById(selectedWhitelist.user_id);
			Accounts = FMEX.Services.Account.GetAccountsByID(selectedProfile.userId);
			var list = $('section.for-form');
			list.empty();
			list.append(_.template(this.formTemplate, {
				legend : 'Modify',
				name : selectedWhitelist.name,
				status : selectedWhitelist.status,
				thisAccountName : FMEX.Services.Account.GetSpecificAcct(selectedWhitelist.account_id).description,
				userName : selectedProfile.userName

			}));
			for(var i in Profiles){
				var profile = Profiles[i];
				$('#user-name').append("<option>"+profile.userName+"</option>");
			}
			for(var i in Accounts){
				var account=Accounts[i];
				$('#account-name').append("<option>"+account.description+"</option>");
			}

			$('#user-name').on('change', function(){
				for(var i in Profiles){
					if($('#user-name').val()==Profiles[i].userName){
						selectedProfile=Profiles[i];
						Accounts = FMEX.Services.Account.GetAccountsByID(selectedProfile.userId);

					}
				}
				$('#account-name').empty();
				for(var i in Accounts){
					var account=Accounts[i];
					$('#account-name').append("<option>"+account.description+"</option>");
				}
				
			});			
			App.ModifyWhitelistFormPage.init();
		},

	},//End of SelectedWhitelistPage
	ModifyWhitelistFormPage : {
		init : function(){
			$('section.for-form').show();
			$('.manage-list').on('click', {parent: this}, this.onClickManageInviteeList);
			$('.modal-save-button').on('click', {parent: this}, this.onClickSaveEntries);
			$('.modal-close-button').on('click', this.onClickModalClose);
			$('button[name=submit]').on('click', {parent: this}, this.onClickSubmitForm);
		},
		onClickManageInviteeList : function(e){
			this.rowTemplate=$('#modal-account').html();
			var list=$('.modal-row');
			list.empty();
			var Accounts = FMEX.Services.Account.Get();
			for (var i in Accounts){
				var entrie=Accounts[i];
				list.append(_.template(this.rowTemplate, {
					id: entrie.id,
					description : entrie.description

				}));
			}
			$(".modal-account").each(function(){
				for(var i=0; i<selectedWhitelist.entries.length; i++){
					if($(this).attr('data-id')==selectedWhitelist.entries[i]){
						$(this).addClass('success');
						$(this).find('input[name=checkbox]').prop('checked', true);
					}
				}
			});
			$('#myModal').modal('show');

			entries = selectedWhitelist.entries;
			this.$el=$('.modal-account');

			$('input[name=checkbox]').on('click', function(){
				var id=$(this).attr('data-id');
				
				if(this.checked==true){
					$(this).closest('.modal-account').addClass('success');
					entries.push(id);
				}
				else{
					$(this).closest('tr').removeClass('success');
					for(var idx=0; idx<entries.length; idx++){
						if(id==entries[idx]){
							entries.splice(idx, 1);
							
						}
					}
				}

			});

		},
		onClickSaveEntries : function(e){
			FMEX.Services.Whitelist.Update(selectedWhitelist.id, selectedWhitelist.user_id, selectedWhitelist.account_id, selectedWhitelist.name, selectedWhitelist.status, entries);
			$('#myModal').modal('hide');
		},
		onClickModalClose : function(e){
			$('#myModal').modal('hide');
		},
		onClickSubmitForm : function(e){
			this.$el=$('section.for-form');
			var SelectedAccount=false;
			for (var i in Accounts){
				if(this.$el.find('select[name=account-name]').val()==Accounts[i].description){
					SelectedAccount=Accounts[i];
				}

			}
		FMEX.Services.Whitelist.Update(selectedWhitelist.id, selectedProfile.id, SelectedAccount.id, $('input[name=name]').val(), $('select[name=status]').val(), selectedWhitelist.entries);


		},


	},//End of ModifyWhiteListFormPage


//--------------------------
};//End of App
//--------------------------

$(document).ready(function(){
	App.init();
	App.AccountList.Get();
	App.AccountList.Render();
	
});

