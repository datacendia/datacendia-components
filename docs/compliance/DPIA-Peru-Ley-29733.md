# Evaluación de Impacto en la Protección de Datos Personales (EIPD)
# Data Protection Impact Assessment (DPIA) — Peru Law 29733

**Plantilla para Sistemas de IA que Procesan Datos Personales Sensibles**  
**Template for AI Systems Processing Sensitive Personal Data**

**Organización / Organization:** [Nombre de la institución]  
**Sistema evaluado / System assessed:** [Nombre del sistema de IA]  
**Responsable de la evaluación / Assessment lead:** [Nombre y cargo]  
**Fecha / Date:** [DD/MM/YYYY]  
**Versión / Version:** 1.0  

---

## 1. Descripción del Tratamiento / Description of Processing

### 1.1 Naturaleza del tratamiento / Nature of processing

| Campo / Field | Descripción / Description |
|---|---|
| **Sistema de IA** | [Nombre, versión, proveedor] |
| **Propósito** | [Ej: Scoring crediticio, detección de fraude, análisis de riesgo] |
| **Base legal (Art. 14, Ley 29733)** | [Consentimiento / Ejecución contractual / Obligación legal / Interés legítimo] |
| **Categorías de datos personales** | [Ej: Datos financieros, datos de identificación, historial crediticio] |
| **Datos sensibles (Art. 2.5)** | [Sí/No — si sí, especificar: origen racial/étnico, ingresos, opiniones políticas, datos de salud, datos biométricos] |
| **Volumen estimado de registros** | [Número de personas afectadas por período] |
| **Fuentes de datos** | [Ej: Solicitudes de crédito, bureaus de crédito, datos internos] |
| **Destinatarios** | [Quién accede a los resultados del sistema de IA] |
| **Transferencia internacional** | [Sí/No — si sí, destino y salvaguardas] |
| **Período de retención** | [Tiempo de conservación de datos y resultados] |

### 1.2 Flujo de datos / Data flow

Describir el flujo completo desde la recopilación hasta la decisión:

1. **Entrada:** [Cómo ingresan los datos al sistema de IA]
2. **Procesamiento:** [Qué hace el modelo de IA con los datos]
3. **Salida:** [Qué resultado genera y a quién se comunica]
4. **Almacenamiento:** [Dónde se almacenan datos y resultados]
5. **Eliminación:** [Cómo y cuándo se eliminan]

---

## 2. Evaluación de Necesidad y Proporcionalidad / Necessity and Proportionality Assessment

| Criterio / Criterion | Evaluación / Assessment |
|---|---|
| **¿Es necesario el uso de IA para este propósito?** | [Justificación — ¿existen alternativas menos invasivas?] |
| **¿Los datos recopilados son los mínimos necesarios? (Art. 4)** | [Sí/No — justificación del principio de minimización] |
| **¿El tratamiento es proporcional al propósito?** | [Justificación de proporcionalidad] |
| **¿Se ha obtenido consentimiento informado? (Art. 5)** | [Sí/No — mecanismo de consentimiento] |
| **¿Los titulares pueden ejercer sus derechos? (Art. 18-27)** | [Acceso, rectificación, cancelación, oposición — mecanismos disponibles] |
| **¿Existe supervisión humana de las decisiones del IA?** | [Sí/No — describir mecanismo] |

---

## 3. Identificación y Evaluación de Riesgos / Risk Identification and Assessment

### 3.1 Riesgos para los titulares de datos / Risks to data subjects

| # | Riesgo / Risk | Probabilidad / Likelihood | Impacto / Impact | Nivel / Level |
|---|---|---|---|---|
| R1 | Decisión crediticia incorrecta basada en datos erróneos | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R2 | Discriminación algorítmica por variables proxy (género, etnia, ubicación) | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R3 | Falta de transparencia — titular no comprende decisión de IA | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R4 | Acceso no autorizado a datos financieros sensibles | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R5 | Transferencia no autorizada de datos personales a terceros | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R6 | Imposibilidad de ejercer derecho de oposición a decisión automatizada | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R7 | Pérdida o corrupción de datos personales | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R8 | Retención excesiva de datos más allá del período justificado | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Crítico/Alto/Medio/Bajo] |
| R9 | [Agregar riesgos específicos del sistema evaluado] | | | |

### 3.2 Riesgos regulatorios / Regulatory risks

| # | Riesgo / Risk | Regulación | Nivel / Level |
|---|---|---|---|
| RR1 | Incumplimiento de obligación de consentimiento informado | Ley 29733, Art. 5 | [Crítico/Alto/Medio/Bajo] |
| RR2 | Tratamiento de datos sensibles sin autorización especial | Ley 29733, Art. 2.5 | [Crítico/Alto/Medio/Bajo] |
| RR3 | Falta de registro en la ANPD | Ley 29733, Art. 34 | [Crítico/Alto/Medio/Bajo] |
| RR4 | Incumplimiento de Ley 31814 para sistema de IA de alto riesgo | Ley 31814, Art. 8 | [Crítico/Alto/Medio/Bajo] |
| RR5 | Incumplimiento de DS N° 115-2025-PCM | DS 115-2025-PCM | [Crítico/Alto/Medio/Bajo] |

---

## 4. Medidas de Mitigación / Mitigation Measures

### 4.1 Medidas técnicas / Technical measures

| Riesgo | Medida de mitigación | Responsable | Estado |
|---|---|---|---|
| R1 | Validación de datos de entrada; registro de fuentes de datos | [Nombre] | [Implementada/En progreso/Planificada] |
| R2 | Auditoría de sesgo algorítmico; detección de variables proxy | [Nombre] | [Implementada/En progreso/Planificada] |
| R3 | Generación de explicaciones comprensibles por cada decisión de IA | [Nombre] | [Implementada/En progreso/Planificada] |
| R4 | Cifrado en reposo y en tránsito; control de acceso basado en roles | [Nombre] | [Implementada/En progreso/Planificada] |
| R5 | Despliegue soberano — datos no salen del perímetro institucional | [Nombre] | [Implementada/En progreso/Planificada] |
| R6 | Proceso documentado de revisión humana de decisiones automatizadas | [Nombre] | [Implementada/En progreso/Planificada] |
| R7 | Respaldos cifrados; verificación de integridad con hash SHA-256 | [Nombre] | [Implementada/En progreso/Planificada] |
| R8 | Política de retención con eliminación automática programada | [Nombre] | [Implementada/En progreso/Planificada] |

### 4.2 Medidas organizacionales / Organizational measures

| Medida | Descripción | Estado |
|---|---|---|
| Oficial de protección de datos | Designación de responsable de cumplimiento de Ley 29733 | [Implementada/En progreso/Planificada] |
| Capacitación del personal | Entrenamiento sobre tratamiento de datos personales con IA | [Implementada/En progreso/Planificada] |
| Procedimiento de respuesta a incidentes | Protocolo de notificación a ANPD en caso de brecha (72 horas) | [Implementada/En progreso/Planificada] |
| Evaluación periódica | Revisión de esta EIPD cada [6/12] meses o ante cambios significativos | [Implementada/En progreso/Planificada] |
| Registro ante ANPD | Inscripción del banco de datos en la ANPD | [Implementada/En progreso/Planificada] |

### 4.3 Medidas implementadas por CendiaGateway / CendiaGateway controls

Si la institución utiliza CendiaGateway™, las siguientes medidas técnicas están disponibles automáticamente:

| Control de CendiaGateway | Riesgos mitigados |
|---|---|
| **Detección automática de PII** — 10 tipos de datos sensibles identificados antes de procesamiento | R2, R4, R5 |
| **Registro inmutable** — cada interacción firmada con SHA-256 | R1, R3, R7 |
| **AI Manifest™** — artefacto de cumplimiento por interacción | R3, RR4, RR5 |
| **Despliegue soberano** — ningún dato sale del perímetro institucional | R4, R5 |
| **Políticas configurables** — bloqueo/redacción de contenido sensible | R2, R4, R8 |
| **Dashboard de monitoreo** — métricas en tiempo real de cumplimiento | RR1, RR4, RR5 |
| **Paquete de evidencia exportable** — listo para auditor o regulador | RR3, RR4, RR5 |

---

## 5. Riesgo Residual / Residual Risk

Después de aplicar las medidas de mitigación:

| Riesgo | Nivel original | Nivel residual | ¿Aceptable? |
|---|---|---|---|
| R1 | [Nivel] | [Nivel] | [Sí/No] |
| R2 | [Nivel] | [Nivel] | [Sí/No] |
| R3 | [Nivel] | [Nivel] | [Sí/No] |
| R4 | [Nivel] | [Nivel] | [Sí/No] |
| R5 | [Nivel] | [Nivel] | [Sí/No] |
| R6 | [Nivel] | [Nivel] | [Sí/No] |
| R7 | [Nivel] | [Nivel] | [Sí/No] |
| R8 | [Nivel] | [Nivel] | [Sí/No] |

Si algún riesgo residual no es aceptable, se requiere consulta previa a la Autoridad Nacional de Protección de Datos Personales (ANPD) conforme al Art. 35 del Reglamento de la Ley 29733.

---

## 6. Consulta a Partes Interesadas / Stakeholder Consultation

| Parte interesada | Consultada | Fecha | Observaciones |
|---|---|---|---|
| Titular(es) de datos / representantes | [Sí/No] | [Fecha] | [Observaciones] |
| Oficial de protección de datos | [Sí/No] | [Fecha] | [Observaciones] |
| Área legal | [Sí/No] | [Fecha] | [Observaciones] |
| Área de tecnología | [Sí/No] | [Fecha] | [Observaciones] |
| Área de cumplimiento normativo | [Sí/No] | [Fecha] | [Observaciones] |
| ANPD (si riesgo residual alto) | [Sí/No] | [Fecha] | [Observaciones] |

---

## 7. Decisión y Aprobación / Decision and Approval

### Decisión

- [ ] **Proceder** — riesgos residuales aceptables con medidas de mitigación implementadas
- [ ] **Proceder con condiciones** — implementar medidas adicionales antes de [fecha]
- [ ] **No proceder** — riesgos residuales inaceptables; requiere rediseño del sistema
- [ ] **Consulta previa a ANPD** — riesgo residual alto requiere autorización regulatoria

### Aprobaciones

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| Responsable del sistema de IA | | | |
| Oficial de protección de datos | | | |
| Gerente de cumplimiento | | | |
| Gerente general / Director | | | |

---

## 8. Revisión y Actualización / Review and Update

| Evento | Acción requerida |
|---|---|
| Cambio significativo en el sistema de IA | Actualizar esta EIPD |
| Cambio en la base legal del tratamiento | Actualizar sección 1.1 y 2 |
| Incidente de seguridad de datos | Actualizar evaluación de riesgos (sección 3) |
| Cada [6/12] meses | Revisión periódica completa |
| Cambio regulatorio (Ley 29733, Ley 31814, DS 115-2025-PCM) | Actualizar riesgos regulatorios (sección 3.2) |

---

## Referencias Legales / Legal References

- **Ley 29733** — Ley de Protección de Datos Personales (2011, actualizada 2025)
- **DS N° 003-2013-JUS** — Reglamento de la Ley 29733
- **Ley 31814** — Ley que promueve el uso de la Inteligencia Artificial en favor del desarrollo económico y social del país (2023)
- **DS N° 115-2025-PCM** — Adopción de ISO/IEC 42001:2023 como estándar de gobernanza de IA
- **Directiva de Seguridad de la ANPD** — Medidas de seguridad para tratamiento de datos personales

---

*Plantilla preparada por Datacendia, LLC — para uso de instituciones que operan CendiaGateway™*  
*Versión 1.0 — Marzo 2026*
