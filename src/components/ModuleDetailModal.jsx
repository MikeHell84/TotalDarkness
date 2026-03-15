import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Download, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// mermaid will be imported dynamically when needed to reduce initial bundle size
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

// Componente auxiliar para renderizar contenido con diagramas Mermaid
function RenderMermaidDocument({ content }) {
    const [renderedContent, setRenderedContent] = useState([]);

    useEffect(() => {
        const processContent = async () => {
            const parts = [];
            const lines = content.split('\n');
            let i = 0;
            let inMermaidBlock = false;
            let mermaidCode = '';
            let textBuffer = '';

            while (i < lines.length) {
                const line = lines[i];

                if (line.trim() === '```mermaid') {
                    // Guardar texto acumulado
                    if (textBuffer) {
                        parts.push({ type: 'text', content: textBuffer });
                        textBuffer = '';
                    }
                    inMermaidBlock = true;
                    mermaidCode = '';
                    i++;
                    continue;
                }

                if (inMermaidBlock && line.trim() === '```') {
                    // Renderizar diagrama Mermaid
                    try {
                        const { svg } = await mermaid.render(`mermaid-${Date.now()}-${parts.length}`, mermaidCode);
                        parts.push({ type: 'mermaid', content: svg });
                    } catch (error) {
                        console.error('Error rendering Mermaid:', error);
                        parts.push({ type: 'text', content: `\`\`\`mermaid\n${mermaidCode}\n\`\`\`` });
                    }
                    inMermaidBlock = false;
                    mermaidCode = '';
                    i++;
                    continue;
                }

                if (inMermaidBlock) {
                    mermaidCode += line + '\n';
                } else {
                    textBuffer += line + '\n';
                }

                i++;
            }

            // Guardar texto final
            if (textBuffer) {
                parts.push({ type: 'text', content: textBuffer });
            }

            setRenderedContent(parts);
        };

        processContent();
    }, [content]);

    return (
        <div className="space-y-6">
            {renderedContent.map((part, idx) => (
                <div key={idx}>
                    {part.type === 'text' ? (
                        <div className="bg-black/50 border border-white/10 rounded-lg p-6 overflow-x-auto">
                            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
                                {part.content}
                            </pre>
                        </div>
                    ) : (
                        <div className="bg-black/50 border border-[#00e9fa]/30 rounded-lg p-6 overflow-x-auto flex justify-center">
                            <div
                                className="mermaid-svg-container"
                                dangerouslySetInnerHTML={{ __html: part.content }}
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}


export default function ModuleDetailModal({ moduleIndex, onClose }) {
    const { t } = useLanguage();
    const [viewFormat, setViewFormat] = useState('overview');
    const mermaidRef = useRef(null);

    // Inicializar Mermaid dinámicamente cuando sea necesario
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const m = await import('mermaid');
                const mer = m && m.default ? m.default : m;
                if (!mounted) return;
                mer.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#00e9fa',
                        primaryTextColor: '#000000',
                        primaryBorderColor: '#00d4e0',
                        lineColor: '#00e9fa',
                        secondaryColor: '#333436',
                        tertiaryColor: '#0098b4',
                        background: '#000000',
                        mainBkg: '#1a1a1a',
                        secondBkg: '#2a2a2a',
                        tertiaryBkg: '#333436',
                        nodeBorder: '#00e9fa',
                        clusterBkg: '#1a1a1a',
                        clusterBorder: '#00e9fa',
                        titleColor: '#ffffff',
                        edgeLabelBackground: '#000000',
                        actorBorder: '#00e9fa',
                        actorBkg: '#1a1a1a',
                        actorTextColor: '#ffffff',
                        actorLineColor: '#00e9fa',
                        signalColor: '#ffffff',
                        signalTextColor: '#ffffff',
                        labelBoxBkgColor: '#1a1a1a',
                        labelBoxBorderColor: '#00e9fa',
                        labelTextColor: '#ffffff',
                        noteBorderColor: '#00e9fa',
                        noteBkgColor: '#1a1a1a',
                        noteTextColor: '#ffffff',
                        relationColor: '#00e9fa',
                        relationLabelBackground: '#000000',
                        relationLabelColor: '#ffffff',
                    }
                });
            } catch (err) {
                console.warn('Could not load mermaid dynamically:', err);
            }
        })();
        return () => { mounted = false };
    }, []);

    // Renderizar diagramas Mermaid cuando cambie la vista o el módulo
    useEffect(() => {
        if (viewFormat === 'document' && moduleIndex === 1 && mermaidRef.current) {
            const renderMermaid = async () => {
                try {
                    const m = await import('mermaid');
                    const mer = m && m.default ? m.default : m;
                    const mermaidDivs = mermaidRef.current.querySelectorAll('.mermaid-diagram');
                    for (let i = 0; i < mermaidDivs.length; i++) {
                        const div = mermaidDivs[i];
                        const code = div.textContent;
                        if (code) {
                            try {
                                const { svg } = await mer.render(`mermaid-${Date.now()}-${i}`, code);
                                div.innerHTML = svg;
                                div.classList.add('mermaid-rendered');
                            } catch (error) {
                                console.error('Error rendering Mermaid diagram:', error);
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Mermaid not available to render diagrams:', err);
                }
            };
            renderMermaid();
        }
    }, [viewFormat, moduleIndex]);

    const moduleDetails = {
        0: {
            // Manuales Técnicos
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_1'),
            description: 'Guías exhaustivas que documentan el funcionamiento interno de cada componente del sistema Xlerion. Incluyen configuración, parámetros, escalabilidad y casos de uso avanzados.',
            sections: [
                { title: 'Configuración Inicial', content: 'Procedimiento paso a paso para inicializar componentes, establecer variables de entorno y validar dependencias.' },
                { title: 'APIs y Endpoints', content: 'Documentación completa de interfaces públicas, parámetros de entrada, tipos de respuesta y códigos de error.' },
                { title: 'Integración', content: 'Patrones de integración con terceros, webhooks, autenticación y manejo de eventos.' },
                { title: 'Optimización', content: 'Mejores prácticas para rendimiento, caching, indexación y escalabilidad horizontal.' },
            ],
            sampleDoc: `
# Manual Técnico: Sistema de Documentación Xlerion

## 1. Introducción
El sistema de documentación de Xlerion proporciona una arquitectura modular y escalable para gestionar la información operativa.

## 2. Requisitos del Sistema
- Node.js 16.x o superior
- React 19.x
- Vite 7.x
- 512 MB de memoria mínima

## 3. Instalación
\`\`\`bash
npm install
npm run dev
\`\`\`

## 4. Componentes Principales
- **DocParser**: Procesa archivos Markdown
- **VersionManager**: Gestiona versiones de documentos
- **SyncEngine**: Sincroniza múltiples repositorios

## 5. Configuración Avanzada
Los archivos de configuración se encuentran en \`config/\`.
Todas las variables de entorno se cargan desde \`.env.local\`.
            `
        },
        1: {
            // Diagramas de Arquitectura
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_2'),
            description: 'Representaciones visuales detalladas de la arquitectura del sistema, flujos de datos, relaciones entre componentes y topología de red.',
            sections: [
                { title: 'Diagrama de Componentes', content: 'Visualización de módulos, dependencias y comunicación inter-componentes.' },
                { title: 'Flujo de Datos', content: 'Trazabilidad completa desde entrada hasta persistencia, incluyendo transformaciones.' },
                { title: 'Topología de Red', content: 'Distribución de servicios, balanceo de carga, failover y replicación.' },
                { title: 'Arquitectura de BD', content: 'Esquemas, relaciones, índices, particiones y estrategia de backup.' },
            ],
            sampleDoc: `
# Diagramas de Arquitectura - Xlerion

## Diagrama de Componentes C4 Level 1

\`\`\`mermaid
graph TB
    Cliente[Cliente Web<br/>React SPA]
    Gateway[API Gateway<br/>Node.js/Express]
    Auth[Auth Service]
    Docs[Docs Service]
    Analytics[Analytics Service]
    DB[(PostgreSQL)]
    
    Cliente -->|HTTPS| Gateway
    Gateway --> Auth
    Gateway --> Docs
    Gateway --> Analytics
    Auth --> DB
    Docs --> DB
    Analytics --> DB
    
    style Cliente fill:#00e9fa,stroke:#00d4e0,color:#000
    style Gateway fill:#00c8d5,stroke:#00b8ca,color:#000
    style Auth fill:#0098b4,stroke:#0088a9,color:#fff
    style Docs fill:#0098b4,stroke:#0088a9,color:#fff
    style Analytics fill:#0098b4,stroke:#0088a9,color:#fff
    style DB fill:#333436,stroke:#00e9fa,color:#fff
\`\`\`

## Flujo de Datos (Sequence Diagram)

\`\`\`mermaid
sequenceDiagram
    participant C as Cliente
    participant G as API Gateway
    participant A as Auth Service
    participant S as Servicio
    participant D as PostgreSQL
    
    C->>G: POST /api/resource (JWT)
    G->>A: Validar token
    A-->>G: Token válido
    G->>S: Procesar request
    S->>D: Query/Insert
    D-->>S: Resultado
    S-->>G: Respuesta JSON
    G-->>C: 200 OK + Data
    
    Note over C,D: Flujo completo: ~50-200ms
\`\`\`

## Arquitectura de Microservicios

\`\`\`mermaid
graph LR
    subgraph Frontend
        WEB[React App]
        MOBILE[Mobile App]
    end
    
    subgraph Backend Services
        AUTH[Auth<br/>Service]
        DOCS[Docs<br/>Service]
        ANALYTICS[Analytics<br/>Service]
        NOTIF[Notification<br/>Service]
    end
    
    subgraph Storage
        PGSQL[(PostgreSQL)]
        REDIS[(Redis Cache)]
        S3[S3 Storage]
    end
    
    WEB --> AUTH
    WEB --> DOCS
    MOBILE --> AUTH
    MOBILE --> ANALYTICS
    
    AUTH --> PGSQL
    AUTH --> REDIS
    DOCS --> PGSQL
    DOCS --> S3
    ANALYTICS --> PGSQL
    NOTIF --> REDIS
    
    style AUTH fill:#00e9fa,color:#000
    style DOCS fill:#00c8d5,color:#000
    style ANALYTICS fill:#00b8ca,color:#000
    style NOTIF fill:#0098b4,color:#fff
\`\`\`

## Modelo de Base de Datos

\`\`\`mermaid
erDiagram
    USERS ||--o{ DOCUMENTS : creates
    USERS ||--o{ SESSIONS : has
    DOCUMENTS ||--o{ VERSIONS : contains
    DOCUMENTS }o--|| CATEGORIES : belongs_to
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        timestamp created_at
        timestamp last_login
    }
    
    DOCUMENTS {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        string title
        text content
        timestamp created_at
        timestamp updated_at
    }
    
    VERSIONS {
        uuid id PK
        uuid document_id FK
        int version_number
        text content_snapshot
        uuid created_by FK
        timestamp created_at
    }
    
    CATEGORIES {
        uuid id PK
        string name
        string slug UK
    }
\`\`\`
            `
        },
        2: {
            // Runbooks Operativos
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_3'),
            description: 'Procedimientos paso a paso para ejecutar tareas críticas del sistema. Incluyen checklists, validaciones, rollback y procedimientos de emergencia.',
            sections: [
                { title: 'Despliegue', content: 'Proceso completo de deployments, validaciones pre-producción, rollout y monitoreo.' },
                { title: 'Incidentes', content: 'Protocolos de respuesta a incidentes, escalación y comunicación de status.' },
                { title: 'Mantenimiento', content: 'Tareas preventivas, parches de seguridad, actualizaciones de dependencias.' },
                { title: 'Recuperación', content: 'Procedimientos de DR, restauración de backups, sincronización de estado.' },
            ],
            sampleDoc: `
# Runbook: Despliegue a Producción

## Pre-Despliegue (T-2h)

- [ ] Validar build local: \`npm run build\`
- [ ] Ejecutar tests: \`npm run test\`
- [ ] Revisar cambios en main branch
- [ ] Generar CHANGELOG
- [ ] Notificar al equipo

## Despliegue (T-0h)

1. Crear release branch:
   \`\`\`bash
   git checkout -b release/v1.x.x
   npm version minor
   git push origin release/v1.x.x
   \`\`\`

2. Ejecutar CI/CD Pipeline
   - Tests automáticos
   - Build optimizado
   - Scan de seguridad

3. Desplegar a staging:
   \`\`\`bash
   ./deploy.ps1 -Environment "staging"
   \`\`\`

4. Smoke tests en staging
   - Validar endpoints principales
   - Verificar conectividad DB
   - Probar flujos críticos

## Post-Despliegue (T+1h)

- [ ] Monitorear métricas
- [ ] Validar logs sin errores
- [ ] Obtener feedback de QA
- [ ] Comunicar status final

## Rollback (si falla)

\`\`\`bash
git revert <commit-hash>
./deploy.ps1 -Environment "production"
\`\`\`
            `
        },
        3: {
            // Troubleshooting
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_4'),
            description: 'Guía de resolución rápida de problemas comunes. Incluye diagnósticos, logs relevantes y soluciones verificadas.',
            sections: [
                { title: 'Problemas de Conectividad', content: 'Diagnóstico de fallos de red, DNS, SSL/TLS y conectividad de BD.' },
                { title: 'Errores de Aplicación', content: 'Stack traces comunes, causas raíz y soluciones específicas.' },
                { title: 'Rendimiento Degradado', content: 'Identificación de cuellos de botella, memory leaks y query optimization.' },
                { title: 'Autenticación y Autorización', content: 'Problemas de tokens, permisos, CORS y políticas de seguridad.' },
            ],
            sampleDoc: `
# Troubleshooting Guide - Xlerion

## Problema: Aplicación no inicia

### Síntomas
- Error "Port already in use"
- Proceso se queda colgado

### Diagnóstico
\`\`\`bash
# Verificar puerto en uso
netstat -ano | findstr :5173

# Eliminar proceso
taskkill /PID <PID> /F

# Verificar dependencias
npm ls
\`\`\`

### Solución
1. Matar proceso anterior
2. Limpiar node_modules: \`rm -rf node_modules && npm install\`
3. Reiniciar servidor

---

## Problema: Errores 500 en API

### Síntomas
- Respuesta 500 Internal Server Error
- Logs muestran "TypeError" o "Cannot read property"

### Diagnóstico
1. Revisar logs: \`tail -f logs/app.log\`
2. Validar variablesenvironment: \`env | grep XLERION\`
3. Probar endpoint con curl

### Solución
\`\`\`bash
# Reiniciar servicio
pm2 restart api

# O manualmente
npm run dev
\`\`\`

---

## Problema: Base de datos no accesible

### Síntomas
- Error "Cannot connect to database"
- Timeouts en queries

### Diagnóstico
\`\`\`bash
# Verificar conexión
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Probar puerto
telnet $DB_HOST 5432
\`\`\`

### Solución
- Validar credenciales en .env
- Verificar whitelist de firewall
- Reiniciar servicio de BD
            `
        },
        4: {
            // Guías de Onboarding
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_5'),
            description: 'Capacitación estructurada para nuevos miembros del equipo. Cubre configuración local, prácticas, estándares de código y contribución.',
            sections: [
                { title: 'Setup Local', content: 'Pasos para configurar el ambiente de desarrollo, herramientas y accesos necesarios.' },
                { title: 'Estándares de Código', content: 'Convenciones de nomenclatura, patrones de React, testing y documentación esperada.' },
                { title: 'Procesos', content: 'Flujo de trabajo: branches, PRs, code review, merge strategy y releases.' },
                { title: 'Recursos', content: 'Acceso a documentación, wikis internas, contactos y canales de comunicación.' },
            ],
            sampleDoc: `
# Guía de Onboarding - Xlerion Development Team

## Bienvenida

Hola y bienvenido al equipo Xlerion! Esta guía te preparará para contribuir efectivamente.

## Semana 1: Configuración

### Día 1: Setup Inicial
1. Clonar repositorio:
   \`\`\`bash
   git clone https://github.com/xlerion/xlerion-web.git
   cd xlerion-web
   \`\`\`

2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Crear archivo .env.local
   \`\`\`
   VITE_API_URL=http://localhost:8000
   VITE_ENV=development
   \`\`\`

4. Iniciar servidor:
   \`\`\`bash
   npm run dev
   \`\`\`

### Día 2-3: Exploración
- Recorrer la estructura del proyecto
- Revisar documentación interna local para entender el design system
- Revisar LanguageContext.jsx para i18n
- Crear tu primer commit

### Día 4-5: Primeras Tareas
- Asignar bugs pequeños etiquetados "good-first-issue"
- Abrir PR con cambios
- Recibir feedback del equipo

## Semana 2+: Familiarización

### Estándares de Código
- Usar ESLint: \`npm run lint:fix\`
- Nombres descriptivos en español/inglés
- Props de componentes documentadas
- 80+ caracteres de line-length

### Git Workflow
1. Crear branch: \`git checkout -b feature/mi-feature\`
2. Hacer cambios y commits descriptivos
3. Push: \`git push origin feature/mi-feature\`
4. Abrir PR con descripción clara
5. Esperar aprobación (al menos 1 revisor)
6. Merge y delete branch

### Testing
- Tests en \`__tests__/\` junto al código
- Mínimo 80% coverage
- Ejecutar: \`npm run test\`

## Recursos Clave
- Documentación: \`docs-md/\` (local)
- Componentes: \`/src/components/\`
- Rutas: \`/src/main.jsx\`
- i18n: \`/src/context/LanguageContext.jsx\`

## Preguntas?
Contacta a @lead-dev en Slack o abre issue en GitHub
            `
        },
        5: {
            // Control de Versiones
            icon: <FileText size={32} />,
            fullTitle: t('docs_struct_module_6'),
            description: 'Historial de cambios, versionado semántico y trazabilidad de actualizaciones. Incluye changelog, tags y política de retrocompatibilidad.',
            sections: [
                { title: 'Versionado', content: 'Semántica de versiones, numeración, política de releases y branch strategy.' },
                { title: 'Changelog', content: 'Registro detallado de cambios por versión, con categorías y breaking changes.' },
                { title: 'Retrocompatibilidad', content: 'Deprecación gradual, período de soporte y migración de usuarios.' },
                { title: 'Auditoría', content: 'Trazabilidad de commits, autores, fechas y propósito de cada cambio.' },
            ],
            sampleDoc: `
# CHANGELOG - Xlerion Documentation System

## [v2.1.0] - 2026-01-27

### Added
- Nuevo módulo: Runbooks Operativos con procedimientos de emergencia
- Integración de Xlerion Design System (v1.5.0)
- Soporte i18n completo (ES/EN) en 48+ keys
- Modal interactivo para detalles de módulos

### Changed
- Refactored DocsStructPage para mejor mantenibilidad
- Mejorado rendimiento de lazy loading en imágenes
- Actualizado a React 19 con hooks optimizados
- Migración de RTL a arquitectura modular

### Fixed
- Corregido hover states en tarjetas de módulos
- Solucionado problema de memory leaks en Three.js
- Arreglado CORS en router.php para local dev

### Deprecated
- \`getDocumentation()\` será removido en v3.0.0, usar \`useDocumentation()\` hook
- API v1 endpoints deprecados (migrar a v2)

## [v2.0.0] - 2026-01-15

### BREAKING CHANGES
- Cambio en estructura de archivos: \`/docs\` → \`/media/docs\`
- LanguageContext ahora requiere Provider envuelto en root
- Eliminado soporte para Internet Explorer 11

### Added
- Arquitectura de documentación multi-modular
- Sistema de versionado semántico
- Integración con GitHub Actions para CI/CD
- Generación automática de sitemap

### Migration Guide
Consultar la guía interna local para detalles de upgrade desde v1.x

---

## Version Support Policy

| Versión | Status | Soporte hasta |
|---------|--------|---------------|
| 2.1.x | Actual | 2026-06-27 |
| 2.0.x | LTS | 2027-01-27 |
| 1.x.x | EOL | 2025-12-31 |

## Git Tags

\`\`\`bash
# Listar tags
git tag -l

# Crear release
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin v2.1.0
\`\`\`
            `
        },
    };
    const current = moduleDetails[moduleIndex];

    const handleDownload = async (format) => {
        const baseFileName = 'xlerion_' + current.fullTitle.replace(/\s+/g, '_').toLowerCase();

        if (format === 'md') {
            // Descargar como Markdown
            const fileName = baseFileName + '.md';
            const content = current.sampleDoc;
            const element = document.createElement('a');
            const dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
            element.setAttribute('href', dataURI);
            element.setAttribute('download', fileName);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else if (format === 'pdf') {
            // Crear contenedor con contenido HTML optimizado
            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.width = '210mm';
            pdfContainer.style.padding = '20mm';
            pdfContainer.style.backgroundColor = '#ffffff';
            pdfContainer.style.fontFamily = 'Courier New, monospace';
            pdfContainer.style.fontSize = '11px';
            pdfContainer.style.color = '#333';
            pdfContainer.style.lineHeight = '1.4';

            let html = `
                <div style="background: linear-gradient(135deg, #00e9fa 0%, #0098b4 100%); padding: 15px 20px; margin: -20mm -20mm 20mm -20mm; color: #fff; font-weight: bold; font-size: 20px; font-family: Arial, sans-serif; letter-spacing: 2px;">
                    XLERION DOCUMENTATION
                </div>
                
                <div style="margin-bottom: 30px;">
                    <div style="color: #00e9fa; font-size: 24px; font-weight: bold; margin-bottom: 8px; font-family: Arial, sans-serif;">
                        ${current.fullTitle}
                    </div>
                    
                    <div style="color: #666; font-size: 11px; margin-bottom: 15px; font-family: Arial, sans-serif; line-height: 1.6;">
                        ${current.description}
                    </div>
                    
                    <hr style="border: none; border-top: 2px solid #00e9fa; margin: 15px 0;">
                    
                    <div style="color: #999; font-size: 9px; margin-top: 10px;">
                        Generado: ${new Date().toLocaleString('es-CO')} | Versión: 1.0
                    </div>
                </div>
            `;

            // Agregar secciones
            if (current.sections && current.sections.length > 0) {
                html += `<div style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #00e9fa; margin-bottom: 20px; border-radius: 3px;">
                    <div style="color: #00e9fa; font-size: 12px; font-weight: bold; margin-bottom: 8px; font-family: Arial, sans-serif; text-transform: uppercase;">
                        CONTENIDO PRINCIPAL
                    </div>`;
                current.sections.forEach((section, idx) => {
                    html += `
                        <div style="margin-bottom: 8px; margin-left: 5px;">
                            <div style="color: #0098b4; font-weight: bold; font-size: 10px; margin-bottom: 3px;">
                                ${idx + 1}. ${section.title}
                            </div>
                            <div style="color: #555; font-size: 9px; margin-left: 15px; line-height: 1.4;">
                                ${section.content}
                            </div>
                        </div>
                    `;
                });
                html += `</div><hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">`;
            }

            // Procesar contenido Markdown (para Runbooks y documentación)
            // Convertir Markdown a HTML de manera simple pero efectiva
            let docHtml = current.sampleDoc
                // Proteger bloques de código
                .replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
                    const escaped = code
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    return `<CODE_BLOCK>${escaped}</CODE_BLOCK>`;
                })
                // Encabezados H1
                .replace(/^# (.+)$/gm, '<h1 style="color: #00e9fa; font-size: 16px; margin: 15px 0 8px 0; page-break-inside: avoid; font-family: Arial, sans-serif;">$1</h1>')
                // Encabezados H2
                .replace(/^## (.+)$/gm, '<h2 style="color: #0098b4; font-size: 13px; margin: 12px 0 6px 0; page-break-inside: avoid; font-family: Arial, sans-serif;">$1</h2>')
                // Encabezados H3
                .replace(/^### (.+)$/gm, '<h3 style="color: #555; font-size: 11px; margin: 8px 0 4px 0; font-family: Arial, sans-serif;">$1</h3>')
                // Checklists [ ] (ANTES de listas simples)
                .replace(/^\s*- \[ \] (.+)$/gm, '<div style="margin: 4px 0; margin-left: 15px;">[ ] $1</div>')
                // Checklists [x]
                .replace(/^\s*- \[x\] (.+)$/gm, '<div style="margin: 4px 0; margin-left: 15px; text-decoration: line-through; color: #999;">[x] $1</div>')
                // Listas simples (DESPUÉS de checklists)
                .replace(/^\s*- (.+)$/gm, '<div style="margin: 3px 0; margin-left: 15px;">- $1</div>')
                // Código inline (ANTES de bloques de código)
                .replace(/`([^`]+)`/g, '<code style="background-color: #f5f5f5; padding: 2px 4px; font-size: 10px; border-radius: 2px;">$1</code>')
                // Bold
                .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #00e9fa;">$1</strong>')
                // Restaurar bloques de código
                .replace(/<CODE_BLOCK>([\s\S]*?)<\/CODE_BLOCK>/g, (match, code) => {
                    return `<pre style="background-color: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 3px solid #00e9fa; overflow-x: auto; font-size: 9px; line-height: 1.3; border-radius: 3px; page-break-inside: avoid; font-family: 'Courier New', monospace;">${code}</pre>`;
                });

            html += `<div style="font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.5; color: #333;">${docHtml}</div>`;

            // Agregar diagramas si es módulo 1 (Diagramas de Arquitectura)
            if (moduleIndex === 1) {
                const diagramMatches = Array.from(current.sampleDoc.matchAll(/```mermaid\n([\s\S]*?)```/g));

                if (diagramMatches.length > 0) {
                    html += `<div style="page-break-before: always;"></div>`;
                    html += `<hr style="border: none; border-top: 2px solid #00e9fa; margin: 30px 0;">`;
                    html += `<div style="color: #00e9fa; font-size: 16px; font-weight: bold; margin-bottom: 20px; margin-top: 10px; font-family: Arial, sans-serif;">DIAGRAMAS DE ARQUITECTURA</div>`;

                    for (let i = 0; i < diagramMatches.length; i++) {
                        const diagramCode = diagramMatches[i][1].trim();
                        try {
                            const { svg } = await mermaid.render(`diagram-${i}-${Date.now()}`, diagramCode);
                            html += `
                                <div style="margin-bottom: 25px; page-break-inside: avoid;">
                                    <div style="color: #0098b4; font-weight: bold; font-size: 12px; margin-bottom: 8px; font-family: Arial, sans-serif;">
                                        Diagrama ${i + 1}
                                    </div>
                                    <div style="background-color: #ffffff; padding: 15px; border: 1px solid #00e9fa; border-radius: 4px; display: flex; justify-content: center; align-items: center; min-height: 150px;">
                                        <div style="max-width: 100%; overflow: auto;">
                                            ${svg}
                                        </div>
                                    </div>
                                </div>
                            `;
                        } catch (err) {
                            console.warn('Error renderizando diagrama:', err);
                            html += `<div style="color: #999; font-size: 10px; margin: 10px 0; background-color: #f9f9f9; padding: 8px; border-radius: 3px;">⚠ No se pudo renderizar diagrama ${i + 1}</div>`;
                        }
                    }
                }
            }

            pdfContainer.innerHTML = html;
            document.body.appendChild(pdfContainer);

            try {
                const canvas = await html2canvas(pdfContainer, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowHeight: pdfContainer.scrollHeight,
                    allowTaint: true
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 10;

                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight - 20;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight + 10;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight - 20;
                }

                pdf.save(baseFileName + '.pdf');
            } finally {
                document.body.removeChild(pdfContainer);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#00e9fa]/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 p-8 border-b border-[#00e9fa]/20 bg-gradient-to-r from-black via-gray-900 to-black flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="text-[#00e9fa] mb-3">{current.icon}</div>
                        <h2 className="text-3xl font-black text-white mb-2">{current.fullTitle}</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">{current.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-black/50 sticky top-24 z-40">
                    <button
                        onClick={() => setViewFormat('overview')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors border-b-2 ${viewFormat === 'overview'
                            ? 'border-[#00e9fa] text-[#00e9fa] bg-[#00e9fa]/5'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        <Eye size={16} className="inline mr-2" />
                        Descripción General
                    </button>
                    <button
                        onClick={() => setViewFormat('document')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors border-b-2 ${viewFormat === 'document'
                            ? 'border-[#00e9fa] text-[#00e9fa] bg-[#00e9fa]/5'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        <FileText size={16} className="inline mr-2" />
                        Documento Muestra
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8">
                    {viewFormat === 'overview' ? (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#00e9fa] rounded" />
                                    Secciones Principales
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {current.sections.map((section, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                                            <h4 className="text-[#00e9fa] font-semibold mb-2">{section.title}</h4>
                                            <p className="text-gray-400 text-sm">{section.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#00e9fa] rounded" />
                                    Objetivo Estratégico
                                </h3>
                                <div className="p-6 bg-gradient-to-r from-[#00e9fa]/10 to-transparent border border-[#00e9fa]/20 rounded-lg">
                                    <p className="text-gray-300 leading-relaxed">
                                        Este módulo es parte de la arquitectura modular de Xlerion, diseñada para asegurar que toda la información operativa esté centralizada, accesible y actualizada. Permite que equipos técnicos y operacionales accedan rápidamente a información crítica mientras se mantiene la trazabilidad y governance requerida por estándares empresariales.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6" ref={mermaidRef}>
                            {moduleIndex === 1 && (
                                <div className="p-4 bg-[#00e9fa]/10 border border-[#00e9fa]/30 rounded-lg">
                                    <p className="text-[#00e9fa] text-sm font-semibold mb-2">💡 Diagramas Renderizados con Mermaid</p>
                                    <p className="text-gray-300 text-xs">
                                        Los diagramas se renderizan automáticamente usando <strong>Mermaid.js</strong> con el tema oscuro de Xlerion.
                                        Puedes descargar el documento con la sintaxis para editarlos en <a href="https://mermaid.live" target="_blank" rel="noopener" className="text-[#00e9fa] underline">Mermaid Live Editor</a>.
                                    </p>
                                </div>
                            )}
                            {moduleIndex === 1 ? (
                                <RenderMermaidDocument content={current.sampleDoc} />
                            ) : (
                                <div className="bg-black/50 border border-white/10 rounded-lg p-6 overflow-x-auto">
                                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
                                        {current.sampleDoc}
                                    </pre>
                                </div>
                            )}
                            <p className="text-gray-400 text-sm italic">
                                Esta es una muestra del tipo de contenido que se genera para este módulo. El documento completo incluiría más detalles específicos del contexto de tu organización.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 p-6 border-t border-[#00e9fa]/20 bg-gradient-to-t from-black via-gray-900 to-transparent flex gap-4 justify-end">
                    <button
                        onClick={() => handleDownload('pdf')}
                        className="px-6 py-3 bg-gradient-to-r from-[#00e9fa] to-[#00c8d5] text-black font-semibold rounded-lg hover:from-[#00d4e0] hover:to-[#00b8ca] transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Download size={18} />
                        Descargar PDF
                    </button>
                    <button
                        onClick={() => handleDownload('md')}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Descargar Markdown
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/5 text-gray-400 font-semibold rounded-lg hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}