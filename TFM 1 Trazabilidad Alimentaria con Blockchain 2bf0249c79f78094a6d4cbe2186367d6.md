# TFM 1: Trazabilidad Alimentaria con Blockchain

## Sistema de Trazabilidad para Cadenas Alimentarias desde Origen hasta Exportación

**Máster en Blockchain · Trabajo Final de Máster**

---

## Índice de Contenidos

1. Descripción del Proyecto TFM
2. Contexto del Sector Alimentario
3. Problemas Reales a Resolver
4. Aspectos Clave del TFM
5. Componentes Recomendados del MVP
6. Proyecto de Referencia: GrainChain
7. Datos del Proyecto GrainChain
8. Tecnologías y Modelo de Negocio
9. Cómo Inspirarse sin Copiar

---

## 1. Descripción del Proyecto TFM

**Título provisional:** "Sistema Blockchain para la Trazabilidad Alimentaria desde Origen hasta Exportación"

El estudiante deberá diseñar y construir un sistema completo de trazabilidad alimentaria aplicando tecnologías blockchain o DLT. El objetivo es crear un MVP (Producto Mínimo Viable) que permita registrar y verificar cada etapa de la cadena alimentaria, desde la producción hasta la exportación o venta final.

### Objetivo Formativo

Desarrollar un MVP funcional que permita registrar y verificar las siguientes etapas:

- **Producción:** registro del origen, finca, lote, fecha de cosecha
- **Procesamiento:** transformación del producto (secado, tostado, empaquetado)
- **Transporte:** movimientos logísticos entre ubicaciones
- **Almacenamiento:** registro en silos, bodegas o centros de distribución
- **Exportación/Venta:** entrega al comprador final o exportador

### Resultado Esperado

Un sistema que permita visualizar en un dashboard la historia completa del lote alimentario, garantizando:

- **Integridad:** Los datos no pueden ser alterados una vez registrados
- **Transparencia:** Cualquier actor autorizado puede consultar el historial
- **Verificabilidad:** Certificados y documentos pueden ser validados on-chain

---

## 2. Contexto del Sector Alimentario

La trazabilidad alimentaria es uno de los campos donde más impacto ha tenido blockchain en los últimos años. La certificación de origen, el control de lotes y la prevención de adulteraciones son fundamentales para:

- Garantizar la seguridad alimentaria
- Cumplir con regulaciones sanitarias internacionales
- Facilitar exportaciones con documentación verificable
- Generar confianza en consumidores y compradores
- Permitir el retiro rápido de productos en caso de alertas sanitarias

### Productos Aplicables

Este tipo de sistema se puede aplicar a múltiples productos:

| **Agrícolas** | **Pecuarios** | **Marinos** |
| --- | --- | --- |
| Café | Carne | Pesca |
| Cacao | Pollo | Mariscos |
| Granos | Lácteos | Acuicultura |
| Frutas | Huevos |  |
| Verduras | Miel |  |
| Vino |  |  |
| Aceite de oliva |  |  |

---

## 3. Problemas Reales a Resolver

Los sistemas tradicionales de trazabilidad alimentaria presentan múltiples deficiencias que blockchain puede resolver:

### Fraude Alimentario

Productos mezclados, adulterados o con origen falso. Según estimaciones, el fraude alimentario representa pérdidas de hasta 40 mil millones de dólares anuales a nivel global.

### Falta de Transparencia

Imposibilidad de verificar el origen real de los productos, especialmente en exportaciones donde intervienen múltiples intermediarios.

### Documentación Manual y Dispersa

Certificados en papel que se pierden, se falsifican o no están disponibles cuando se necesitan. Cada actor mantiene sus propios registros sin sincronización.

### Pérdida o Falsificación de Certificados

Certificados sanitarios, de calidad o de comercio justo que pueden ser alterados o duplicados sin forma de verificación efectiva.

### Retiros de Mercado Ineficientes

En caso de alerta sanitaria, es imposible seguir un lote específico y retirarlo rápidamente del mercado. Esto resulta en retiros masivos innecesarios y pérdidas económicas.

### Pagos Lentos o Injustos

Los productores suelen recibir pagos tardíos o por debajo del valor real de su producción, sin transparencia en el proceso de liquidación.

---

## 4. Aspectos Clave a Tener en Cuenta en el TFM

Un trabajo final de máster robusto en trazabilidad alimentaria debe cubrir los siguientes aspectos técnicos y funcionales:

### 1. Identificación Única del Lote

Cada lote debe tener un identificador único e inmutable. Puede ser:

- Código QR
- Hash criptográfico
- NFT (Non-Fungible Token)
- ID compuesto (país-región-productor-lote-año)

### 2. Eventos de la Cadena Alimentaria

Definir claramente los eventos críticos que deben registrarse on-chain:

- Cosecha → transformación → transporte → empaquetado → exportación
- Cada evento debe incluir: timestamp, ubicación, actor responsable, estado del lote

### 3. Certificaciones

Incorporar certificados verificables:

- Sanidad (control de calidad, análisis de laboratorio)
- Calidad (grado del producto, clasificación)
- Origen (certificación geográfica)
- Comercio justo / Sostenibilidad

### 4. Roles y Permisos

Definir claramente los actores y sus permisos:

- **Productor:** puede crear lotes
- **Procesador:** puede registrar transformaciones
- **Transportista:** puede registrar movimientos
- **Autoridad:** puede emitir certificados
- **Auditor:** solo lectura

### 5. Auditoría Inmutable

Todo cambio debe quedar registrado de forma permanente. El smart contract debe emitir eventos que no puedan ser modificados posteriormente.

### 6. Dashboard Visual

La interfaz de usuario es fundamental. Debe mostrar:

- Timeline del ciclo de vida del lote
- Mapa de ubicaciones
- Certificados adjuntos
- Estado actual del lote

---

## 5. Componentes Recomendados del MVP

### 5.1. Smart Contract

El contrato inteligente debe incluir como mínimo las siguientes estructuras:

```solidity
// ⚠️ TU TAREA: Definir estos enums
enum BatchStatus { Created, InTransit, Processing, QualityCheck, Exported, Delivered }
enum ActorRole { None, Producer, Processor, Transporter, Exporter, Authority }
enum CertificateStatus { Valid, Expired, Revoked }

// ⚠️ TU TAREA: Implementar estos structs
struct Batch {
    uint256 id;
    address creator;
    string product;          // "Café Arábica", "Cacao", etc.
    string origin;           // Finca/ubicación de origen
    uint256 quantity;        // Cantidad en kg o unidades
    uint256 dateCreated;
    BatchStatus status;
    uint256[] certificateIds;
    uint256[] eventIds;      // Timeline de eventos
}

struct BatchEvent {
    uint256 id;
    uint256 batchId;
    string eventType;        // "Cosecha", "Secado", "Transporte", etc.
    address actor;
    string location;
    uint256 timestamp;
    string metadata;         // JSON con detalles adicionales
}

struct Certificate {
    uint256 id;
    uint256 batchId;
    string certificateType;  // "Sanitario", "Calidad", "Origen", etc.
    string issuer;
    string documentHash;     // Hash del PDF del certificado
    uint256 issuedDate;
    uint256 expiryDate;
    CertificateStatus status;
}

struct Actor {
    address actorAddress;
    string name;
    ActorRole role;
    string location;
    bool isActive;
}

// Variables de estado
address public admin;
uint256 public nextBatchId = 1;
uint256 public nextEventId = 1;
uint256 public nextCertificateId = 1;

// Mappings
mapping(uint256 => Batch) public batches;
mapping(uint256 => BatchEvent) public batchEvents;
mapping(uint256 => Certificate) public certificates;
mapping(address => Actor) public actors;

// Eventos
event BatchCreated(uint256 indexed batchId, address indexed creator, string product, string origin);
event BatchEventRecorded(uint256 indexed eventId, uint256 indexed batchId, string eventType, address actor);
event BatchStatusChanged(uint256 indexed batchId, BatchStatus newStatus);
event CertificateIssued(uint256 indexed certificateId, uint256 indexed batchId, string certificateType, string issuer);
event CertificateRevoked(uint256 indexed certificateId, string reason);
event ActorRegistered(address indexed actorAddress, string name, ActorRole role);

// ⚠️ TU TAREA: Programar estas funciones principales

// Gestión de Actores
function registerActor(string memory _name, ActorRole _role, string memory _location) public;
function getActor(address _actorAddress) public view returns (Actor memory);
function deactivateActor(address _actorAddress) public;

// Gestión de Lotes
function createBatch(string memory _product, string memory _origin, uint256 _quantity) public returns (uint256);
function getBatch(uint256 _batchId) public view returns (Batch memory);
function updateBatchStatus(uint256 _batchId, BatchStatus _newStatus) public;
function getBatchTimeline(uint256 _batchId) public view returns (BatchEvent[] memory);

// Gestión de Eventos
function recordEvent(uint256 _batchId, string memory _eventType, string memory _location, string memory _metadata) public returns (uint256);
function getEvent(uint256 _eventId) public view returns (BatchEvent memory);

// Gestión de Certificados
function issueCertificate(uint256 _batchId, string memory _certType, string memory _issuer, string memory _docHash, uint256 _expiryDate) public returns (uint256);
function revokeCertificate(uint256 _certificateId, string memory _reason) public;
function verifyCertificate(uint256 _certificateId) public view returns (bool isValid);
function getCertificate(uint256 _certificateId) public view returns (Certificate memory);

// Funciones auxiliares
function getActorBatches(address _actor) public view returns (uint256[] memory);
function getBatchCertificates(uint256 _batchId) public view returns (uint256[] memory);

```

### 5.2. Modelo de Datos

Estructura JSON recomendada para cada evento:

```json
{
  "batchId": "LOTE-001",
  "product": "Café Arábica",
  "origin": "Finca El Roble",
  "event": "Secado",
  "timestamp": 1710002212,
  "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
}

```

### 5.3. Tests Recomendados (sc/test/FoodTraceability.t.sol)

```solidity
// ⚠️ TU TAREA: Escribir y hacer pasar estos tests
contract FoodTraceabilityTest is Test {
    // Setup y configuración inicial
    function setUp() public { }

    // Tests de gestión de actores
    function testRegisterProducer() public { }
    function testRegisterProcessor() public { }
    function testRegisterTransporter() public { }
    function testGetActor() public { }
    function testDeactivateActor() public { }
    function testOnlyAdminCanDeactivateActors() public { }

    // Tests de creación de lotes
    function testCreateBatch() public { }
    function testCreateBatchOnlyByProducer() public { }
    function testBatchIdIncrementation() public { }
    function testGetBatch() public { }
    function testBatchInitialStatus() public { }

    // Tests de eventos del lote
    function testRecordHarvestEvent() public { }
    function testRecordProcessingEvent() public { }
    function testRecordTransportEvent() public { }
    function testRecordExportEvent() public { }
    function testGetBatchTimeline() public { }
    function testEventIdIncrementation() public { }

    // Tests de actualización de estado
    function testUpdateBatchStatusToInTransit() public { }
    function testUpdateBatchStatusToProcessing() public { }
    function testUpdateBatchStatusToExported() public { }
    function testStatusUpdateEmitsEvent() public { }

    // Tests de certificados
    function testIssueSanitaryCertificate() public { }
    function testIssueQualityCertificate() public { }
    function testIssueOriginCertificate() public { }
    function testOnlyAuthorityCanIssueCertificates() public { }
    function testRevokeCertificate() public { }
    function testVerifyValidCertificate() public { }
    function testVerifyRevokedCertificate() public { }
    function testVerifyExpiredCertificate() public { }
    function testGetBatchCertificates() public { }

    // Tests de validaciones y permisos
    function testInactiveActorCannotCreateBatch() public { }
    function testCannotUpdateNonExistentBatch() public { }
    function testCannotIssueOCertificateForNonExistentBatch() public { }
    function testCannotRecordEventForNonExistentBatch() public { }

    // Tests de casos edge
    function testCreateBatchWithZeroQuantity() public { }
    function testRecordEventWithEmptyMetadata() public { }
    function testMultipleCertificatesForSameBatch() public { }
    function testBatchTimelineOrder() public { }

    // Tests de flujo completo
    function testCompleteSupplyChainFlow() public { }
    function testCoffeeBeanToExportFlow() public { }
    function testTraceabilityFromOriginToExport() public { }
}
```

### 5.4. Arquitectura Recomendada

Componentes técnicos sugeridos:

- **Blockchain:** EVM
- **Backend:** Node.js / Python
- **Base de datos:** SQLite / MongoDB
- **Frontend:** React / HTML+JavaScript
- **Smart Contracts:** Solidity
- **Almacenamiento:** IPFS para PDFs de certificados

---

## 6. Proyecto de Referencia: GrainChain

### 6.1. ¿Qué es GrainChain?

GrainChain es una plataforma de trazabilidad agrícola que conecta productores, acopiadores, procesadores y exportadores usando smart contracts y pagos digitales integrados. Permite digitalizar completamente la cadena de suministro de productos agrícolas, especialmente granos, café y cacao.

### 6.2. Enlaces Oficiales

- 🌐 **Sitio web:** [https://www.grainchain.io](https://www.grainchain.io/)
- 🐦 **Twitter/X:** [https://x.com/GrainChainIO](https://x.com/GrainChainIO)

### 6.3. Problema que Resuelve

GrainChain aborda múltiples problemas críticos del sector agrícola:

- **Pagos lentos o injustos al productor:** Los agricultores reciben pagos con retrasos de semanas o meses
- **Falta de datos unificados:** Cada actor mantiene registros separados sin sincronización
- **Disputas por calidad o peso:** Sin registro digital verificable de mediciones
- **Escasa trazabilidad:** Imposibilidad de seguir un lote desde el silo hasta la exportación

### 6.4. Cómo lo Resuelve

La solución de GrainChain incluye:

- **Lotes con ID único:** Cada cosecha recibe un identificador digital inmutable
- **Registros on-chain:** Producción, procesos y calidad se registran en blockchain
- **Smart contracts para pagos:** Pagos automáticos según condiciones predefinidas
- **Dashboard unificado:** Productores y compradores ven el mismo registro de datos
- **IoT integrado:** Básculas y sensores capturan datos de peso y calidad automáticamente

---

## 7. Datos del Proyecto GrainChain

### 7.1. Países Latinoamericanos donde Opera

GrainChain tiene presencia directa y proyectos documentados en:

- **México:** Digitalización de cadenas de maíz, sorgo y granos
- **Honduras:** Trazabilidad de café y cacao con cooperativas locales
- **Costa Rica:** Pilotos con productores de café
- **Guatemala:** Expansiones exploratorias y pilotos vinculados al café

### 7.2. Datos Económicos y de Escala

Información financiera y operativa de GrainChain:

- **Financiación acumulada:** 40-43 millones de dólares en varias rondas
- **Ronda más reciente:** 29 millones de dólares en 2023 para expansión en EE.UU. y América Latina
- **Inversión adicional 2025:** 3 millones de dólares para seguir escalando
- **Volumen procesado:** Más de 22.500 millones de libras de commodities
- **Participantes:** Más de 18.000 usuarios activos en la plataforma
- **Productos soportados:** 24 tipos de materias primas agrícolas

---

## 8. Tecnologías y Modelo de Negocio

### 8.1. Stack Tecnológico Utilizado

Aunque GrainChain no publica todos los detalles técnicos, se sabe públicamente que utiliza:

- **Blockchain permissioned:** Hyperledger Fabric o Quorum, según los despliegues
- **IoT para pesaje:** Básculas conectadas y sensores de análisis de calidad
- **Smart contracts:** Contratos de compra automatizados con condiciones verificables
- **Apps móviles offline:** Permiten registrar datos en zonas rurales sin conexión
- **Dashboard web:** Interfaz para productores, acopiadores y compradores

### 8.2. Modelo de Negocio

GrainChain genera ingresos a través de:

- **Suscripciones:** Planes mensuales o anuales para empresas
- **Comisiones por transacción:** Pequeño porcentaje en pagos procesados
- **Servicios financieros:** Adelantos de pago y crédito a productores
- **Consultoría e implementación:** Despliegues personalizados para grandes empresas

---

## 9. Cómo Inspirarse sin Copiar

**IMPORTANTE:** El objetivo de este TFM NO es copiar GrainChain, sino usar su modelo como inspiración para crear tu propia versión adaptada a un producto alimentario específico.

### 9.1. Lo que DEBES Hacer

- **Elegir tu propio producto:** No tiene que ser café o grano. Puede ser cacao, frutas, aceite de oliva, vino, pesca, carne, etc.
- **Adaptar el flujo:** Los eventos de un lote de café son diferentes a los de un lote de pesca o aceite de oliva
- **Definir tu propio modelo de datos:** Qué información específica necesitas registrar para TU producto
- **Identificar tus actores:** Quiénes son los participantes en TU cadena de suministro
- **Diseñar tu propia UI/UX:** El dashboard debe reflejar las necesidades de tu caso de uso

### 9.2. Lo que NO DEBES Hacer

- ❌ Copiar el código de GrainChain (no es open source)
- ❌ Usar exactamente los mismos nombres de funciones y variables
- ❌ Replicar su modelo de negocio sin adaptación
- ❌ Presentar tu TFM como "GrainChain pero con otro nombre"

### 9.3. Ejemplo de Adaptación

**Caso original (GrainChain):**

```
Trazabilidad de café: Finca → Silo → Procesadora → Exportador → Puerto

```

**Tu adaptación (ejemplo con aceite de oliva):**

```
Trazabilidad de aceite de oliva: Olivar → Almazara → Envasado → Distribuidor → Retail

```

**Tu adaptación (ejemplo con pesca):**

```
Trazabilidad de pesca: Barco pesquero → Puerto de descarga → Subasta → Procesadora → Supermercado

```