class Commutes {
  constructor(config) {
    this.config = config;
    this.map;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.destinationCoords = null;
    this.init();
  }

  init() {
    // Iniciar el mapa
    const mapOptions = this.config.mapOptions;
    this.map = new google.maps.Map(document.querySelector('.map-view'), mapOptions);
    this.directionsRenderer.setMap(this.map);

    // Solicitar ubicación del dispositivo
    this.getCurrentLocation();

    // Obtener las coordenadas del destino desde la URL
    const destination = this.getDestinationFromUrl();
    if (destination) {
      this.destinationCoords = destination;
      console.log('Destino obtenido desde la URL:', this.destinationCoords);
    }

    // Configurar el botón de navegación
    document.querySelector('.add-destination-button').addEventListener('click', () => {
      if (this.destinationCoords) {
        this.navigateToDestination(this.destinationCoords);
      }
    });
  }

  // Obtener la ubicación actual del dispositivo mediante GPS
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(currentLocation);
        console.log('Ubicación actual:', currentLocation);
      }, (error) => {
        console.error('Error obteniendo la ubicación:', error);
        alert('Por favor, habilita el GPS para obtener tu ubicación actual.');
      });
    } else {
      console.error('El navegador no soporta la geolocalización.');
    }
  }

  // Leer las coordenadas de latitud y longitud desde la URL
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

  // Navegar hacia el destino utilizando Google Maps y el modo de conducción
  navigateToDestination(destinationCoords) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const request = {
          origin: currentLocation,
          destination: destinationCoords,
          travelMode: google.maps.TravelMode.DRIVING  // Modo conducción
        };
        this.directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsRenderer.setDirections(result);
          } else {
            console.error('Error calculando la ruta:', status);
          }
        });
      });
    }
  }
}
