/* Esencia de Piel — interacciones del sitio */
document.addEventListener("DOMContentLoaded", () => {
  const CLAVE_RUTINA = "esenciaDePiel.productos";
  const CLAVE_PIEL = "esenciaDePiel.piel";
  const ORDEN_PASOS = ["limpiar", "tratar", "hidratar", "proteger"];
  const NOMBRE_PASO = { limpiar: "Limpiar", tratar: "Tratar", hidratar: "Hidratar", proteger: "Proteger" };

  /* ---------- Almacenamiento seguro ---------- */
  const leer = (clave, defecto) => {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : defecto; }
    catch { return defecto; }
  };
  const guardar = (clave, valor) => {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* sin almacenamiento */ }
  };
  let rutina = leer(CLAVE_RUTINA, []).filter((id) => PRODUCTOS[id]);

  /* ---------- Header que se reduce al hacer scroll ---------- */
  const navbar = document.querySelector(".rc-navbar");
  const revisarScroll = () => navbar.classList.toggle("reducida", window.scrollY > 40);
  revisarScroll();
  window.addEventListener("scroll", revisarScroll, { passive: true });

  /* ---------- Barra de progreso y botón "volver arriba" ---------- */
  const progreso = document.querySelector(".progreso");
  const volverArriba = document.querySelector(".volver-arriba");
  function actualizarProgreso() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const avance = total > 0 ? window.scrollY / total : 0;
    if (progreso) progreso.style.transform = `scaleX(${avance})`;
    if (volverArriba) volverArriba.classList.toggle("visible", window.scrollY > 500);
  }
  actualizarProgreso();
  window.addEventListener("scroll", actualizarProgreso, { passive: true });
  volverArriba?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Efecto de onda al hacer clic ---------- */
  document.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn, .opcion-piel, .filtro");
    if (!boton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = boton.getBoundingClientRect();
    const tam = Math.max(rect.width, rect.height);
    const onda = document.createElement("span");
    onda.className = "onda";
    onda.style.width = onda.style.height = `${tam}px`;
    onda.style.left = `${e.clientX - rect.left - tam / 2}px`;
    onda.style.top = `${e.clientY - rect.top - tam / 2}px`;
    boton.append(onda);
    onda.addEventListener("animationend", () => onda.remove());
  });

  /* ---------- Aparición de elementos ---------- */
  const revelables = document.querySelectorAll(".revelar");
  revelables.forEach((el) => {
    const fila = el.parentElement;
    if (fila && fila.classList.contains("row")) {
      const indice = [...fila.children].filter((h) => h.classList.contains("revelar")).indexOf(el);
      el.style.setProperty("--retraso", `${Math.min(indice, 4) * 0.12}s`);
    }
  });
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revelables.forEach((el) => obs.observe(el));
  } else {
    revelables.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Contador del menú ---------- */
  const contadores = document.querySelectorAll(".contador-rutina");
  function actualizarContador(animar = false) {
    contadores.forEach((c) => {
      c.textContent = rutina.length;
      c.setAttribute("aria-label", `${rutina.length} productos en tu rutina`);
      if (animar) { c.classList.remove("salto"); void c.offsetWidth; c.classList.add("salto"); }
    });
  }
  actualizarContador();

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toastRutina");
  function avisar(texto) {
    if (!toastEl || !window.bootstrap) return;
    document.getElementById("toastTexto").textContent = texto;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
  }

  /* ---------- Botones "Añadir a mi rutina" ---------- */
  const botonesAnadir = document.querySelectorAll(".btn-anadir");
  function pintarBotones() {
    botonesAnadir.forEach((b) => {
      const dentro = rutina.includes(b.dataset.id);
      b.classList.toggle("agregado", dentro);
      b.setAttribute("aria-pressed", dentro);
      b.querySelector("span").textContent = dentro ? "En tu rutina" : "Añadir a mi rutina";
      const icono = b.querySelector(".bi");
      icono.className = `bi ${dentro ? "bi-check-lg" : "bi-plus-lg"} me-1`;
    });
  }
  botonesAnadir.forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      const nombre = PRODUCTOS[id].nombre;
      if (rutina.includes(id)) {
        rutina = rutina.filter((x) => x !== id);
        avisar(`${nombre} se quitó de tu rutina`);
      } else {
        rutina.push(id);
        avisar(`${nombre} se añadió a tu rutina`);
      }
      guardar(CLAVE_RUTINA, rutina);
      pintarBotones();
      actualizarContador(true);
    });
  });
  pintarBotones();

  /* ---------- Sección 1 → 2: test de piel y filtro ---------- */
  const opciones = document.querySelectorAll(".opcion-piel");
  const productos = document.querySelectorAll("#rutina .producto");
  const aviso = document.querySelector(".aviso-filtro");
  const seccionRutina = document.getElementById("rutina");

  function filtrar(piel) {
    opciones.forEach((o) => o.setAttribute("aria-pressed", o.dataset.piel === piel));
    productos.forEach((p) => {
      const apto = !piel || p.dataset.pieles.split(" ").includes(piel);
      if (apto && p.classList.contains("oculto")) {
        p.classList.remove("oculto");
        p.classList.add("entrando");
        requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove("entrando")));
      } else if (!apto) {
        p.classList.add("oculto");
      }
    });
    if (aviso) {
      aviso.classList.toggle("visible", Boolean(piel));
      if (piel) document.getElementById("pielElegida").textContent = piel;
    }
  }

  opciones.forEach((o) => {
    o.addEventListener("click", () => {
      const piel = o.dataset.piel;
      guardar(CLAVE_PIEL, piel);
      filtrar(piel);
      seccionRutina.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.getElementById("verTodos")?.addEventListener("click", () => {
    guardar(CLAVE_PIEL, null);
    filtrar(null);
  });
  if (opciones.length) filtrar(leer(CLAVE_PIEL, null));

  /* ---------- Página Productos: buscador ---------- */
  const buscar = document.getElementById("buscar");
  if (buscar) {
    const tarjetas = document.querySelectorAll(".ingrediente");
    const contador = document.getElementById("contadorIngredientes");
    const vacio = document.getElementById("sinIngredientes");
    const normalizar = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    buscar.addEventListener("input", () => {
      const q = normalizar(buscar.value.trim());
      let visibles = 0;
      tarjetas.forEach((t) => {
        const coincide = normalizar(t.textContent).includes(q);
        t.classList.toggle("oculto", !coincide);
        if (coincide) visibles++;
      });
      contador.textContent = visibles === 1 ? "1 producto" : `${visibles} productos`;
      vacio.hidden = visibles > 0;
    });
  }

  /* ---------- Página Mi rutina ---------- */
  const listaManana = document.getElementById("listaManana");
  const listaNoche = document.getElementById("listaNoche");
  function pintarRutina() {
    if (!listaManana) return;
    const ordenados = [...rutina].sort((a, b) =>
      ORDEN_PASOS.indexOf(PRODUCTOS[a].paso) - ORDEN_PASOS.indexOf(PRODUCTOS[b].paso));
    const item = (id) => {
      const p = PRODUCTOS[id];
      return `<li>
        <img src="img/${id}.svg" alt="" width="52" height="52">
        <div><div class="nombre">${p.nombre}</div><div class="paso">${NOMBRE_PASO[p.paso]} (${p.ingrediente})</div></div>
        <button type="button" class="btn-quitar" data-id="${id}" aria-label="Quitar ${p.nombre}"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </li>`;
    };
    const manana = ordenados.filter((id) => PRODUCTOS[id].horario !== "noche");
    const noche = ordenados.filter((id) => PRODUCTOS[id].horario !== "dia");
    const vacio = (momento) => `<li class="vacio d-block">Aún no tienes productos para la ${momento}. <a href="index.html#test">Haz el test de piel</a> para empezar.</li>`;
    listaManana.innerHTML = manana.length ? manana.map(item).join("") : vacio("mañana");
    listaNoche.innerHTML = noche.length ? noche.map(item).join("") : vacio("noche");

    const piel = leer(CLAVE_PIEL, null);
    const resumen = document.getElementById("resumenPiel");
    if (piel) resumen.textContent = `Rutina para piel ${piel}, ordenada según el orden correcto de aplicación.`;
  }
  pintarRutina();

  document.addEventListener("click", (e) => {
    const quitar = e.target.closest(".btn-quitar");
    if (!quitar) return;
    const nombre = PRODUCTOS[quitar.dataset.id].nombre;
    rutina = rutina.filter((x) => x !== quitar.dataset.id);
    guardar(CLAVE_RUTINA, rutina);
    pintarRutina();
    actualizarContador(true);
    avisar(`${nombre} se quitó de tu rutina`);
  });

  document.getElementById("vaciarRutina")?.addEventListener("click", () => {
    if (!rutina.length) return;
    rutina = [];
    guardar(CLAVE_RUTINA, rutina);
    pintarRutina();
    actualizarContador(true);
    avisar("Tu rutina quedó vacía");
  });

  /* ---------- Formulario de comentarios ---------- */
  const CLAVE_COMENTARIOS = "esenciaDePiel.comentarios";
  const form = document.getElementById("formComentario");
  const lista = document.getElementById("listaComentarios");

  // Crea la tarjeta de un comentario (con textContent para evitar código malicioso)
  function crearComentario(c, nuevo = false) {
    const art = document.createElement("article");
    art.className = "comentario" + (nuevo ? " nuevo" : "");
    const fila = document.createElement("div");
    fila.className = "d-flex justify-content-between align-items-center gap-2";
    const nombre = document.createElement("strong");
    nombre.textContent = c.nombre;
    fila.append(nombre);
    if (c.estrellas) {
      const est = document.createElement("span");
      est.className = "estrellas-fijas";
      est.textContent = "★".repeat(c.estrellas) + "☆".repeat(5 - c.estrellas);
      est.setAttribute("aria-label", `${c.estrellas} de 5 estrellas`);
      fila.append(est);
    }
    const piel = document.createElement("p");
    piel.className = "small texto-secundario mb-1";
    piel.textContent = `Piel ${c.piel}`;
    const texto = document.createElement("p");
    texto.className = "mb-0";
    texto.textContent = c.texto;
    art.append(fila, piel, texto);
    return art;
  }

  if (lista) {
    leer(CLAVE_COMENTARIOS, []).forEach((c) => lista.prepend(crearComentario(c)));
  }

  if (form) {
    // Preseleccionar el tipo de piel elegido en el test
    const piel = leer(CLAVE_PIEL, null);
    const selectPiel = document.getElementById("tipoPiel");
    if (piel && selectPiel) selectPiel.value = piel;

    // Contador de caracteres
    const areaComentario = document.getElementById("comentario");
    const contadorCaracteres = document.getElementById("contadorCaracteres");
    areaComentario.addEventListener("input", () => {
      contadorCaracteres.textContent = `${areaComentario.value.length}/400`;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.querySelector(":invalid")?.focus();
        return;
      }
      const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        piel: selectPiel.value,
        estrellas: Number(form.querySelector('input[name="estrellas"]:checked')?.value || 0),
        texto: areaComentario.value.trim(),
      };

      // Publicar el comentario en la lista y guardarlo
      if (document.getElementById("publicar").checked) {
        const guardados = leer(CLAVE_COMENTARIOS, []);
        guardados.push(datos);
        guardar(CLAVE_COMENTARIOS, guardados);
        lista.prepend(crearComentario(datos, true));
      }

      document.getElementById("nombreConfirmacion").textContent = datos.nombre;
      document.getElementById("correoConfirmacion").textContent = document.getElementById("correo").value.trim();
      form.hidden = true;
      const ok = document.querySelector(".confirmacion");
      ok.classList.add("visible");
      ok.focus();
    });

    // Volver a mostrar el formulario vacío
    document.getElementById("otroComentario").addEventListener("click", () => {
      form.reset();
      form.classList.remove("was-validated");
      if (piel) selectPiel.value = piel;
      contadorCaracteres.textContent = "0/400";
      document.querySelector(".confirmacion").classList.remove("visible");
      form.hidden = false;
      document.getElementById("nombre").focus();
    });
  }

  /* ---------- Año del footer ---------- */
  document.querySelectorAll(".anio").forEach((el) => (el.textContent = new Date().getFullYear()));
});
