document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        document.getElementById('ubicacion-detalle').innerText = 'Geolocalización no soportada';
    }
});

function success(position) {
    const { latitude, longitude } = position.coords;
    document.getElementById('ubicacion-detalle').innerText = `Latitud: ${latitude}, Longitud: ${longitude}`;

    // Obtener clima
    fetchClima(latitude, longitude);

    // Obtener puntos de reciclaje
    fetchPuntosReciclaje(latitude, longitude);
}

function error() {
    document.getElementById('ubicacion-detalle').innerText = 'No se pudo obtener la ubicación';
}

function fetchClima(lat, lon) {
    const apiKey = 'TU_API_KEY'; // Reemplaza con tu clave de API de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const climaDetalle = document.getElementById('clima-detalle');
            climaDetalle.innerText = `Temperatura: ${data.main.temp}°C, Clima: ${data.weather[0].description}`;
        })
        .catch(error => {
            document.getElementById('clima-detalle').innerText = 'No se pudo obtener el clima';
        });
}

function fetchPuntosReciclaje(lat, lon) {
    const url = `https://api.tutiempo.net/json/?lan=es&apid=zwDX4azaz4X4Xqs&ll=${lat},${lon}`; // Ejemplo de API de puntos de reciclaje

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lugaresLista = document.getElementById('lugares-lista');
            data.locality.recycling_points.forEach(punto => {
                const li = document.createElement('li');
                li.innerText = `${punto.name} - ${punto.address}`;
                lugaresLista.appendChild(li);
            });
        })
        .catch(error => {
            document.getElementById('lugares-lista').innerText = 'No se pudieron obtener los puntos de reciclaje';
        });
}