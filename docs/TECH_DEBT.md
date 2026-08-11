# Deuda técnica

Único hogar de la deuda técnica. Se añade al descubrirla, en el mismo commit. Las entradas resueltas **se borran**.

- **El colapso del nav no está verificado visualmente.** La geometría, los breakpoints y los targets táctiles se midieron en el DOM, pero el pane del navegador estaba oculto (`document.visibilityState === "hidden"`), y con el documento oculto los `IntersectionObserver` no disparan y los screenshots salen en blanco. Falta abrir el sitio en un navegador visible y confirmar: (1) la fila 2 colapsa al pasar el hero, (2) no reaparece al subir a media página, (3) reaparece al volver al hero. (Origen: construcción inicial, ago 2026.)

- **No hay tests.** El sitio es estático y sin endpoints, así que no hay lógica que testear más allá del colapso del nav — que es un `IntersectionObserver` de tres líneas. Cuando entre el formulario de inquiry, entra también su test de endpoint (molde: `theclementine/app/api/inquiry/route.test.ts`).

- **Los links "Luxury Picnics" y "Blog" no llevan a ninguna parte real.** El primero apunta al ancla `#expertise` y el segundo a `#`. Se resuelve cuando existan las páginas internas — ver `docs/BACKLOG.md`.
