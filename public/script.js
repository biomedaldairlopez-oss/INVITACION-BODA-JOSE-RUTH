
document.addEventListener('DOMContentLoaded', () => {
  // ============ Sobre de apertura ============
  const sobreIntro = document.getElementById('sobre-intro');
  const btnAbrirSobre = document.getElementById('btn-abrir-sobre');

  // ============ Configuración del scroll automático ============
  const VELOCIDAD_SCROLL = 35; // Píxeles por segundo
  const PAUSA_TRAS_INTERACCION = 1800; // Milisegundos

  let scrollActivo = false;
  let pausaHasta = 0;
  let ultimoTiempo = 0;
  let animacionId = null;

  function animarScroll(tiempo) {
    if (!scrollActivo) return;

    if (!ultimoTiempo) ultimoTiempo = tiempo;

    // Evita saltos grandes si el navegador se ralentiza.
    const delta = Math.min((tiempo - ultimoTiempo) / 1000, 0.05);
    ultimoTiempo = tiempo;

    if (tiempo >= pausaHasta) {
      const alturaDocumento = document.documentElement.scrollHeight;
      const posicionMaxima = alturaDocumento - window.innerHeight;

      if (window.scrollY >= posicionMaxima - 2) {
        window.scrollTo(0, posicionMaxima);
        scrollActivo = false;
        animacionId = null;
        return;
      }

      // Mantiene siempre la misma velocidad.
      window.scrollBy(0, VELOCIDAD_SCROLL * delta);
    }

    animacionId = requestAnimationFrame(animarScroll);
  }

  function iniciarScroll() {
    if (scrollActivo) return;

    scrollActivo = true;
    ultimoTiempo = 0;
    pausaHasta = 0;
    animacionId = requestAnimationFrame(animarScroll);
  }

  function pausarYReanudar() {
    if (!scrollActivo) return;

    // No cambia la velocidad: solamente espera a que termine la interacción.
    pausaHasta = performance.now() + PAUSA_TRAS_INTERACCION;
  }

  // Detectar desplazamiento manual con ratón y pantalla táctil.
  window.addEventListener('wheel', pausarYReanudar, { passive: true });
  window.addEventListener('touchstart', pausarYReanudar, { passive: true });
  window.addEventListener('touchmove', pausarYReanudar, { passive: true });

  // Detectar las teclas utilizadas para desplazarse.
  window.addEventListener('keydown', (evento) => {
    const teclasScroll = [
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' '
    ];

    if (teclasScroll.includes(evento.key)) {
      pausarYReanudar();
    }
  });

  // Si se cambia de pestaña, evita un salto al regresar.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && scrollActivo) {
      ultimoTiempo = 0;
    }
  });

  if (sobreIntro && btnAbrirSobre) {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    const abrirSobre = async () => {
      if (sobreIntro.classList.contains('abriendo')) return;

      sobreIntro.classList.add('abriendo');

      // Intenta iniciar la música tras el toque del invitado.
      if (musica) {
        try {
          await musica.play();
          if (btnMusica) {
            btnMusica.textContent = '⏸️ Pausar Música';
          }
        } catch (error) {
          // La música podrá iniciarse con su botón si el navegador la bloquea.
          console.log('Puedes iniciar la música con el botón de música.');
        }
      }

      setTimeout(() => {
        sobreIntro.classList.add('oculto');
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }, 850);

      setTimeout(() => {
        sobreIntro.style.display = 'none';

        // Comienza desde el principio de la invitación.
        window.scrollTo(0, 0);
        iniciarScroll();
      }, 1600);
    };

    btnAbrirSobre.addEventListener('click', abrirSobre);

    // Red de seguridad: no dejar bloqueada la página si no se abre el sobre.
    setTimeout(() => {
      if (!sobreIntro.classList.contains('abriendo')) {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }
    }, 15000);
  }

  // ============ Contador de días faltantes ============
  const fechaBoda = new Date('December 12, 2026 00:00:00').getTime();
  const elementoTimer = document.getElementById('cuenta-regresiva');

  if (elementoTimer) {
    const actualizarContador = () => {
      const ahora = Date.now();
      const diferencia = fechaBoda - ahora;

      if (diferencia <= 0) {
        elementoTimer.textContent = '¡Hoy es el gran día!';
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos = Math.floor(
        (diferencia % (1000 * 60 * 60)) / (1000 * 60)
      );
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      elementoTimer.textContent =
        `Faltan: ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    };

    actualizarContador();
    const timer = setInterval(() => {
      actualizarContador();

      if (Date.now() >= fechaBoda) {
        clearInterval(timer);
      }
    }, 1000);
  }

  // ============ Control de música ============
  const musica = document.getElementById('musica');
  const btnMusica = document.getElementById('btn-musica');

  if (btnMusica && musica) {
    btnMusica.addEventListener('click', async () => {
      if (musica.paused) {
        try {
          await musica.play();
          btnMusica.textContent = '⏸️ Pausar Música';
        } catch (error) {
          btnMusica.textContent = 'No se pudo reproducir la música';
        }
      } else {
        musica.pause();
        btnMusica.textContent = '🎵 Reproducir Música';
      }
    });
  }

  // ============ Scroll reveal ============
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

    // Respaldo para dispositivos donde el observador no active las animaciones.
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }, 2500);
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ============ Formulario de confirmación (RSVP) ============
  const NUMERO_WHATSAPP_NOVIOS = '59165145007';
  const URL_REGISTRO_SHEET = '';

  const ENLACE_FOTOS =
    'https://drive.google.com/drive/folders/1hDEVozDzYwax4H6aM6MYtEAJRt3FM_wd?usp=drive_link';

  const linkFotos = document.getElementById('link-fotos');
  const secFotos = document.getElementById('compartir-fotos');

  if (linkFotos && secFotos) {
    if (ENLACE_FOTOS.startsWith('TU_')) {
      secFotos.style.display = 'none';
    } else {
      linkFotos.href = ENLACE_FOTOS;
    }
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
        if (rsvpEstado) {
          rsvpEstado.textContent =
            'Por favor completa personas, nombres y teléfono.';
          rsvpEstado.style.color = '#c0392b';
        }
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
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ personas, nombres, telefono, mensaje })
        }).catch(() => {});
      }

      if (!NUMERO_WHATSAPP_NOVIOS || NUMERO_WHATSAPP_NOVIOS.startsWith('TU_')) {
        if (rsvpEstado) {
          rsvpEstado.textContent =
            'Falta configurar el número de WhatsApp de los novios.';
          rsvpEstado.style.color = '#c0392b';
        }
        return;
      }

      const url =
        `https://wa.me/${NUMERO_WHATSAPP_NOVIOS}?text=${encodeURIComponent(texto)}`;

      window.open(url, '_blank');

      if (rsvpEstado) {
        rsvpEstado.textContent =
          '¡Gracias! Se abrió WhatsApp con tu confirmación lista para enviar.';
        rsvpEstado.style.color = '#7b629b';
      }

      formRsvp.reset();
    });
  }
});
