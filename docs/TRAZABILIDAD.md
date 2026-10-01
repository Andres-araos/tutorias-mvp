# Guía de trazabilidad (para la Auditoría)

Regla de oro: **un mismo código (APP-XX) debe aparecer en el tablero, el canal de chat, el documento en la nube, la rama, los commits y el Pull Request.**

## Ciclo por tarea (ejemplo APP-01)
1. **Sprint Planning:** mueve la tarjeta APP-01 a "En proceso" y asígnala.
2. **Rama:** `git checkout -b feature/APP-01-login`
3. **Daily:** publica en el canal un hilo titulado `APP-01` con avance, enlaces al documento y bloqueos.
4. **Commit:** `git commit -m "feat: pantalla de login. Cierra APP-01"`
5. **Pull Request:** `git push -u origin feature/APP-01-login`; abre el PR con la plantilla de `.github/`, y pide la revisión a otro integrante.
6. **Merge** a `main` tras aprobar; mueve la tarjeta a "Completado".

Hook opcional que rechaza commits sin código: ver `scripts/commit-msg`.

## Qué mostrar si el profesor elige una funcionalidad
| Evidencia | Dónde |
|---|---|
| Tarjeta inicial | Tablero Kanban (APP-XX) |
| Discusión | Hilo `APP-XX` en Slack/Teams/Discord |
| Diseño colaborativo | Documento en la carpeta de la nube (enlazado desde la tarjeta) |
| Commit / merge exacto | `git log --grep="APP-XX"` o el PR en GitHub |

## Importante
La evidencia debe ser real: tienen que crear las ramas, commits, hilos y tarjetas mientras trabajan. Esta carpeta les da el código y la estructura, pero el historial lo generan ustedes; un historial armado de golpe se nota en la auditoría.

## Retrospectiva (plantilla)
- Qué funcionó en nuestra comunicación:
- Qué barreras de tiempo/espacio superamos con las herramientas:
- Qué mejoraremos el próximo sprint:
