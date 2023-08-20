let map, infoWindow, service;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 12,
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  const locationButton = document.createElement("button");

  locationButton.textContent = "Go to Your Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    getTopRestaurants();
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function addToFavorites(restaurantName) {
  const favoriteRestaurants = JSON.parse(localStorage.getItem('favoriteRestaurants')) || [];
  favoriteRestaurants.push(restaurantName);
  localStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
  alert('Restaurant added to favorites!');
  window.location.href = 'favorites.html';
}

function getTopRestaurants() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(currentLocation);
        infoWindow.setContent("Your current location");
        infoWindow.open(map);
        map.setCenter(currentLocation);

        const request = {
          location: currentLocation,
          radius: '5000',
          type: 'restaurant',
          rankBy: google.maps.places.RankBy.PROMINENCE
        };

        service.nearbySearch(request, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const restaurantList = document.getElementById('restaurant-list');
            restaurantList.innerHTML = '';

            for (let i = 0; i < Math.min(results.length, 10); i++) {
              const restaurant = results[i];
              const listItem = document.createElement('li');
              const name = document.createElement('span');
              const address = document.createElement('span');
              const rating = document.createElement('span');
              const addButton = document.createElement('button');

              name.textContent = restaurant.name;
              address.textContent = restaurant.vicinity;
              rating.textContent = `Rating: ${restaurant.rating || 'N/A'}`;
              addButton.textContent = 'Add to Favorites';
              addButton.addEventListener('click', () => {
                addToFavorites(restaurant.name);
              });

              listItem.appendChild(name);
              listItem.appendChild(document.createElement('br'));
              listItem.appendChild(address);
              listItem.appendChild(document.createElement('br'));
              listItem.appendChild(rating);
              listItem.appendChild(document.createElement('br'));
              listItem.appendChild(addButton);

              restaurantList.appendChild(listItem);
            }
          }
        });
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

window.initMap = initMap;

initMap();