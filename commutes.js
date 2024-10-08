class Commutes {
  constructor(config) {
    this.config = config;
    this.map = null;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.destinationCoords = null;
    this.currentLocation = null;
    this.init();
  }

  init() {
    // Inicializar el mapa
    const mapOptions = this.config.mapOptions;
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.directionsRenderer.setMap(this.map);

    // Obtener ubicación actual
    this.getCurrentLocation();

    // Obtener las coordenadas de destino desde la URL
    const destination = this.getDestinationFromUrl();
    if (destination) {
      this.destinationCoords = destination;
    }

    // Configurar el botón de navegación
    document.querySelector('.navigate-btn').addEventListener('click', () => {
      if (this.destinationCoords) {
        this.navigateToDestination(this.destinationCoords);
      } else {
        console.error('No se ha definido el destino.');
      }
    });
  }

  // Obtener la ubicación actual
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(currentLocation);

        // Agregar marcador en la ubicación actual
        new google.maps.Marker({
          position: currentLocation,
          map: this.map,
          title: 'Estás aquí'
        });

        this.currentLocation = currentLocation;
      }, (error) => {
        console.error('Error obteniendo la ubicación:', error);
        alert('Por favor, habilita el GPS para obtener tu ubicación actual.');
      });
    } else {
      console.error('El navegador no soporta la geolocalización.');
    }
  }

  // Obtener las coordenadas desde la URL
  getDestinationFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat'));
    const lng = parseFloat(urlParams.get('long'));

    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    } else {
      console.error('No se proporcionaron coordenadas válidas en la URL.');
      alert('Por favor, proporciona coordenadas válidas en la URL.');
      return null;
    }
  }

  // Navegar hacia el destino
  navigateToDestination(destinationCoords) {
    if (this.currentLocation) {
      const request = {
        origin: this.currentLocation,
        destination: destinationCoords,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          console.error('Error calculando la ruta:', status);
        }
      });
    } else {
      console.error('Ubicación actual no disponible.');
      alert('No se pudo obtener tu ubicación actual.');
    }
  }
}

// Función global para inicializar el mapa
function initMap() {
  const CONFIGURATION = {
    mapOptions: {
      center: { lat: -11.776616, lng: -75.5000544 }, // Coordenadas iniciales
      zoom: 14
    }
  };
  new Commutes(CONFIGURATION);
}
