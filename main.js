require([
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/Graphic",
  "esri/tasks/Locator",
  "esri/widgets/Locate",
  "esri/widgets/BasemapGallery",
  "esri/geometry/Point",
  "esri/symbols/SimpleMarkerSymbol",
  "dojo/domReady!"
], function(Map, MapView, SceneView, Graphic, Locator, Locate, BasemapGallery, Point, SimpleMarkerSymbol) {

  var source = $("#addresslist-template").html();
  var addressListTemplate = Handlebars.compile(source);
  Handlebars.registerPartial("address", $("#address-partial").html());

  var locator = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
  });

  var map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });

  // var view = new MapView({
  //   container: "map-container",
  //   map: map,
  //   center: [-56.049, 38.485, 78],
  //   zoom: 3
  // });
  var view = new SceneView({
    container: "map-container",
    map: map
  });

  var locateBtn = new Locate({
    view: view
  });
  view.ui.add(locateBtn, {
    position: "top-left"
  });

  var basemapGallery = new BasemapGallery({
    view: view
  });
  view.ui.add(basemapGallery, {
    position: "top-right"
  });

  // Create a symbol for drawing the point
  var markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40],
    outline: { // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 2
    }
  });

  // Capture the searched address
  var addresses;
  $("#location_input").keypress(function(e) {
    if (e.which == 13) {
      // Implement a search to happen on map
      var text = $(this).val();

      var promise = locator.addressToLocations({
        address: {
          singleLine: text
        },
        outFields: ["*"]
      });

      promise.then(function(result) {
        addresses = result.map(function(address, index) {
          return {
            index: index,
            shortLabel: address.attributes.ShortLabel,
            longLabel: address.attributes.LongLabel,
            location: address.location
          };
        });
        $("#address-list").html(addressListTemplate({
          addresses: addresses
        }));
      });
    }
  });

  // React to address click and show location on map
  $("#address-list").on("click", ".address", function() {
    view.graphics.removeAll();
    var index = parseInt($(this).attr('data-index'));
    var address = addresses[index];
    var point = new Point({
      longitude: address.location.longitude,
      latitude: address.location.latitude,
    });
    view.goTo({
      target: point,
      scale: 10000
    });

    // Create a graphic and add the geometry and symbol to it
    var pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });
    view.graphics.add(pointGraphic);
  });
});
