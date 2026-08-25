# Deuda técnica

Único hogar de la deuda técnica. Se añade al descubrirla, en el mismo commit. Las entradas resueltas **se borran**.

- **El colapso del nav no está verificado visualmente.** La geometría, los breakpoints y los targets táctiles se midieron en el DOM, pero el pane del navegador estaba oculto (`document.visibilityState === "hidden"`), y con el documento oculto los `IntersectionObserver` no disparan y los screenshots salen en blanco. Falta abrir el sitio en un navegador visible y confirmar: (1) la fila 2 colapsa al pasar el hero, (2) no reaparece al subir a media página, (3) reaparece al volver al hero. (Origen: construcción inicial, ago 2026.)

- **El H1 del hero no pasa contraste en desktop y tablet.** Medido muestreando los píxeles reales de la foto bajo el texto: **1.49:1 a 1440**, ink sobre el follaje oscuro de la foto de recepción, cuando el mínimo para texto grande es 3:1. El `text-shadow` de 40px ayuda a la vista pero no cuenta para WCAG. Es el texto más importante de la página. **Mobile ya está resuelto**: el H1 salió de la foto y va encima, sobre papel, a 18.56:1. Falta decidir la composición de desktop — la opción coherente es la misma que en mobile, o reposicionar el H1 sobre las calles del collage en vez de sobre las imágenes. (Origen: pase de diseño del break editorial, ago 2026.)

- **Cobertura automatizada parcial.** El formulario de inquiry ya tiene validación centralizada y un handler inyectable, pero todavía falta incorporar una suite de integración para sus respuestas HTTP y persistencia en una rama efímera de Neon.

- **Los links "Luxury Picnics" y "Blog" no llevan a ninguna parte real.** El primero apunta al ancla `#expertise` y el segundo a `#`. Se resuelve cuando existan las páginas internas — ver `docs/BACKLOG.md`.
