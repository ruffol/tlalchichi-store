# 📊 Análisis FODA — Tlalchichi Store

**Fecha:** 28 de junio de 2026
**Sitio:** [www.tlalchichi.xyz](https://www.tlalchichi.xyz)
**Plataforma:** Next.js 16 + React 19 + Tailwind CSS 4 + SQLite
**Hosting:** Railway (Docker)
**Pagos:** Stripe + PayPal (en vivo)

---

## 🟢 FORTALEZAS (Internas — Positivas)

### 1. Stack tecnológico moderno y robusto
- **Next.js 16 + React 19** — el framework web más moderno, con renderizado híbrido (SSR/SSG), App Router, y Server Components.
- **Tailwind CSS 4** — diseño responsive moderno con modo oscuro incluido.
- **TypeScript** — tipado fuerte en todo el proyecto, reduce errores en producción.

### 2. Completamente funcional como e-commerce
- **Catálogo completo** con 4 categorías: Llaveros, Portamacetas, Alcancías, Cuencos.
- **4 colores disponibles** por producto: Blanco, Negro, Traslúcido, Naranja.
- **Sistema de carrito de compras** con persistencia en localStorage (vía Zustand).
- **Dos procesadores de pago:** Stripe y PayPal en vivo — doble alternativa para el cliente.
- **Checkout completo** con formulario de envío, selección de país y cálculo de costos.
- **Webhooks** para Stripe (con verificación de firma) y PayPal.
- **Confirmación por email** vía Resend tras compra exitosa.

### 3. Panel administrador funcional
- CRUD completo de productos (modelos), tipos de producto, colores y disponibilidad.
- Vista previa del producto antes de guardar.
- Subida de imágenes (ImageUploader).

### 4. SEO y accesibilidad
- **Sitemap dinámico** que indexa productos desde la BD.
- **Meta tags Open Graph y Twitter Cards** en todas las páginas principales.
- **Schema.org JSON-LD** (WebSite + Organization) en el layout principal.
- **Etiquetas canónicas y hreflang** para español e inglés.
- **i18n completo** (español e inglés) con `next-intl`.

### 5. Presencia y contacto
- **Botón flotante de WhatsApp** en todas las páginas.
- Información de contacto visible: WhatsApp y correo en Header y Footer.
- Dominio propio: `www.tlalchichi.xyz`.

### 6. Diseño atractivo y coherente
- Tema claro/oscuro con transiciones suaves.
- Carrusel de imágenes en homepage con múltiples fotos del producto.
- Paleta de colores cálida (terracota, arena, negro suave) que evoca artesanía mexicana.
- Hero Carousel con imágenes de productos reales.

---

## 🟡 DEBILIDADES (Internas — Negativas)

### 1. 🔴 Seguridad — CRÍTICO
- **Contraseña admin hardcodeada:** `'admin123'` como fallback en `src/lib/admin.ts`. Cualquiera con acceso al repositorio puede entrar al panel administrativo.
- **Endpoint `/api/admin/restock` sin autenticación:** cualquier persona en internet puede modificar stocks mediante POST.
- **Webhook de PayPal sin verificación de firma:** a diferencia de Stripe, el webhook de PayPal acepta cualquier payload sin validar que venga de PayPal.

### 2. 🔴 Correo electrónico hardcodeado
- En la página de éxito de PayPal, el email `ruffolmx@gmail.com` está hardcodeado en lugar de usar el email real del cliente.

### 3. Resiembra destructiva en cada reinicio
- `seedColors()` y `seedProductTypes()` ejecutan `DELETE FROM` antes de insertar en cada cold start. Cualquier personalización que el admin haga en colores o tipos de producto **se pierde cada vez que el servidor se reinicia**.

### 4. Código con `require()` en módulo ES
- `const fs = require('fs')` en `src/lib/db.ts` mezcla CommonJS con módulos ES, puede causar errores en ciertos contextos.

### 5. Duplicación de código
- El panel admin (`admin/page.tsx`) tiene ~833 líneas con 4 CRUDs que comparten lógica casi idéntica pero sin componentes reutilizables.
- Las rutas de API admin tienen lógica repetitiva.

### 6. Sin tests automatizados
- No se encontraron tests unitarios, de integración ni e2e. Cualquier cambio requiere verificación manual.

### 7. Sin análisis ni dashboard de ventas
- No hay reportes, gráficas, ni métricas de negocio (productos más vendidos, ingresos por período, etc.).

### 8. Catálogo de productos limitado
- Solo 4 categorías con stock predefinido de semilla. No hay forma de agregar modelos personalizados desde el panel admin de manera intuitiva (la lógica de modelos vs product_types vs colors es confusa).

---

## 🔵 OPORTUNIDADES (Externas — Positivas)

### 1. Nicho cultural único
- Los Tlalchichis son una artesanía prehispánica mexicana con valor cultural e histórico. Hay un mercado creciente de consumidores que buscan productos auténticos y tradicionales mexicanos.
- Competencia baja en e-commerce directo de artesanía de Colima.

### 2. Expansión internacional
- La tienda ya está preparada con i18n (español/inglés) y pagos en USD via Stripe y PayPal.
- Envíos configurados para México y "Resto del mundo" — se puede escalar a más países con tarifas específicas.

### 3. Marketing digital
- **Redes sociales:** Integrar Instagram/TikTok para mostrar el proceso artesanal (contenido muy atractivo visualmente).
- **SEO local:** Optimizar para búsquedas como "artesanía Colima", "tlalchichi", "figuras de barro Colima", "perro de la tierra".
- **Google My Business / Maps:** Registrar la tienda para aparecer en búsquedas locales.

### 4. Mejoras de producto
- **Sistema de reseñas y valoraciones** de clientes.
- **Programa de fidelidad o descuentos por volumen** (pedidos al mayoreo).
- **Sección de "personaliza tu Tlalchichi"** — permitir elegir color y tamaño base.
- **Blog de contenido** sobre la historia y proceso artesanal para atraer tráfico orgánico.

### 5. Automatización
- **Inventario automatizado:** vincular stock real con el sitio.
- **Notificaciones de nuevos pedidos** vía WhatsApp o Telegram.
- **Facturación electrónica** para clientes en México (CFDI).

### 6. Analytics y conversión
- Implementar Google Analytics 4 o Plausible para entender tráfico y comportamiento de usuarios.
- Añadir heatmaps para identificar dónde abandonan los usuarios.
- **Remarketing** (Meta Pixel, Google Ads) para recuperar carritos abandonados.

---

## 🔴 AMENAZAS (Externas — Negativas)

### 1. Seguridad web — Riesgo de ataque
- La vulnerabilidad del admin panel (`admin123`) y el endpoint `/api/admin/restock` sin autenticación representan un **riesgo real de explotación** si el sitio es descubierto por actores maliciosos.
- Sin verificación de firma en webhook PayPal, un atacante podría falsificar eventos de pago.

### 2. Dependencia tecnológica
- **SQLite en producción:** Railway usa discos efímeros. Si el contenedor se reinicia sin persistencia, los datos de pedidos se pierden (aunque el seed regenera productos, las órdenes no). Railway ofrece volúmenes persistentes pero no está configurado.
- **Dependencia de proveedores terciarios:** Stripe, PayPal, Resend, Supabase (para imágenes) — cualquier interrupción en estos servicios afecta la tienda.

### 3. Competencia
- Mercado Libre, Etsy y Amazon tienen artesanías mexicanas con mayor visibilidad y confianza del comprador.
- Otros artesanos locales podrían lanzar sus propias tiendas en línea.

### 4. Estacionalidad
- Las ventas de artesanías pueden ser estacionales (Día de Muertos, Navidad, Día de las Madres, etc.).
- Puede haber meses de baja demanda.

### 5. Logística internacional
- Costos de envío internacional altos pueden desalentar compras del extranjero.
- Gestión de aduanas, devoluciones y cambios desde el extranjero es compleja.

### 6. Sin copias de seguridad
- No hay un sistema de backup de la base de datos. Si la instancia de Railway falla o se corrompe la DB, se pierden todas las órdenes y configuraciones.

---

## 📋 RESUMEN ESTRATÉGICO

### Prioridad inmediata (CRÍTICO — resolver antes de promocionar el sitio)
1. **Eliminar contraseña admin hardcodeada (`admin123`)** — configurar por variable de entorno.
2. **Agregar autenticación al endpoint `/api/admin/restock`**.
3. **Implementar verificación de firma en webhook de PayPal**.
4. **Reemplazar email hardcodeado** en la página de éxito de PayPal.
5. **Configurar volumen persistente en Railway** para no perder pedidos.

### Prioridad alta (siguiente mes)
6. Agregar Google Analytics / Plausible.
7. Migrar de `require('fs')` a `import fs` en db.ts.
8. Hacer `seedColors()` y `seedProductTypes()` no-destructivos (verificar existencia antes de insertar).
9. Agregar tests automatizados básicos (al menos unitarios para lógica de carrito y DB).

### Prioridad media (próximo trimestre)
10. Dashboard de ventas y reportes básicos en el admin.
11. Refactorizar panel admin para reducir duplicación.
12. Integrar redes sociales y blog para SEO.
13. Sistema de reseñas de clientes.

### Prioridad baja (próximo semestre)
14. Programa de fidelidad y descuentos por volumen.
15. Personalización de productos desde el sitio.
16. Facturación electrónica (CFDI) para clientes MX.
17. App móvil o PWA.

---

## 📈 INDICADORES CLAVE (KPIs recomendados)

| Indicador | Objetivo | Cómo medirlo |
|-----------|----------|--------------|
| Tráfico mensual | +500 visitas/mes | Google Analytics |
| Tasa de conversión | >2% | Órdenes / visitantes |
| Ticket promedio | Seguimiento | Órdenes en DB |
| Carritos abandonados | <70% | Analytics + session |
| Tiempo de carga | <2s | Lighthouse |
| Posición SEO "tlalchichi" | Top 3 | Google Search Console |
| Pedidos WhatsApp | Seguimiento | Contar manualmente |

---

*Informe generado el 28 de junio de 2026 basado en análisis del código fuente, revisión del sitio en producción y estructura del proyecto.*
