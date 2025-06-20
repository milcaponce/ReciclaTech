
document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      mostrarMensaje('ubicacion-detalle', 'Geolocalización no soportada');
    }
  
    inicializarBuscadorMateriales();
  });
  
  // ========== 2. Función éxito geolocalización ==========
  function success(position) {
    const { latitude, longitude } = position.coords;
  
    mostrarMensaje('ubicacion-detalle', `Latitud: ${latitude}, Longitud: ${longitude}`);
  
    fetchClima(latitude, longitude);
    fetchPuntosReciclaje(latitude, longitude);
  }
  
  // ========== 3. Función error geolocalización ==========
  function error() {
    mostrarMensaje('ubicacion-detalle', 'No se pudo obtener la ubicación');
  }
  
  // ========== 4. Obtener clima desde OpenWeather ==========
  function fetchClima(lat, lon) {
    const apiKey = 'b4bb3b920b63c9358453597ec721106e'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const texto = `Temperatura: ${data.main.temp}°C, Clima: ${data.weather[0].description}`;
        mostrarMensaje('clima-detalle', texto);
      })
      .catch(() => {
        mostrarMensaje('clima-detalle', 'No se pudo obtener el clima');
      });
  }
  
  // ========== 5. Obtener puntos de reciclaje ==========
  function fetchPuntosReciclaje(lat, lon) {
    const url = `https://api.tutiempo.net/json/?lan=es&apid=zwDX4azaz4X4Xqs&ll=${lat},${lon}`; // Ejemplo de API
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const lista = document.getElementById('lugares-lista');
        lista.innerHTML = ''; // Limpiar antes
  
        data.locality.recycling_points.forEach(punto => {
          const li = document.createElement('li');
          li.innerText = `${punto.name} - ${punto.address}`;
          lista.appendChild(li);
        });
      })
      .catch(() => {
        mostrarMensaje('lugares-lista', 'No se pudieron obtener los puntos de reciclaje');
      });
  }
  
  // ========== 6. Buscador de materiales ==========
  function inicializarBuscadorMateriales() {
    const buscador = document.getElementById('buscador-material');
    const resultado = document.getElementById('resultado-material');
  
    fetch('materiales.json')
      .then(res => res.json())
      .then(data => {
        const materiales = data;
  
        buscador.addEventListener('input', () => {
          const texto = buscador.value.toLowerCase();
  
          const materialEncontrado = materiales.find(m =>
            m.nombre.toLowerCase().includes(texto)
          );
  
          if (materialEncontrado) {
            resultado.innerHTML = `
              <h3>${materialEncontrado.nombre.toUpperCase()}</h3>
              <p><strong>Contenedor:</strong> ${materialEncontrado.contenedor}</p>
              <p><strong>Consejos:</strong> ${materialEncontrado.consejos}</p>
              <p><strong>Cuidados:</strong> ${materialEncontrado.cuidados}</p>
            `;
          } else {
            resultado.innerHTML = texto ? `<p>No se encontró ese material.</p>` : '';
          }
        });
      })
      .catch(error => {
        resultado.innerHTML = '<p>Error al cargar los materiales.</p>';
        console.error('Error al cargar materiales.json:', error);
      });
  }
  
  // ========== 7. Función utilitaria para mostrar mensajes ==========
  function mostrarMensaje(id, texto) {
    const el = document.getElementById(id);
    if (el) el.innerText = texto;
  }
  