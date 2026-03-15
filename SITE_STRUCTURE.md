Estructura propuesta del sitio — Xlerion

Objetivo: reorganizar el orden del contenido (sin cambiar diseño) para mejorar claridad, navegación y conversión.

1. Home (/#home)

- Hero claro con logo, slogan conciso.
- CTA principal: "Solicitar presupuesto" o "Ver toolkits".
- CTA secundaria: "Contacto" o "Descargar dossier".
- Elementos visuales modernos (escena 3D opcional) como fondo.
- Breve introducción a la empresa y valores.

1. Servicios (/servicios)

- Página índice con tarjetas visuales para cada servicio.
- Filtros por categoría: Modularidad, 3D, Branding, Soporte, Documentación técnica.
- Cada tarjeta enlaza a `/servicios/:slug`.

1. Servicio detalle (/servicios/:slug)

- Problema que resuelve.
- Solución ofrecida (qué incluye).
- Beneficios concretos y métricas (si aplica).
- CTA destacado: "Solicitar propuesta" / "Contactar".

1. Toolkit (/toolkit)

- Descripción del producto modular.
- Casos de uso y ejemplos.
- Demo / video.
- CTA: "Probar" / "Descargar".

1. Proyectos / Portafolio (/proyectos)

- Galería visual de proyectos.
- Estudios de caso con resultados y métricas.
- Enfoque en impacto y replicabilidad.

1. Documentación (/documentacion)

- Manuales, diagramas, guías técnicas.
- Descargas (PDF) y visualización online.

1. Blog / Bitácora (/blog)

- Artículos y actualizaciones para apoyar SEO y autoridad.

1. Identidad / Empresa (/empresa o /identidad)

- Misión, visión, valores.
- Equipo y datos legales.

1. Fundador / Historia (/fundador)

- Historia personal, contexto creativo y PR.

1. Contacto (/contacto)

- Formulario sencillo.
- Canales: email, WhatsApp, redes.
- CTA: "Solicitar presupuesto" / "Colaborar".

1. Legal / Privacidad (/legal/*)

- Políticas de privacidad, términos de uso, licencias.

1. Admin / Analytics (privado) (/admin/analiticas)

- Área protegida para gestión interna y analíticas.

Patrones y recomendaciones (resumen):

- CTAs consistentes y jerarquizados (usa `#00e9fa` para CTAs primarios).
- Plantillas por tipo (ServiceDetail, CaseStudy, DocPage, BlogPost).
- SEO y metadata por página.
- Lazy-load para librerías pesadas y optimización de imágenes (WebP, srcset).
- Breadcrumbs en páginas profundas (`/servicios/:slug`, `/proyectos/:slug`).

Siguiente paso sugerido:

- Implementar plantillas de `ServiceDetail`, `Toolkit` y `ProjectCase` como stubs y actualizar `SiteNav` (he actualizado la navegación).
