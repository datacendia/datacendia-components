# Propuesta de Prueba de Concepto — FEPCMAC / CendiaGateway™

**Datacendia, LLC → Federación Peruana de Cajas Municipales de Ahorro y Crédito**

---

## El Problema

Las 11 Cajas Municipales de Ahorro y Crédito que conforman FEPCMAC operan sistemas de inteligencia artificial en procesos críticos — scoring crediticio, detección de operaciones sospechosas, análisis de riesgo — sin infraestructura técnica que genere evidencia verificable de cumplimiento con:

- **DS N° 115-2025-PCM** — estándar obligatorio de gobernanza de IA en Perú
- **Ley 31814** — marco regulatorio de IA con clasificación de alto riesgo para scoring crediticio
- **Resoluciones SBS** de gobierno corporativo y gestión integral de riesgos

Hoy, si la SBS solicita evidencia de gobernanza de IA, no existe un mecanismo técnico para generarla.

## La Solución

**CendiaGateway™** se despliega como infraestructura de federación entre los sistemas de IA de las CMACs y sus usuarios. Funciona como un proxy inverso que:

1. **Intercepta** cada interacción con IA sin modificar los sistemas existentes
2. **Audita** el contenido — detectando PII, aplicando políticas, registrando contexto
3. **Firma criptográficamente** cada registro con SHA-256 — inmutable y verificable por terceros
4. **Genera** un Paquete de Evidencia Regulatoria listo para presentar a la SBS

Se despliega dentro de la infraestructura de la CMAC. Ningún dato sale del perímetro institucional.

## La Prueba de Concepto

| Elemento | Detalle |
|---|---|
| **Duración** | 60 días calendario |
| **Alcance** | 2 Cajas Municipales piloto |
| **Usuarios** | Equipo de cumplimiento + oficiales de crédito de cada caja piloto |
| **Flujo auditado** | Scoring crediticio (flujo a confirmar con equipo técnico) |
| **Entregable principal** | Paquete de evidencia DS N° 115-2025-PCM listo para presentar a la SBS |

## Cronograma

| Semana | Actividad |
|---|---|
| **1–2** | Configuración de infraestructura, despliegue de CendiaGateway en entorno de pruebas |
| **3–4** | Integración con flujo de scoring crediticio, configuración de políticas |
| **5–6** | Período de operación auditada — recopilación de evidencia |
| **7–8** | Generación de paquete de evidencia, revisión con equipo de cumplimiento, informe final |

## Entregables

1. **CendiaGateway desplegado** en infraestructura de las 2 cajas piloto
2. **Paquete de Evidencia DS N° 115-2025-PCM** — documento técnico con:
   - Registro de interacciones auditadas
   - Firmas criptográficas verificables
   - Mapeo cláusula por cláusula a ISO/IEC 42001:2023
   - Métricas de operación (PII detectado, políticas aplicadas, volumen procesado)
3. **Informe ejecutivo** con recomendaciones para despliegue a las 11 cajas
4. **Plan de despliegue federado** — arquitectura propuesta para toda la red FEPCMAC

## Inversión

| Concepto | Monto |
|---|---|
| **POC completa (60 días, 2 cajas)** | **USD $20,000** |
| Acreditable al primer contrato anual | Sí — 100% del monto del POC |

El monto del POC se acredita íntegramente al primer contrato anual de licenciamiento.

## Lo que Datacendia proporciona

- Despliegue e instalación de CendiaGateway en infraestructura designada
- Configuración de políticas de gobernanza específicas para microfinanzas
- Soporte técnico durante los 60 días del POC
- Capacitación al equipo de cumplimiento en uso del dashboard
- Generación del paquete de evidencia regulatoria

## Lo que FEPCMAC proporciona

- Acceso DNS o VPN a infraestructura de las 2 cajas piloto
- Un contacto interno nombrado por cada caja piloto (cumplimiento o tecnología)
- Lista de herramientas de IA actualmente en uso en las cajas piloto
- Disponibilidad del equipo de cumplimiento para sesiones de revisión (2 sesiones de 1 hora)

## Siguientes Pasos

1. Confirmación de interés y designación de cajas piloto
2. Llamada técnica de 30 minutos para validar requisitos de infraestructura
3. Firma de NDA y acuerdo de POC
4. Inicio de despliegue

---

**Contacto:**

**Stuart Rainey** — CEO, Datacendia  
stuart.rainey@datacendia.com  
datacendia.com

---

*Datacendia, LLC — Decision Crisis Immunization Infrastructure*  
*Lima, Perú / Londres, Reino Unido*
