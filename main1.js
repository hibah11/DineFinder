document.addEventListener('DOMContentLoaded', () => {
  const favoritesList = document.getElementById('favorites-list');
  const favoriteRestaurants = JSON.parse(localStorage.getItem('favoriteRestaurants')) || [];

  for (const restaurant of favoriteRestaurants) {
    const listItem = document.createElement('li');
    listItem.textContent = restaurant;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeFromFavorites(restaurant);
    });

    const directionsButton = document.createElement('button');
    directionsButton.textContent = 'Get Directions';
    directionsButton.addEventListener('click', () => {
      getDirections(restaurant);
    });

    listItem.appendChild(deleteButton);
    listItem.appendChild(directionsButton);

    favoritesList.appendChild(listItem);
  }
});

function removeFromFavorites(restaurantName) {
  const favoriteRestaurants = JSON.parse(localStorage.getItem('favoriteRestaurants')) || [];
  const updatedFavorites = favoriteRestaurants.filter((restaurant) => restaurant !== restaurantName);
  localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
  alert('Restaurant removed from favorites!');
  window.location.reload();
}

function getDirections(restaurantName) {
  const userAddress = 'pos';
  const restaurantAddress = restaurantName;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    userAddress
  )}&destination=${encodeURIComponent(restaurantAddress)}`;

  window.open(googleMapsUrl, '_blank');
}