'use strict';

App.View.MapSearch = Backbone.View.extend({
  _template: _.template( $('#map-search_template').html()),
  _template_list: _.template( $('#map-search_template_list').html()),

  initialize: function(options) {
    
    _.bindAll(this,'_updateTerm');

    this._map = options.map;
    this._collection = options.collection;
    this.listenTo(this._collection,"reset",this._collectionReset);

    var icon = L.icon({
        iconUrl: '/img/SC_marcador_busqueda.svg',
        iconSize:     [50, 50],
        iconAnchor:   [25, 50] 
    });

    this._markerS = L.marker([0,0],{'clickable':false, 'opacity':0, zIndexOffset:'999', 'icon': icon}).addTo(this._map);
    this.render();
  },

  events: {
    'keyup input[type=text]': '_updateTerm',
    'click li': '_selectTerm',
    'click img': '_clearSearch'
  },

  onClose: function(){
      this.stopListening();
  },

  render: function(){
    this.$el.html(this._template());
    return this;
  },

  toggleView:function(){
    this.$('#search_map').toggleClass('hide');
  },

  _updateTerm: _.debounce(function(e) {
    this._collection.options.term = $(e.currentTarget).val();
    this._collection.fetch({'reset':true});
    if(this._collection.options.term.length > 0){
      this.$('#search_map').addClass('searching');
      this.$('.loading').remove();
      this.$('#search_map').append(App.circleLoading());
    }else{
      this.$('img').trigger('click');
    }
  }, 500),

  _collectionReset:function(){
    this.$('.loading').remove();
    this.$('ul').html(this._template_list({'elements':this._collection.toJSON()}));
    if(this._collection.toJSON().length > 0)
      this.$('ul').addClass('active');
    else
      this.$('ul').removeClass('active');
  },

  _selectTerm:function(e){
    this.$('#search_map').addClass('searching');
    this.$('input[type=text]').val($(e.currentTarget).text());
    this.$('ul').removeClass('active');
    var elem = this._collection.findWhere({'element_id':$(e.currentTarget).attr('element_id')});
    var bbox = elem.get('bbox');
    var maxZoom = 18;
    if(elem.get('type') == 'device'){
      maxZoom = 20;
      this._markerS.setLatLng([bbox[1],bbox[0]])
    }else{
      this._markerS.setLatLng([(bbox[3]+bbox[1])/2,(bbox[2]+bbox[0])/2])
    }
    this._markerS.setOpacity(1);
    this._map.fitBounds([[bbox[1],bbox[0]],[bbox[3],bbox[2]]],{'maxZoom':maxZoom});
  },

  _clearSearch:function(){
    this.$('ul').removeClass('active');
    this.$('.loading').remove();
    this.$('input[type=text]').val('');
    this.$('#search_map').removeClass('searching');
    this._markerS.setOpacity(0);
  }

});