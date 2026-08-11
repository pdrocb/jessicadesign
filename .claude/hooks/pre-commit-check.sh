#!/bin/bash
# Bloquea `git commit` si el proyecto tiene errores de TypeScript.
# Exit 2 → Claude Code cancela el comando y muestra stderr al agente.
#
# Todavía no hay `npm test`: el sitio es estático y sin endpoints. Cuando
# entre el formulario de inquiry, añadir aquí el gate de tests.

cd "$(git rev-parse --show-toplevel)" || exit 0

if ! npx tsc --noEmit >/tmp/jsevents-typecheck.log 2>&1; then
  {
    echo "Commit blocked: TypeScript errors found (npx tsc --noEmit)."
    head -20 /tmp/jsevents-typecheck.log
    echo "Fix them, then retry the commit. Never use --no-verify."
  } >&2
  exit 2
fi

exit 0
