// ============ Sobre de apertura ============
const sobreIntro = document.getElementById('sobre-intro');
const btnAbrirSobre = document.getElementById('btn-abrir-sobre');

if (sobreIntro && btnAbrirSobre) {
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

  const abrirSobre = () => {
    if (sobreIntro.classList.contains('abriendo')) return;
    sobreIntro.classList.add('abriendo');

    setTimeout(() => {
      sobreIntro.classList.add('oculto');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }, 850);

    setTimeout(() => { sobreIntro.style.display = 'none'; }, 1600);
  };

  btnAbrirSobre.addEventListener('click', abrirSobre);

  // red de seguridad: si algo impide la interacción, no bloquear el sitio
  setTimeout(() => {
    if (!sobreIntro.classList.contains('abriendo')) {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }
  }, 15000);
}

// ============ Contador de días faltantes ============
const fechaBoda = new Date('December 12, 2026 00:00:00').getTime();

const timer = setInterval(() => {
  const ahora = new Date().getTime();
  const diferencia = fechaBoda - ahora;

  if (diferencia < 0) {
    clearInterval(timer);
    document.getElementById('cuenta-regresiva').innerHTML = "¡Hoy es el gran día!";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  document.getElementById('cuenta-regresiva').innerHTML =
    `Faltan: ${dias}d ${horas}h ${minutos}m ${segundos}s`;
}, 1000);

// ============ Control de Música ============
const musica = document.getElementById('musica');
const btnMusica = document.getElementById('btn-musica');

btnMusica.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    btnMusica.textContent = '⏸️ Pausar Música';
  } else {
    musica.pause();
    btnMusica.textContent = '🎵 Reproducir Música';
  }
});

// ============ Scroll reveal ============
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));

    // red de seguridad por si el observer no dispara en algún dispositivo
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 2500);
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
});

// ============ Formulario de confirmación de asistencia (RSVP) ============
// Sin backend propio: arma un mensaje de WhatsApp con los datos del
// formulario y lo abre listo para enviar al número de los novios.
const NUMERO_WHATSAPP_NOVIOS = '+59165145007'; // ej: 59170000000
// Opcional: URL de la hoja de Google (ver apps-script.gs) para registrar confirmaciones.
const URL_REGISTRO_SHEET = ''; // ej: 'https://script.google.com/macros/s/XXXX/exec'
// Enlace de fotos compartidas: si aún es el marcador, se oculta la sección.
const ENLACE_FOTOS = 'https://drive.google.com/drive/folders/1hDEVozDzYwax4H6aM6MYtEAJRt3FM_wd?usp=drive_link'; // pega aquí el enlace de Drive/Fotos
const linkFotos = document.getElementById('link-fotos');
const secFotos = document.getElementById('compartir-fotos');
if (linkFotos && secFotos) {
  if (ENLACE_FOTOS.startsWith('TU_')) secFotos.style.display = 'none';
  else linkFotos.href = ENLACE_FOTOS;
}

const formRsvp = document.getElementById('form-rsvp');
const rsvpEstado = document.getElementById('rsvp-estado');

if (formRsvp) {
  formRsvp.addEventListener('submit', (e) => {
    e.preventDefault();

    const personas = document.getElementById('rsvp-personas').value;
    const nombres = document.getElementById('rsvp-nombres').value.trim();
    const telefono = document.getElementById('rsvp-telefono').value.trim();
    const mensaje = document.getElementById('rsvp-mensaje').value.trim();

    if (!personas || !nombres || !telefono) {
      rsvpEstado.textContent = 'Por favor completa personas, nombres y teléfono.';
      rsvpEstado.style.color = '#c0392b';
      return;
    }

    const texto =
      `Confirmación de asistencia 💌\n` +
      `👥 Personas: ${personas}\n` +
      `📛 Nombres: ${nombres}\n` +
      `📞 Teléfono: ${telefono}` +
      (mensaje ? `\n💬 Mensaje: ${mensaje}` : '');

    if (URL_REGISTRO_SHEET) {
      fetch(URL_REGISTRO_SHEET, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({ personas, nombres, telefono, mensaje })
      }).catch(() => {});
    }

    if (NUMERO_WHATSAPP_NOVIOS.startsWith('TU_')) {
      rsvpEstado.textContent = 'Confirmación registrada. (Falta configurar el número de WhatsApp de los novios.)';
      rsvpEstado.style.color = '#c0392b';
      return;
    }

    const url = `https://wa.me/${NUMERO_WHATSAPP_NOVIOS}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');

    rsvpEstado.textContent = '¡Gracias! Se abrió WhatsApp con tu confirmación lista para enviar.';
    rsvpEstado.style.color = '#7b629b';
    formRsvp.reset();
  });
}
