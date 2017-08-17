$(function() {
  $("#location_input").keypress(function(e) {
    if (e.which == 13) {
      // Implement a search to happen on map
      $(this).val('');
    }
  });
});

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "dojo/domReady!"
], function(
  Map, MapView, Locate, Search
) {
  var map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-56.049, 38.485, 78],
    zoom: 3

  });

  var locateBtn = new Locate({
    view: view
  });

  // Add the locate widget to the top left corner of the view
  view.ui.add(locateBtn, {
    position: "top-left"
  });

  var search = new Search({
    view: view,
    sources: $("#location_input").val()
  });

});
