
maptilersdk.config.apiKey = maptilerApiKey;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.BRIGHT,
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 20 })
      .setHTML(
        `<h4>${campground.title}</h4><p>${campground.location}</p>`
      )
  )
  .addTo(map)