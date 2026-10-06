# Esencia de Piel ✨

Sitio web que ayuda a armar una rutina de cuidado facial sencilla según el tipo de piel. Desarrollado con **Bootstrap 5**.

## Integrantes
- Amaris Yoselin Lara Paulino
- Zuri Yvette Rosales Marquez

## Contexto
Hoy existe una enorme cantidad de productos para el cuidado de la piel y mucha información contradictoria en redes sociales. Las personas que quieren empezar una rutina no saben qué tipo de piel tienen, qué productos necesitan ni en qué orden aplicarlos.

## Problemática o necesidad identificada
Al no conocer su tipo de piel, muchas personas compran productos que no les funcionan o que incluso les irritan, y abandonan la rutina por resultar confusa o costosa.

## Objetivo del sitio web
Guiar a las personas para identificar su tipo de piel y construir una rutina básica de tres pasos (limpiar, hidratar y proteger), con productos sugeridos y explicaciones claras de cada ingrediente.

## Usuarios a quienes está dirigido
- Jóvenes y adultos que quieren comenzar una rutina de cuidado facial.
- Personas con dudas sobre qué productos son adecuados para su tipo de piel.
- Personas con necesidades específicas: brillos, manchas, textura o piel irritada.

## Tipo de información o servicios
- Test rápido para identificar el tipo de piel (seca, grasa, mixta o sensible).
- Rutina básica filtrada automáticamente según la piel elegida.
- Tratamientos para necesidades específicas.
- Catálogo de productos con buscador y guía de combinaciones.
- Rutina personal guardada en el navegador, separada en mañana y noche.
- Formulario de comentarios con correo electrónico, calificación con estrellas y publicación de opiniones.

> La información del sitio es educativa y no sustituye la consulta con un dermatólogo.

## Framework seleccionado y justificación
Elegimos **Bootstrap 5.3** porque:
1. Su sistema de rejilla permitió construir la cuadrícula de 3 columnas (Limpiar, Hidratar, Proteger) y adaptarla a tablet y teléfono con pocas clases.
2. Ofrece componentes accesibles que usamos directamente: barra de navegación colapsable, *collapse* (“Saber más”), acordeón, y *toast*.
3. Se personaliza con variables CSS, lo que nos permitió crear una identidad visual propia.
4. Cuenta con su propia biblioteca de iconos, **Bootstrap Icons**.

## Personalización realizada
- Paleta propia: frambuesa `#A12A68` como color principal, degradados hacia `#C2396F` y lila `#8A2BB0`, texto en `#2A1F2D` y fondos rosados suaves (`#FBF3F8`). Cada tipo de piel tiene su propio color: durazno (seca), turquesa (grasa), violeta (mixta) y rosa (sensible). Todo el texto cumple el contraste AA.
- Tipografías: **Bricolage Grotesque** para títulos y **Nunito Sans** para el texto.
- Etiquetas de horario en la esquina de cada tarjeta: ☀️ Día, 🌙 Noche o ☀️/🌙 Día y Noche.
- Menú con subrayado animado y contador de productos en la rutina.
- Ilustraciones propias de skincare en SVG (carpeta `img/ilustraciones/`): composición de productos en la portada, rostros para cada tipo de piel, iconos ilustrados para cada paso, persona con mascarilla, repisa de productos y sol y luna para las rutinas de día y de noche. Algunas tienen animaciones suaves (gotas que flotan y destellos).
- Etiquetas de sección, ola decorativa entre secciones, manchas de color de fondo y una banda de consejo de cuidado.

## Interactividad y animaciones
- **Tarjetas del test:** cada una tiene su degradado, entrada escalonada al cargar, burbujas que flotan, destello que cruza la tarjeta, brillo de color al pasar el mouse y marca de verificación al seleccionarla.
- **Botón “Hacer el test”** con pulso animado y flecha que rebota.
- **Títulos con palabra resaltada** que se “pinta” al cargar la página.
- **Barra de progreso** de colores en la parte superior al hacer scroll.
- **Botón para volver arriba** que aparece al bajar.
- **Efecto de onda** al hacer clic en los botones.
- **Manchas de color** que flotan suavemente en el fondo.
- **Test de piel:** al elegir un tipo de piel, la página se desplaza suavemente a la Sección 2 y filtra los productos aptos. La elección se recuerda al volver al sitio.
- **Añadir a mi rutina:** guarda el producto (localStorage), actualiza el contador del menú y muestra una notificación.
- **Saber más:** despliega la información del ingrediente principal.
- **Hover** en tarjetas (elevación, rotación de la imagen, cambio de forma del icono) y botones (desplazamiento y color).
- **Transiciones** de color, tamaño y subrayado en el menú y los enlaces.
- **Cambio de tamaño** del header al hacer scroll.
- **Aparición de elementos** al entrar en pantalla y entrada escalonada de las opciones del test.
- Se respeta la preferencia del sistema “reducir movimiento”.

## Páginas desarrolladas
| Página | Descripción |
|---|---|
| `index.html` (Inicio) | **Descubre tu tipo de piel:** test de 4 tipos de piel con ilustraciones de rostros. **Tu ritual esencial de cuidado:** cuadrícula de 3 columnas (Limpiar, Hidratar, Proteger) con productos filtrables. **Menos es más:** banda con un consejo de cuidado. **Soluciones para cada necesidad:** tarjetas para brillos, manchas, textura y calma. |
| `productos.html` (Productos) | **Nuestros productos:** catálogo de los 13 productos de la guía con su ingrediente principal, tipo de piel ideal y horario de uso. Incluye buscador en tiempo real, botón para añadir a la rutina y acordeón **Combinaciones que funcionan**. |
| `mi-rutina.html` (Mi rutina) | **Mi ritual de cuidado:** productos guardados, ordenados en el orden correcto de aplicación y separados en mañana y noche, con opción de quitarlos o vaciar la rutina. Al final está la sección **Cuéntanos tu experiencia**, con un formulario para enviar comentarios (nombre, correo, tipo de piel, tema, calificación con estrellas y comentario) y la lista de comentarios de la comunidad. |

## Estructura de carpetas
```
esencia-de-piel/
├── index.html
├── productos.html
├── mi-rutina.html
├── css/
│   └── styles.css
├── js/
│   ├── datos.js     (catálogo de productos)
│   └── main.js      (interacciones)
├── img/             (imágenes de productos y favicon)
│   └── ilustraciones/ (ilustraciones de skincare)
└── README.md
```

## Sobre el formulario de comentarios
El formulario valida los datos con Bootstrap y JavaScript (campos obligatorios, formato de correo y longitud mínima), muestra una confirmación y publica el comentario en la lista guardándolo en el navegador. No envía correos reales porque el sitio no tiene servidor; para hacerlo se podría conectar un servicio como Formspree.

## Adaptación a diferentes pantallas
Se probó en 8 anchos de pantalla (360, 390, 414, 768, 820, 1024, 1366 y 1920 px) sin desplazamiento horizontal. En celular las tarjetas del test se muestran de 2 en 2, el menú se convierte en botón de hamburguesa y los botones ocupan todo el ancho; en tablet las columnas se reacomodan y en computadora se muestran 4 tarjetas por fila y las 3 columnas de la rutina.

Para mostrarlo en la presentación: en Chrome presiona **F12** y luego **Ctrl + Shift + M** para activar la vista de dispositivos y elegir un celular o una tablet.

## Cómo ejecutarlo
Abre `index.html` en un navegador moderno (se necesita internet para cargar Bootstrap, los iconos y las fuentes).

Para publicarlo con **GitHub Pages**: *Settings → Pages → Branch: main → Save*.
