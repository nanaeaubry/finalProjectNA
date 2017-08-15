$(function() {
  $("#location_input").keypress(function(e) {
    if (e.which == 13) {
      console.log($(this).val());
    }
  });
});
