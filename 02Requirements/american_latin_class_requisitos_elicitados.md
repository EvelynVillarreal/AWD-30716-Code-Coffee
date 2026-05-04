# American Latin Class — Requisitos elicitados y contexto funcional inicial

> Documento base analizado: **Propuesta de Sistema Web Multi-sede** (17 Feb 2026).  
> Este archivo transforma la propuesta comercial en un **contexto de producto** y en una **primera versión de requisitos elicitados** para trabajar con agentes de IA y para usar como base del levantamiento detallado.

---

## 1. Propósito de este documento

Este documento resume, ordena y convierte en requisitos de software el contenido del PDF de propuesta para **American Latin Class**, con el fin de:

- dar contexto completo del sistema que se quiere construir;
- dejar claro **a dónde se quiere llegar**;
- separar lo ya definido de lo que aún falta validar;
- servir como base para construir el sistema **paso a paso**.

---

## 2. Contexto del negocio

American Latin Class opera con un esquema **multi-sede** y un modelo mixto de negocio:

- **Academia**: gestión de alumnos, clases, asistencia, mensualidades, becas y operación por sede.
- **Agencia**: gestión de contratos, clientes, montos, comisiones, cobros y liquidaciones.

Las sedes mencionadas en la propuesta son:

- Matriz
- Norte
- Quitumbe
- Conocoto
- Tumbaco

### Problemas actuales identificados

La propuesta deja ver que hoy existen estos problemas operativos:

1. No existe una fuente única de verdad sobre alumnos activos por sede.
2. Mensualidades, becas y atrasos no se controlan de forma estándar.
3. Los ingresos y egresos por sede se registran con criterios distintos.
4. Los porcentajes y sueldos se calculan manualmente.
5. La asistencia no tiene evidencia consistente.
6. El área de agencia no tiene trazabilidad suficiente en comisiones, pagos y estados.

### Consecuencias de negocio

- pérdida de control operativo;
- dificultad para auditar;
- fugas por registros incompletos o descuentos no autorizados;
- morosidad poco visible;
- tensiones internas por falta de trazabilidad;
- dificultad para comparar rentabilidad y desempeño entre sedes.

---

## 3. Visión del sistema

Se desea construir una **plataforma web centralizada multi-sede** para control operativo, financiero y escalamiento, capaz de:

- centralizar la operación de todas las sedes;
- mostrar indicadores en tiempo real por sede y a nivel consolidado;
- controlar alumnos, clases, pagos, becas, asistencia, ingresos, egresos y cartera;
- automatizar cálculos de comisiones, porcentajes y liquidaciones;
- incluir el módulo de agencia para contratos y comisiones;
- sostener el crecimiento futuro del negocio con trazabilidad y control.

---

## 4. Objetivos del producto

### Objetivo general

Implementar una plataforma web multi-sede que centralice la operación y entregue indicadores de desempeño para mejorar control, transparencia y escalamiento.

### Objetivos específicos

1. Centralizar alumnos, niveles/clases, asistencia y estado financiero por alumno.
2. Automatizar la generación y seguimiento de mensualidades.
3. Controlar ingresos y egresos por sede y de forma consolidada.
4. Configurar reglas de sueldos y porcentajes para liquidaciones auditables.
5. Gestionar contratos de agencia y comisiones con trazabilidad de pagos.

---

## 5. Alcance funcional del sistema

El sistema se plantea con los siguientes módulos principales:

1. Multi-sede y roles
2. Gestión de alumnos
3. Mensualidades y cartera
4. Asistencia con evidencia
5. Finanzas por sede
6. Sueldos y porcentajes
7. Agencia de bailarines
8. Tablero ejecutivo

---

## 6. Requisitos funcionales elicitados

> **Importante:** los siguientes requisitos fueron redactados a partir del PDF.  
> Son una **primera elicitación estructurada**, no una especificación cerrada.  
> Donde la propuesta no entra en detalle, se deja indicado como **pendiente de validación**.

### 6.1. Multi-sede y roles

#### RF-001. Registro de sedes
El sistema debe permitir registrar y administrar múltiples sedes de American Latin Class.

#### RF-002. Catálogo inicial de sedes
El sistema debe contemplar, como mínimo, las sedes: Matriz, Norte, Quitumbe, Conocoto y Tumbaco.

#### RF-003. Asociación por sede
El sistema debe permitir asociar alumnos, clases, ingresos, egresos, asistencias y usuarios a una sede.

#### RF-004. Usuarios del sistema
El sistema debe permitir crear y administrar usuarios internos.

#### RF-005. Roles y permisos
El sistema debe manejar roles y permisos para controlar el acceso a módulos, acciones y datos.

#### RF-006. Restricción por sede
El sistema debe poder limitar la visibilidad y operación de un usuario según una o varias sedes autorizadas.

#### RF-007. Auditoría de cambios
El sistema debe registrar una bitácora de cambios y acciones relevantes realizadas por los usuarios.

#### RF-008. Trazabilidad de operación
El sistema debe permitir que dirección pueda revisar la trazabilidad de acciones realizadas dentro del sistema.

**Pendientes por validar en este módulo**
- matriz exacta de roles;
- permisos por acción;
- si existe rol superadmin;
- si un usuario puede pertenecer a varias sedes.

---

### 6.2. Gestión de alumnos

#### RF-009. Ficha de alumno
El sistema debe permitir crear y mantener una ficha individual por alumno.

#### RF-010. Datos de contacto
La ficha del alumno debe incluir información de contacto.

#### RF-011. Estado del alumno
El sistema debe permitir marcar el estado del alumno como activo o inactivo.

#### RF-012. Historial del alumno
El sistema debe conservar el historial del alumno.

#### RF-013. Asignación a sede
El sistema debe permitir asignar cada alumno a una sede.

#### RF-014. Asignación a clase o nivel
El sistema debe permitir asignar cada alumno a una clase, nivel o grupo correspondiente.

#### RF-015. Becas y convenios
El sistema debe permitir registrar si un alumno tiene beca o convenio.

#### RF-016. Estado financiero por alumno
El sistema debe mostrar el estado financiero de cada alumno.

#### RF-017. Control de alumnos activos por sede
El sistema debe poder identificar cuántos alumnos activos existen por sede y en consolidado general.

#### RF-018. Prevención de duplicados
El sistema debe ayudar a evitar registros duplicados de alumnos.

**Pendientes por validar en este módulo**
- campos exactos de la ficha del alumno;
- definición exacta de “historial”;
- reglas para cambio de sede;
- si un alumno puede asistir a varias sedes;
- si el alumno puede estar en varias clases activas al mismo tiempo.

---

### 6.3. Mensualidades y cartera

#### RF-019. Planes y promociones
El sistema debe permitir administrar planes y promociones de pago.

#### RF-020. Generación de mensualidades
El sistema debe permitir generar y llevar seguimiento de mensualidades por alumno.

#### RF-021. Registro de pagos
El sistema debe permitir registrar pagos realizados por los alumnos.

#### RF-022. Clasificación del estado de pago
El sistema debe clasificar el estado de pago del alumno al menos en:
- al día;
- atrasado;
- becado/convenio.

#### RF-023. Control de mora
El sistema debe identificar y dar seguimiento a alumnos con mora.

#### RF-024. Recibos
El sistema debe permitir emitir o registrar recibos asociados a pagos.

#### RF-025. Reportes de caja
El sistema debe generar reportes de caja relacionados con pagos recibidos.

#### RF-026. Trazabilidad de descuentos
El sistema debe permitir distinguir y controlar becas, convenios, promociones y posibles descuentos aplicados.

#### RF-027. Cartera por sede
El sistema debe mostrar la cartera por sede.

#### RF-028. Cartera consolidada
El sistema debe mostrar la cartera consolidada de todas las sedes.

#### RF-029. Seguimiento financiero por alumno
El sistema debe permitir consultar el historial de pagos y deuda de cada alumno.

**Pendientes por validar en este módulo**
- frecuencia exacta de cobro;
- reglas de vencimiento;
- manejo de pagos parciales;
- manejo de recargos o intereses;
- formato legal/fiscal del recibo;
- flujos de anulación o reverso de pagos.

---

### 6.4. Asistencia con evidencia

#### RF-030. Registro de asistencia
El sistema debe permitir registrar asistencia por clase.

#### RF-031. Asistencia por sede
El sistema debe permitir registrar asistencia vinculada a una sede.

#### RF-032. Asistencia por profesor
El sistema debe permitir registrar asistencia vinculada a un profesor o responsable de la sesión.

#### RF-033. Evidencia de asistencia
El sistema debe validar la asistencia mediante algún mecanismo de evidencia.

#### RF-034. Mecanismo de validación
El sistema debe soportar al menos una modalidad de validación por sesión, por ejemplo QR o código.

#### RF-035. Reportes de asistencia
El sistema debe generar reportes de asistencia.

#### RF-036. Alertas de asistencia
El sistema debe generar alertas relacionadas con asistencia.

#### RF-037. Seguimiento académico
El sistema debe aportar información para seguimiento, retención y cumplimiento académico.

**Pendientes por validar en este módulo**
- si la asistencia la registra el alumno, el profesor o ambos;
- tiempo de validez del QR/código;
- manejo de llegadas tardías;
- política de justificaciones;
- reglas que disparan alertas.

---

### 6.5. Finanzas por sede

#### RF-038. Registro de ingresos
El sistema debe permitir registrar ingresos por sede.

#### RF-039. Registro de egresos
El sistema debe permitir registrar egresos por sede.

#### RF-040. Categorización financiera
El sistema debe permitir categorizar ingresos y egresos.

#### RF-041. Reporte de rendimiento por sede
El sistema debe generar reportes de rendimiento por sede.

#### RF-042. Reporte comparativo entre sedes
El sistema debe permitir comparar desempeño financiero entre sedes.

#### RF-043. Márgenes y tendencias
El sistema debe mostrar márgenes y tendencias financieras por sede.

#### RF-044. Consolidado general
El sistema debe generar una vista financiera consolidada de todas las sedes.

#### RF-045. Caja diaria por sede
El sistema debe soportar el registro y control de caja diaria por sede.

#### RF-046. Conciliación simple de caja
El sistema debe permitir conciliación simple entre ingresos registrados y recibos.

**Pendientes por validar en este módulo**
- catálogo exacto de categorías;
- periodicidad de cierres;
- si habrá apertura/cierre de caja por turno;
- aprobación de egresos;
- relación con contabilidad externa.

---

### 6.6. Sueldos y porcentajes

#### RF-047. Motor de reglas
El sistema debe incluir un motor de reglas configurables para cálculo de sueldos, porcentajes o comisiones.

#### RF-048. Perfiles de liquidación
El sistema debe soportar liquidaciones para al menos estos perfiles:
- directores;
- profesores;
- comunicación.

#### RF-049. Configuración de reglas
El sistema debe permitir parametrizar reglas de cálculo sin depender de cálculo manual externo.

#### RF-050. Liquidaciones auditables
El sistema debe generar liquidaciones con respaldo auditable.

#### RF-051. Historial de liquidaciones
El sistema debe conservar historial de liquidaciones realizadas.

#### RF-052. Transparencia del cálculo
El sistema debe permitir revisar cómo se obtuvo cada valor liquidado.

**Pendientes por validar en este módulo**
- fórmula exacta por perfil;
- periodicidad de liquidación;
- si el cálculo usa asistencia, alumnos, ingresos u otros factores;
- reglas de excepciones;
- aprobaciones requeridas antes del pago.

---

### 6.7. Agencia de bailarines

#### RF-053. Registro de contratos
El sistema debe permitir registrar contratos del módulo de agencia.

#### RF-054. Registro de clientes
El sistema debe permitir registrar clientes asociados a contratos o servicios.

#### RF-055. Registro de montos
El sistema debe permitir registrar montos económicos asociados a contratos.

#### RF-056. Comisiones de agencia
El sistema debe permitir calcular o registrar comisiones relacionadas con contratos de agencia.

#### RF-057. Estado de cobro
El sistema debe permitir gestionar estados de cobro.

#### RF-058. Liquidación de agencia
El sistema debe permitir registrar o generar liquidaciones asociadas a contratos/comisiones.

#### RF-059. Trazabilidad de pagos
El sistema debe permitir rastrear pagos y comisiones dentro del módulo de agencia.

**Pendientes por validar en este módulo**
- ciclo de vida exacto del contrato;
- estados del contrato y del cobro;
- actores involucrados;
- forma de cálculo de comisión;
- relación entre agencia y sedes;
- evidencia documental y archivos adjuntos.

---

### 6.8. Tablero ejecutivo

#### RF-060. Dashboard ejecutivo
El sistema debe contar con un tablero ejecutivo para dirección.

#### RF-061. KPI de alumnos activos
El tablero debe mostrar alumnos activos por sede y consolidado.

#### RF-062. KPI de morosidad
El tablero debe mostrar morosidad.

#### RF-063. KPI de ingresos y egresos
El tablero debe mostrar ingresos y egresos.

#### RF-064. KPI de becas
El tablero debe mostrar información sobre becas y/o convenios.

#### RF-065. KPI de asistencia
El tablero debe mostrar indicadores de asistencia.

#### RF-066. KPI de retención
El tablero debe mostrar indicadores de retención.

#### RF-067. Comparativos por sede
El tablero debe permitir comparativos entre sedes.

#### RF-068. Visibilidad en tiempo real
El sistema debe ofrecer visibilidad actualizada de indicadores operativos y financieros.

**Pendientes por validar en este módulo**
- definición exacta de cada KPI;
- frecuencia de actualización;
- filtros del dashboard;
- exportación o descarga;
- metas, semáforos o alertas visuales.

---

## 7. Requisitos no funcionales elicitados

### RNF-001. Seguridad
El sistema debe contar con autenticación de usuarios.

### RNF-002. Control de acceso
El sistema debe aplicar acceso basado en roles.

### RNF-003. Bitácora
El sistema debe registrar acciones relevantes en una bitácora.

### RNF-004. Respaldo
El sistema debe contar con respaldos automáticos.

### RNF-005. Acceso multiplataforma
El sistema debe ser accesible desde PC y dispositivos móviles.

### RNF-006. Diseño responsive
La interfaz debe adaptarse a distintos tamaños de pantalla.

### RNF-007. Integridad de datos
El sistema debe validar pagos, becas y duplicados para proteger la consistencia de la información.

### RNF-008. Control por sede
El sistema debe preservar la integridad de la información considerando la sede a la que pertenece cada dato.

### RNF-009. Escalabilidad funcional
El sistema debe estar preparado para crecer en número de sedes, alumnos y módulos.

### RNF-010. Disponibilidad operativa
El sistema debe sostener una operación diaria confiable para múltiples sedes.

### RNF-011. Seguridad operativa recomendada
La solución debería desplegarse con SSL, control de acceso por roles y backups automáticos desde el inicio.

**Pendientes por validar en no funcionales**
- tiempos máximos de respuesta;
- objetivos de disponibilidad;
- RPO/RTO de backups;
- requisitos de rendimiento por volumen;
- cifrado de datos sensibles;
- logs técnicos y monitoreo.

---

## 8. Reglas de negocio inferidas del documento

> Estas reglas fueron inferidas directamente de la propuesta y deben ser tratadas como **reglas preliminares**, sujetas a confirmación con dirección.

### RB-001. Política de becas/convenios
Debe existir una política para definir:
- quién aprueba la beca o convenio;
- por cuánto tiempo aplica;
- qué evidencia la respalda.

### RB-002. Cierre de caja diario
Cada sede debe realizar un cierre de caja diario.

### RB-003. Conciliación mínima
El cierre de caja debe conciliar, al menos, ingresos contra recibos.

### RB-004. Parametrización de comisiones
Las comisiones y porcentajes no deben depender de cálculo manual externo; deben quedar definidas en reglas del sistema.

### RB-005. Auditoría visible
La dirección debe poder consultar bitácoras y reportes descargables de auditoría.

### RB-006. Fuente única de verdad
La plataforma debe actuar como fuente única de verdad para alumnos, pagos, asistencia y finanzas operativas.

---

## 9. Alcance sugerido por fases

### Fase 1 — MVP de control operativo
Incluye, según la propuesta:

- alumnos;
- mensualidades;
- asistencia;
- multi-sede;
- dashboard básico.

### Fase 2 — Financiero multi-sede
Incluye adicionalmente:

- finanzas por sede;
- sueldos y porcentajes;
- reportes avanzados.

### Fase 3 — Enterprise academia + agencia + pagos
Incluye adicionalmente:

- módulo de agencia;
- integraciones de pago;
- automatizaciones y analítica.

---

## 10. Actores identificados o implícitos

### Actores explícitos o muy probables
- Dirección general
- Responsables o directores de sede
- Profesores
- Personal de comunicación
- Personal administrativo / caja

### Actores implícitos
- Alumno
- Cliente de agencia
- Bailarín gestionado por agencia

**Pendiente por validar**
- catálogo final de actores y responsabilidades exactas.

---

## 11. Datos maestros principales sugeridos

A partir del documento, las entidades principales que probablemente existirán son:

- Sede
- Usuario
- Rol
- Permiso
- Alumno
- Clase
- Nivel
- Asistencia
- Sesión
- Plan
- Promoción
- Mensualidad
- Pago
- Recibo
- Beca/Convenio
- Ingreso
- Egreso
- Categoría financiera
- Liquidación
- Regla de comisión / porcentaje
- Contrato de agencia
- Cliente
- Comisión de agencia
- Estado de cobro
- Bitácora

> Esto no sustituye el modelo de datos final; solo orienta el diseño inicial.

---

## 12. KPIs esperados del sistema

El documento sugiere que el sistema debe poder mostrar, como mínimo:

- alumnos activos;
- caja;
- cartera;
- rentabilidad;
- morosidad;
- ingresos;
- egresos;
- becas/convenios;
- asistencia;
- retención;
- comparativos por sede.

---

## 13. Restricciones y aclaraciones importantes

1. El PDF analizado es una **propuesta de preventa**, no una especificación funcional definitiva.
2. Los tiempos, costos y cronograma son referenciales.
3. La solución final debe ajustarse después de un levantamiento formal por sede.
4. La integración de pagos en línea es opcional y depende de definición posterior.
5. La arquitectura, base de datos, stack tecnológico e integraciones no quedan definidas en este PDF.

---

## 14. Vacíos de información que deberán levantarse después

Antes de construir el sistema completo, todavía hace falta validar:

### Operación académica
- estructura real de clases, niveles, grupos y horarios;
- proceso de inscripción;
- retiros, cambios y reingresos;
- reglas de asistencia.

### Finanzas
- flujo real de cobro;
- medios de pago;
- políticas de mora;
- categorías exactas de ingresos y egresos;
- cierres mensuales.

### Becas y convenios
- tipos de beca;
- aprobadores;
- restricciones;
- vencimientos.

### Sueldos y comisiones
- fórmulas exactas;
- periodicidad;
- aprobaciones;
- excepciones.

### Agencia
- flujo contractual;
- estados;
- participantes;
- soporte documental.

### Gobierno y seguridad
- roles exactos;
- permisos detallados;
- reglas de auditoría;
- retención de logs;
- políticas de respaldo.

---

## 15. Versión breve para dar contexto a otro agente de IA

American Latin Class necesita un sistema web multi-sede para centralizar la operación de sus sedes de academia y su módulo de agencia. El sistema debe unificar alumnos, clases, asistencias, mensualidades, becas, ingresos, egresos, cartera, sueldos, porcentajes, contratos y comisiones. Debe existir control por sede, roles y permisos, bitácora auditable, reportes, dashboard ejecutivo y escalabilidad. El MVP inicial se enfoca en multi-sede, alumnos, mensualidades, asistencia y dashboard básico; después se expandirá a finanzas, liquidaciones, agencia e integraciones de pago.

---

## 16. Recomendación para la siguiente etapa

La mejor continuación no es programar todo de una vez, sino seguir este orden:

1. validar actores y reglas de negocio;
2. definir alcance exacto del MVP;
3. modelar entidades y relaciones;
4. bajar cada módulo a historias de usuario o casos de uso;
5. recién después definir arquitectura técnica e implementación.

---

## 17. Fuente

Este documento fue elaborado a partir del PDF:
**Propuesta_Sistema_Multisede_American_Latin_Class.pdf**

