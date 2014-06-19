var App={

	init : function(){
		$('.item').show();
		$('#profiles').addClass('active');

//checks the login session------------------
		FMEX.Session.check();

//Initialize Objects on app load------------
		this.components=[
			this.ShowProfiles,
			this.UI


		];

		for(var c in this.components){
			this.components[c].init();
		}

	},//end of App init----------------------------	
	ShowProfiles : {

		profiles : [],

		init : function(){
			this.$el=$('section.profiles-table');
			this.$el.find('.row');
			this.rowTemplate=$('#template-profiles').html();
			this.$el.off().on('click', '.profile', {parent: this}, this.onClickProfile);
		},
		Get : function(){
			this.profiles=FMEX.Services.Auth.Get();
		},
		Render : function(){
				var list=this.$el.find(".table > tbody");
				list.empty();
			
			for (var idx=0; idx<this.profiles.length; idx++){
				var profile=this.profiles[idx];

				list.append(_.template(this.rowTemplate, {
					id : idx,
					firstName : profile.firstName,
					lastName : profile.lastName,
					userName : profile.userName,
					email : profile.email,
					status : profile.status

				}));
			}

		},
		onClickProfile : function(e){
			e.preventDefault();
			$('#create-profile-button').hide();
			var that=e.data.parent;
			id=$(this).attr('data-id');
			selectedProfile=that.profiles[id];
			var list=$(".table > tbody");
			list.empty();
			list.append(_.template(that.rowTemplate, {
				id : selectedProfile.id,
				firstName : selectedProfile.firstName,
				lastName : selectedProfile.lastName,
				userName : selectedProfile.userName,
				email : selectedProfile.email,
				status : selectedProfile.status

			})),
			App.SelectedProfilePage.init();

		},

	},//end of ShowProfiles------------------------
	ShowAccounts : {

		accounts : [],

		init : function(){
			this.$el=$('section.accounts-table');
			this.$el.find('.row');
			this.rowTemplate=$('#accounts-template').html();
			this.$el.off().on('click', '.account', {parent: this}, this.onClickAccount);

		},
		GetAll : function(){
			this.accounts=FMEX.Services.Account.Get();
		},
		RenderAll : function(){
			$('.profiles-account-table').hide();
			var list=$('.table > tbody');
			list.empty();

			for (var idx=0; idx<this.accounts.length; idx++){
				var account= this.accounts[idx];

				list.append(_.template(this.rowTemplate,{
					id : account.id,
					description : account.description,
					status : account.status,
					email : account.email,
					notional_limit : account.notional_limit,
					impression_limit : account.impression_limit,
					notional_avail : account.notional_avail,
					impression_avail : account.impression_avail

				}));
			}
			$('section.account-table').show();
			App.AddAccountsPage.init();
			
		},
		GetLinked : function(){
			profileAccounts=FMEX.Services.Account.GetAccountsByID(selectedProfile.id);
			linkedAccounts=[];



		},
		RenderLinked : function(){
			$('.selected-profile-buttons').hide();
			$('section.profiles-table').hide();
			var list=$('.table > tbody');
			list.empty();
			for (var account in profileAccounts){
				linkedAccounts.push(profileAccounts[account].id);
				list.append(_.template(this.rowTemplate, {
					id : profileAccounts[account].id,
					description : profileAccounts[account].description,
					status : profileAccounts[account].status,
					email : profileAccounts[account].email,
					notional_limit : profileAccounts[account].notional_limit,
					impression_limit : profileAccounts[account].impression_limit,
					notional_avail : profileAccounts[account].notional_avail,
					impression_avail : profileAccounts[account].impression_avail
				}));
			}
			App.LinkedAccountsPage.init();

		},

	},//end of ShowAccounts------------------------
	UI : {
		//initial UI...Basically just adds a create new button to the top of both pages
		init : function(){
			this.$el=$('.create-profile-button');
			this.$el.on('click', {parent: this}, this.onClickCreateButton);

		},
		onClickCreateButton : function(e){
			App.CreateProfilePage.init();
		},

	},//end of UI----------------------------------
	SelectedProfilePage : {
		init : function(){
			$('.selected-profile-buttons').show();
			this.$el=$('.selected-profile-buttons');
			this.$el.find('button[id=modify-button]').on('click', {parent: this}, this.onClickModifyButton);
			this.$el.find('button[name=linked-accounts]').on('click', {parent: this}, this.onClickShowLinkedAccounts);
			this.$el.find('button[name=change-password]').on('click', {parent: this}, this.onClickChangePassword);

		},
		onClickModifyButton : function(e){
			App.ModifyProfilePage.init();

		},
		onClickShowLinkedAccounts : function(e){
			App.ShowAccounts.init();
			App.ShowAccounts.GetLinked();
			App.ShowAccounts.RenderLinked();
		},
		onClickChangePassword : function(e){
			App.ChangePasswordPage.init();
		},

	},//end of SelectedProfilePage-----------------
	ModifyProfilePage : {
		init : function(){
			$('section.profiles-table').hide();
			$('.selected-profile-buttons').hide();
			this.formTemplate=$('#template-modify-profiles').html();
			var list = $('section.for-form');
			list.empty();
			list.append(_.template(this.formTemplate, {
				legend : 'Modify',
				firstName : selectedProfile.firstName,
				lastName : selectedProfile.lastName,
				userName : selectedProfile.userName,
				email : selectedProfile.email,
				status : selectedProfile.status
			}));
			$('.profiles-form').show();
			$('button[name=submit]').on('click', {parent: this}, this.onClickSubmitModify);
			$('button[name=cancel]').on('clcik', {parent: this}, this.onClickCancelForm);//dont need function??

		},
		onClickSubmitModify : function(e){
			e.preventDefault();
			this.$el=$('.profiles-form');
			var result=FMEX.Services.Auth.Modify(selectedProfile.id, this.$el.find('input[name=firstName]').val(), this.$el.find('input[name=lastName]').val(),
				this.$el.find('input[name=userName]').val(), this.$el.find('input[name=email]').val(), this.$el.find('select[name=status]').val());
			//if(result===true){!!!!!!!!!!!!!!!need to find out why im always stepping into the error function
				window.location="profiles.html";
			//}
		},

	},//end of ModifyProfilePage-------------------
	ChangePasswordPage : {
		init : function(){
			$('section.profiles-table').hide();
			$('.selected-profile-buttons').hide();
			this.formTemplate=$('#template-changePassword').html();
			var list=$('section.for-form');
			list.empty();
			list.append(_.template(this.formTemplate, {
				legend : 'Change Password',
				password1 : '',
				password2 : ''
			}));
			$('.password-form').show();
			this.$el=$('button[name=submit]');
			this.$el.on('click', {parent: this}, this.onClickPasswordSubmit);
		},
		onClickPasswordSubmit : function(e){
			var id=selectedProfile.id;
			var pass1=$('#password1').val();
			var pass2=$('#password2').val();
			if (pass1!=pass2){
				alert("Passwords Do Not Match");
				return;
			}
			else{
				FMEX.Services.Auth.ChangeUserPassword(id, pass1);
			}
			window.location="profiles.html";//!!!!!!!find out why I'm in error here as well??????
		},

	},//end of ChangePasswordPage------------------
	LinkedAccountsPage : {
		init : function(){
			$('section.accounts-table').show();
			$('.account-mapping-buttons').show();
			this.$el=$('.table');
			this.$el.off().on('click', '.account', {parent: this}, this.onClickAccountSelect);
			$('button[name=add-account]').on('click', {parent: this}, this.onClickAddAcounts);
			$('button[name=remove-account').on('click', {parent: this}, this.onClickRemoveAccount);

		},
		onClickAccountSelect : function(e){
			var id=$(this).attr('data-id');
			selectedAccountId=id;
			$(this).addClass('success');

		},
		onClickAddAcounts : function(e){
			App.ShowAccounts.init();
			App.ShowAccounts.GetAll();
			App.ShowAccounts.RenderAll();
		},
		onClickRemoveAccount : function(){
			for(var idx in linkedAccounts){
				if(selectedAccountId==linkedAccounts[idx]){
					linkedAccounts.splice(idx, 1);
				}
			}
			FMEX.Services.Account.UpdateUserAccountMappings(selectedProfile.id, linkedAccounts);
			window.location="profiles.html";

		},


	},//end of LinkedAccountsPage------------------
	AddAccountsPage : {
		init : function(){
			this.$el=$('.row');
			this.$el.on('click', '.account', {parent: this}, this.onClickAddAccount);

		},
		onClickAddAccount : function(e){
			var id=$(this).attr('data-id');
			selectedAccountId=id;
			if(linkedAccounts.length==0){
				linkedAccounts.push(selectedAccountId);
			}
			for(var idx in linkedAccounts){
				if(selectedAccountId==linkedAccounts[idx]){
					linkedAccounts=linkedAccounts;
				}
				else{
					linkedAccounts.push(selectedAccountId);
				}
			}
			FMEX.Services.Account.UpdateUserAccountMappings(selectedProfile.id, linkedAccounts);
			window.location="profiles.html";

		},

	},//end of AddAccountsPage---------------------
	CreateProfilePage : {
		init : function(){
			$('.create-profile-button').hide();
			$('section.profiles-table').hide();
			this.formTemplate=$('#template-modify-profiles').html();
			var list=$('section.for-form');
			list.empty();

			list.append(_.template(this.formTemplate, {
				legend : 'Create New',
				firstName : '',
				lastName : '',
				userName : '',
				email : '',
				status : 'active'

			}));
			$('.profiles-form').show();
			this.$el=$('button[name=submit]');
			this.$el.on('click', {parent: this}, this.onClickSubmitProfileForm);

		},
		onClickSubmitProfileForm : function(e){
			this.$el=$('.profiles-form')
			var result=FMEX.Services.Auth.Create(this.$el.find('input[name=userName]').val(), this.$el.find('input[name=firstName]').val(),
			this.$el.find('input[name=lastName]').val(), this.$el.find('input[name=email]').val(), this.$el.find('select[name=status]').val(), 'pass1234');
			if(result==true){
				window.location="profiles.html";
			}
		}

	},//end of CreateProfilePage-------------------




};//end of App-------------------------------------



$(document).ready(function(){
	App.init();
	App.ShowProfiles.Get();
	App.ShowProfiles.Render();
});


