# TFM 3: Trazabilidad Industrial y Certificaciones con Blockchain

## Sistema de Verificación Industrial y Certificación para Procesos de Transformación

**Máster en Blockchain · Trabajo Final de Máster**

---

## Índice de Contenidos

1. Descripción del Proyecto TFM
2. Contexto del Sector Industrial
3. Problemas Reales a Resolver
4. Aspectos Clave del TFM
5. Componentes Recomendados del MVP
6. Proyecto de Referencia: TimberChain
7. Datos del Proyecto TimberChain
8. Tecnologías y Modelo de Negocio
9. Cómo Inspirarse sin Copiar

---

## 1. Descripción del Proyecto TFM

**Título provisional:** "Sistema de Verificación Industrial y Certificación Blockchain para Procesos de Transformación"

El alumno deberá desarrollar un MVP centrado en trazabilidad industrial, donde un producto pasa por múltiples procesos de transformación desde su materia prima hasta el producto final. El objetivo es registrar cada etapa industrial, las certificaciones asociadas y garantizar la verificabilidad de origen y sostenibilidad.

### Objetivo Formativo

Construir un modelo que registre:

- **Origen de materiales:** extracción, cultivo o producción de materia prima
- **Procesos de transformación:** corte, refinado, ensamblaje, tratamiento, etc.
- **Certificaciones:** PDF, auditorías, normas ISO, FSC, certificados de sostenibilidad
- **Transferencias entre plantas:** movimientos entre diferentes actores industriales
- **Producto final:** trazabilidad completa hasta el cliente

### Resultado Esperado

Un dashboard que muestre la "vida industrial del producto" y un smart contract que permita verificar certificaciones mediante hashes o NFT de documentos.

---

## 2. Contexto del Sector Industrial

Muchas industrias requieren demostrar de forma verificable:

- Origen de materiales y materias primas
- Procesos de transformación controlados
- Certificados de sostenibilidad y cumplimiento normativo
- Identidad del fabricante y trazabilidad entre plantas
- Auditorías de calidad y seguridad

### Sectores Aplicables

| **Sector** | **Ejemplos de Productos** |
| --- | --- |
| **Forestal** | Madera certificada, muebles, papel |
| **Textil** | Algodón orgánico, ropa sostenible, tejidos |
| **Metalúrgico** | Acero reciclado, aluminio, cobre |
| **Automotriz** | Componentes, piezas, ensamblaje |
| **Cosmética** | Productos de origen natural certificado |
| **Construcción** | Materiales sostenibles, cemento, vidrio |
| **Electrónica** | Semiconductores, componentes, baterías |

---

## 3. Problemas Reales a Resolver

### Documentación Falsificada

Certificados de origen, sostenibilidad o calidad que pueden ser alterados o duplicados sin forma efectiva de verificación.

### Falta de Trazabilidad de Origen

Imposibilidad de demostrar que un material proviene de fuentes legales o sostenibles (ej: madera legal, minerales de conflicto, algodón orgánico).

### Auditorías Manuales y Costosas

Procesos de certificación que requieren auditorías presenciales costosas, largas y repetitivas para cada actor de la cadena.

### Procesos Industriales Largos con Múltiples Actores

Un producto puede pasar por 5-10 plantas diferentes antes de llegar al consumidor final, sin registro unificado.

### Incapacidad de Verificar Certificaciones

Los compradores no pueden verificar de forma inmediata si un certificado FSC, ISO, o de sostenibilidad es legítimo.

### Cumplimiento Regulatorio Europeo

Nuevas regulaciones como la EU Deforestation Regulation (EUDR) exigen trazabilidad completa de productos forestales, agrícolas y ganaderos.

---

## 4. Aspectos Clave a Tener en Cuenta en el TFM

### 1. Gestión de Lotes Industriales

Flujo completo desde materia prima hasta producto final:

**Ejemplo:** Tronco → Tabla → Puerta → Mueble

Cada transformación debe quedar registrada con:

- Fecha y hora
- Planta/actor responsable
- Proceso aplicado
- Cantidad de material entrada/salida

### 2. Certificaciones Digitales

Incorporar verificación de certificados:

- **Hashes de PDFs:** Subir certificado PDF → calcular hash → almacenar hash on-chain
- **NFT de documentos:** Crear NFT que represente el certificado (transferible)
- **Metadatos verificables:** Emisor, fecha, vigencia, alcance
- **Revocación:** Capacidad de marcar certificados como revocados

### 3. Procesos de Transformación

Registrar claramente cada proceso industrial:

- **Sub-lotes:** Un lote puede dividirse en varios
- **Combinaciones:** Varios lotes pueden unirse en uno nuevo
- **Despiece:** Un producto puede generar múltiples componentes
- **Mermas:** Pérdidas normales del proceso industrial

### 4. Relación entre Plantas

Mapear la red de plantas industriales:

**Ejemplo:** Fábrica A (corte) → Fábrica B (tratamiento) → Fábrica C (ensamblaje)

### 5. Auditoría para Terceros

Permitir que entidades certificadoras:

- Consulten el historial completo
- Verifiquen certificados sin acceso privado
- Emitan nuevos certificados on-chain
- Revoquen certificados comprometidos

### 6. Cumplimiento Normativo

Integrar requisitos de regulaciones específicas:

- **EUDR (EU Deforestation Regulation):** Para productos forestales y agrícolas
- **ISO 9001/14001:** Gestión de calidad y medio ambiente
- **FSC/PEFC:** Certificación forestal sostenible
- **GOTS:** Textil orgánico global
- **Conflict Minerals:** Minerales libres de conflicto

---

## 5. Componentes Recomendados del MVP

### 5.1. Smart Contract

El contrato inteligente debe incluir como mínimo las siguientes estructuras:

```solidity
// ⚠️ TU TAREA: Definir estos enums
enum MaterialStatus { Created, InTransit, Processing, QualityCheck, Finished, Delivered }
enum ActorRole { None, Extractor, Processor, Manufacturer, Distributor, Certifier, Auditor }
enum CertificateType { Origin, Quality, Sustainability, ISO9001, ISO14001, FSC, PEFC, GOTS }
enum CertificateStatus { Valid, Expired, Revoked }

// ⚠️ TU TAREA: Implementar estos structs
struct Material {
    uint256 id;
    address creator;
    string materialType;      // "Madera", "Algodón", "Acero", etc.
    string origin;
    uint256 quantity;         // Cantidad en unidad relevante
    string unit;              // "kg", "m3", "tons", etc.
    uint256 dateCreated;
    MaterialStatus status;
    uint256[] parentIds;      // IDs de materiales de origen (trazabilidad)
    uint256[] certificateIds;
    uint256[] processIds;
}

struct Process {
    uint256 id;
    uint256 materialId;
    string processType;       // "Aserrado", "Secado", "Teñido", "Fundición", etc.
    address plant;
    string plantLocation;
    uint256 timestamp;
    uint256 inputQuantity;
    uint256 outputQuantity;
    string metadata;          // JSON con detalles del proceso
}

struct Certificate {
    uint256 id;
    uint256 materialId;
    CertificateType certificateType;
    string issuer;
    address issuerAddress;
    string documentHash;      // Hash del PDF
    uint256 issuedDate;
    uint256 expiryDate;
    CertificateStatus status;
    string ipfsHash;          // Hash IPFS del documento completo
}

struct Actor {
    address actorAddress;
    string name;
    ActorRole role;
    string location;
    bool isActive;
    bool isCertifiedIssuer;   // Puede emitir certificados
}

// Variables de estado
address public admin;
uint256 public nextMaterialId = 1;
uint256 public nextProcessId = 1;
uint256 public nextCertificateId = 1;

// Mappings
mapping(uint256 => Material) public materials;
mapping(uint256 => Process) public processes;
mapping(uint256 => Certificate) public certificates;
mapping(address => Actor) public actors;
mapping(uint256 => mapping(uint256 => bool)) public materialCertificates; // materialId => certificateId => exists

// Eventos
event MaterialCreated(uint256 indexed materialId, address indexed creator, string materialType, string origin);
event ProcessRecorded(uint256 indexed processId, uint256 indexed materialId, string processType, address plant);
event MaterialStatusChanged(uint256 indexed materialId, MaterialStatus newStatus);
event CertificateIssued(uint256 indexed certificateId, uint256 indexed materialId, CertificateType certificateType, address issuer);
event CertificateRevoked(uint256 indexed certificateId, string reason);
event MaterialTransferred(uint256 indexed materialId, address indexed from, address indexed to);
event ActorRegistered(address indexed actorAddress, string name, ActorRole role);
event DerivedMaterialCreated(uint256 indexed newMaterialId, uint256[] parentIds);

// ⚠️ TU TAREA: Programar estas funciones principales

// Gestión de Actores
function registerActor(string memory _name, ActorRole _role, string memory _location) public;
function certifyIssuer(address _issuerAddress) public; // Solo admin
function getActor(address _actorAddress) public view returns (Actor memory);
function deactivateActor(address _actorAddress) public;

// Gestión de Materiales
function createMaterial(string memory _materialType, string memory _origin, uint256 _quantity, string memory _unit) public returns (uint256);
function createDerivedMaterial(string memory _materialType, uint256[] memory _parentIds, uint256 _quantity, string memory _unit) public returns (uint256);
function getMaterial(uint256 _materialId) public view returns (Material memory);
function updateMaterialStatus(uint256 _materialId, MaterialStatus _newStatus) public;
function transferMaterial(uint256 _materialId, address _to) public;

// Gestión de Procesos
function recordProcess(uint256 _materialId, string memory _processType, string memory _plantLocation, uint256 _inputQty, uint256 _outputQty, string memory _metadata) public returns (uint256);
function getProcess(uint256 _processId) public view returns (Process memory);
function getMaterialProcesses(uint256 _materialId) public view returns (Process[] memory);

// Gestión de Certificados
function issueCertificate(uint256 _materialId, CertificateType _certType, string memory _issuer, string memory _docHash, string memory _ipfsHash, uint256 _expiryDate) public returns (uint256);
function revokeCertificate(uint256 _certificateId, string memory _reason) public;
function verifyCertificate(uint256 _certificateId) public view returns (bool isValid, CertificateStatus status);
function getCertificate(uint256 _certificateId) public view returns (Certificate memory);
function getMaterialCertificates(uint256 _materialId) public view returns (Certificate[] memory);

// Trazabilidad
function getFullTraceability(uint256 _materialId) public view returns (uint256[] memory ancestors, Process[] memory processHistory, Certificate[] memory certs);
function verifyOriginChain(uint256 _materialId) public view returns (bool);

```

### 5.2. Modelo de Datos

Estructura JSON recomendada para un lote industrial:

```json
{
  "materialId": "MAT-WOOD-001",
  "product": "Tabla de roble",
  "origin": "Bosque San Miguel, Provincia de Valladolid",
  "certificates": [
    {
      "type": "FSC",
      "issuer": "Forest Stewardship Council",
      "hash": "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "issuedDate": 1710002212,
      "expiryDate": 1741538212
    }
  ],
  "transformations": [
    {
      "process": "Aserrado",
      "plant": "Aserradero Los Pinos",
      "timestamp": 1710088612,
      "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
    },
    {
      "process": "Secado",
      "plant": "Secadero Industrial Norte",
      "timestamp": 1710175012,
      "actor": "0x8f3e9b4a5c2d1e0f7a6b5c4d3e2f1a0b9c8d7e6f"
    }
  ],
  "currentHolder": "Carpintería Moderna SL",
  "status": "En proceso"
}

```

### 5.3. Tests Recomendados (sc/test/IndustrialTraceability.t.sol)

```solidity
// ⚠️ TU TAREA: Escribir y hacer pasar estos tests
contract IndustrialTraceabilityTest is Test {
    // Setup y configuración inicial
    function setUp() public { }

    // Tests de gestión de actores
    function testRegisterExtractor() public { }
    function testRegisterProcessor() public { }
    function testRegisterManufacturer() public { }
    function testRegisterCertifier() public { }
    function testCertifyIssuer() public { }
    function testOnlyAdminCanCertifyIssuers() public { }
    function testDeactivateActor() public { }

    // Tests de creación de materiales
    function testCreateRawMaterial() public { }
    function testCreateMaterialWithMetadata() public { }
    function testMaterialIdIncrementation() public { }
    function testGetMaterial() public { }

    // Tests de materiales derivados
    function testCreateDerivedMaterial() public { }
    function testCreateDerivedFromMultipleParents() public { }
    function testDerivedMaterialTraceability() public { }
    function testCannotDeriveFromNonExistentMaterial() public { }

    // Tests de procesos
    function testRecordSawmillProcess() public { }
    function testRecordDryingProcess() public { }
    function testRecordManufacturingProcess() public { }
    function testProcessWithInputOutput() public { }
    function testGetMaterialProcesses() public { }
    function testProcessTimeline() public { }

    // Tests de actualización de estado
    function testUpdateStatusToProcessing() public { }
    function testUpdateStatusToQualityCheck() public { }
    function testUpdateStatusToFinished() public { }
    function testStatusChangeEmitsEvent() public { }

    // Tests de certificados
    function testIssueFSCCertificate() public { }
    function testIssueISO9001Certificate() public { }
    function testIssueOriginCertificate() public { }
    function testOnlyCertifiedIssuerCanIssueCertificates() public { }
    function testRevokeCertificate() public { }
    function testVerifyValidCertificate() public { }
    function testVerifyRevokedCertificate() public { }
    function testVerifyExpiredCertificate() public { }
    function testGetMaterialCertificates() public { }

    // Tests de transferencias
    function testTransferMaterial() public { }
    function testOnlyOwnerCanTransfer() public { }
    function testTransferEmitsEvent() public { }

    // Tests de trazabilidad completa
    function testGetFullTraceability() public { }
    function testVerifyOriginChain() public { }
    function testTraceabilityWithMultipleGenerations() public { }
    function testCompleteForestryChain() public { }

    // Tests de validaciones
    function testCannotRecordProcessForNonExistentMaterial() public { }
    function testCannotIssueCertificateForNonExistentMaterial() public { }
    function testInactiveActorCannotCreateMaterial() public { }
    function testUncertifiedActorCannotIssueCertificates() public { }

    // Tests de casos edge
    function testCreateMaterialWithZeroQuantity() public { }
    function testMultipleCertificatesForSameMaterial() public { }
    function testProcessWithMermas() public { }
    function testComplexDerivedMaterialNetwork() public { }

    // Tests de flujo completo
    function testCompleteWoodSupplyChain() public { }
    function testCompleteTextileSupplyChain() public { }
    function testSustainabilityCertificationFlow() public { }
}
```

### 5.4. Arquitectura Recomendada

Componentes técnicos sugeridos:

- **Blockchain:** EVM
- **Backend:** Node.js / Python
- **Base de datos:** SQLite / MongoDB
- **Frontend:** React / HTML+JavaScript
- **Smart Contracts:** Solidity
- **Almacenamiento de documentos:** IPFS / Arweave (para PDFs grandes)
- **Hash on-chain:** Solo el hash SHA-256 del certificado
- **Visualización:** D3.js o Cytoscape.js para árbol de trazabilidad

---

## 6. Proyecto de Referencia: TimberChain

### 6.1. ¿Qué es TimberChain?

TimberChain es una solución de trazabilidad forestal/industrial que conecta taladores, aserraderos, distribuidores y carpinterías. Utiliza tecnología DLT para mapear cadenas de suministro de madera desde el bosque hasta el producto final, garantizando cumplimiento con certificaciones FSC y regulaciones europeas.

### 6.2. Enlaces Oficiales

- 🌐 **Sitio web:** [https://timberchain.io](https://timberchain.io/)

### 6.3. Problema que Resuelve

**Tala ilegal y madera de origen dudoso:**

- Dificultad para verificar que la madera proviene de bosques sostenibles
- Certificados FSC en papel que pueden falsificarse
- Cadenas de suministro opacas con múltiples intermediarios

**Falta de trazabilidad en transformaciones:**

- Un tronco se transforma en tablas → paneles → muebles
- Sin registro digital, imposible seguir el flujo completo
- Cada actor registra sus datos de forma aislada

**Carga administrativa de auditorías:**

- Certificaciones que requieren inspecciones presenciales costosas
- Repetición de verificaciones en cada etapa
- Documentación dispersa entre países

**Cumplimiento regulatorio europeo:**

- La EU Deforestation Regulation (EUDR) exige prueba de origen legal
- Necesidad de demostrar trazabilidad completa para exportar a Europa
- Sanciones económicas por incumplimiento

### 6.4. Cómo lo Resuelve

**Pasaporte digital de la madera:**

- Cada tronco/lote recibe un ID único digital
- Registro de ubicación GPS del árbol talado
- Certificados vinculados al lote específico

**Registro de transformaciones:**

- Cada proceso industrial queda registrado on-chain
- Trazabilidad de tronco → tabla → producto final
- Historial inmutable de todos los actores

**Certificaciones digitales:**

- Certificados FSC/PEFC anclados en blockchain mediante hashes
- Verificación instantánea sin contactar al emisor
- Prevención de duplicación o falsificación

**Tokenización opcional:**

- Tokens (TIMBER2026) asociados a servicios forestales
- Economía descentralizada para sector forestal
- Incentivos para participación en la red

---

## 7. Datos del Proyecto TimberChain

### 7.1. Países Relacionados con las Cadenas de Suministro

TimberChain se enfoca en cadenas de suministro que exportan madera a Europa, con participación de:

**Países productores (origen de madera):**

- **Brasil:** Uno de los mayores exportadores de madera tropical
- **Perú:** Certificación forestal para exportación a Europa
- **Bolivia:** Cadenas forestales legales con trazabilidad digital
- **Colombia:** Programas de legalidad forestal y exportación

**Países procesadores y consumidores:**

- **España:** Importador de madera, aserraderos, industria del mueble
- **Francia:** Mercado consumidor con alta exigencia de sostenibilidad
- **Alemania:** Mayor importador europeo de madera certificada
- **Reino Unido:** Implementación de soluciones DLT para sector forestal

### 7.2. Tecnología y Alcance

**Tecnología base:**

- Construido sobre la tecnología DLT de **iov42** (con base en Reino Unido)
- Diseñado para cumplir con EU Timber Regulation (EUTR) y EUDR
- Integración con sistemas de certificación FSC/PEFC

**Enfoque:**

- No es una startup con métricas de empleados públicas
- Es más un proyecto/consorcio sectorial multi-actor
- Participan empresas forestales, tecnológicas y asociaciones del sector

**Casos de uso:**

- Identidad digital de troncos
- Registro de volúmenes de madera en cada etapa
- Documentación de diligencia debida
- Verificación de certificaciones sostenibles

**Innovación adicional:**

- Whitepaper TIMBER2026: tokenización de activos de madera
- Servicios de procesado (aserrado, secado, paneles) en economía descentralizada
- Operaciones transfronterizas entre países productores y compradores

---

## 8. Tecnologías y Modelo de Negocio

### 8.1. Stack Tecnológico

**TimberChain utiliza:**

- **DLT (Distributed Ledger Technology):** Plataforma iov42
- **Identidad digital:** Para troncos, lotes y actores
- **GPS tracking:** Ubicación de origen del árbol
- **Certificaciones digitales:** Hashes de documentos FSC/PEFC
- **APIs:** Integración con sistemas ERP forestales

### 8.2. Modelo de Aplicación

**Para qué sirve:**

- Garantizar legalidad de madera exportada
- Reducir costos de auditoría
- Facilitar cumplimiento con EUDR
- Crear confianza entre compradores europeos y productores

**Actores involucrados:**

- Empresas forestales (taladores)
- Aserraderos y plantas de transformación
- Certificadores (FSC, PEFC)
- Importadores europeos
- Autoridades regulatorias

---

## 9. Cómo Inspirarse sin Copiar

**IMPORTANTE:** El objetivo de este TFM NO es copiar TimberChain, sino usar su modelo como inspiración para crear tu propia versión adaptada a una industria diferente.

### 9.1. Lo que DEBES Hacer

- **Elegir tu propia industria:** No tiene que ser madera. Puede ser textil, acero, cosmética, construcción, etc.
- **Crear un flujo industrial simple:** Materia prima → proceso 1 → proceso 2 → producto final
- **Incorporar certificados digitales verificables:** Hashes de PDFs o NFTs
- **Diseñar un dashboard de procesos industriales:** Timeline, certificados, actores
- **Identificar las certificaciones relevantes:** ISO, GOTS, Conflict-Free, etc.

### 9.2. Lo que NO DEBES Hacer

- ❌ Copiar el código de TimberChain (no es open source)
- ❌ Usar exactamente los mismos nombres de contratos y funciones
- ❌ Limitarte solo a madera sin adaptación
- ❌ Presentar tu TFM como "TimberChain pero con otro nombre"

### 9.3. Ejemplos de Adaptación

**Caso original (TimberChain):**

```
Trazabilidad forestal: Bosque → Tala → Aserradero → Carpintería → Mueble

```

**Tu adaptación (ejemplo con textil sostenible):**

```
Trazabilidad textil: Campo de algodón orgánico → Hilandería → Tejeduría → Confección → Prenda certificada GOTS

```

**Tu adaptación (ejemplo con acero reciclado):**

```
Trazabilidad metalúrgica: Chatarra verificada → Fundición → Laminado → Fabricación → Estructura certificada

```

**Tu adaptación (ejemplo con cosmética natural):**

```
Trazabilidad cosmética: Plantación de argán (Marruecos) → Extracción aceite → Laboratorio → Envasado → Producto certificado ecológico

```

**Tu adaptación (ejemplo con componentes electrónicos):**

```
Trazabilidad electrónica: Mina de cobre → Refinería → Fabricante de chips → Ensambladora → Dispositivo con certificado Conflict-Free

```

---

## 10. Ideas de Casos de Uso para tu TFM

### Opción 1: Textil Sostenible

- Algodón orgánico certificado (GOTS)
- Trazabilidad desde campo hasta prenda
- Verificación de condiciones laborales justas
- Certificados de ausencia de trabajo infantil

### Opción 2: Acero Reciclado

- Origen verificable de chatarra
- Procesos de fundición controlados
- Certificación de porcentaje de reciclado
- Cumplimiento con normas de construcción

### Opción 3: Componentes Electrónicos

- Minerales conflict-free (tantalio, tungsteno, estaño, oro)
- Trazabilidad de semiconductores
- Certificados de origen para exportación
- Auditoría de proveedores

### Opción 4: Cosmética Natural

- Ingredientes de origen orgánico certificado
- Trazabilidad de aceites esenciales
- Certificaciones Ecocert, COSMOS
- Verificación de comercio justo

### Opción 5: Papel Reciclado

- Origen de papel usado
- Proceso de reciclaje certificado
- Porcentaje de fibra reciclada
- Certificación FSC Recycled