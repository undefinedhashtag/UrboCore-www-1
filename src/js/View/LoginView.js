'use strict';

App.View.Login = Backbone.View.extend({
  _template: _.template( $('#login_template').html() ),
  className: 'login',
  initialize: function(options) {
    this._headerView = options.headerView;
  },

  events: {
    'click input[type="submit"]': 'login'
  },

  onClose: function(){
    this.stopListening();
  },

  login: function(e){
    e.preventDefault();
    var _this = this;

    // Loading
    this.$el.append(App.widgetLoading());

    var email = this.$email.val().trim();
    var password = this.$password.val().trim();

    if (!email || !password)
      this.$el.addClass('error');

    App.auth.login(email,md5(password),function(err){
      if (err) {
        _this.$el.addClass('error');
        _this.$('.loading').remove();
      } else {
        App.mv().start(function(){
          App.router.navigate('',{trigger: true});
          _this._headerView.render();
        })
      }
    });
  },

  render: function(){

    var logo;
    
    switch(App.config.layout){
      case 'fiware':
        logo = 'fiwaremaps_logo-negativo.svg';
        break;
      case 'fiware_zone_andalucia':
        logo = 'fiware_zone_logo_negativo.png';
        break;
      case 'cedus':
        logo = 'cedus_logo_login@2x.png';
        break;
      default:
        logo = 'telefonica-logo_negativo.svg';
    }

    this.$el.html(this._template({ logo: logo}));
    this.$email = this.$('input[name="email"]');
    this.$password = this.$('input[name="password"]');

    return this;
  }

});