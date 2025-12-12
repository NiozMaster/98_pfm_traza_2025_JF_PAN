# TFM 4: Certificación Académica Digital con Blockchain

## Sistema de Emisión y Verificación de Certificados Académicos

**Máster en Blockchain · Trabajo Final de Máster**

---

## Índice de Contenidos

1. Descripción del Proyecto TFM
2. Contexto del Sector Educativo
3. Problemas Reales a Resolver
4. Aspectos Clave del TFM
5. Componentes Recomendados del MVP
6. Proyecto de Referencia: Blockcerts
7. Datos del Proyecto Blockcerts
8. Tecnologías y Modelo de Aplicación
9. Cómo Inspirarse sin Copiar

---

## 1. Descripción del Proyecto TFM

**Título provisional:** "Sistema de Emisión y Verificación de Certificados Académicos en Blockchain"

El estudiante deberá diseñar una plataforma que permita emitir, firmar digitalmente y verificar certificados académicos, boletines, reconocimientos, badges o diplomas. El objetivo es crear un sistema descentralizado donde los certificados sean inmutables, verificables por cualquiera y propiedad del estudiante.

### Objetivo Formativo

Comprender y aplicar:

- **JSON-LD como formato de credencial:** Estructura estándar para certificados digitales
- **Hashing y firmas digitales:** Generación de hash del certificado + firma criptográfica
- **Publicación en blockchain:** Anclaje del hash en una red pública o privada
- **Procesos de revocación:** Mecanismo para invalidar certificados comprometidos
- **Re-emisión:** Capacidad de generar nuevas versiones de certificados

### Resultado Esperado

Un verificador web que valide un diploma generado por el estudiante, mostrando:

- **Emisor:** Universidad/institución que emitió el certificado
- **Fecha de emisión:** Timestamp del certificado
- **ID del estudiante:** Identificador único del graduado
- **Hash en blockchain:** Prueba de anclaje inmutable
- **Estado:** Válido / Revocado

---

## 2. Contexto del Sector Educativo

Las instituciones educativas emiten millones de certificados al año: diplomas, títulos, certificaciones profesionales, badges de competencias, transcripciones académicas, etc.

### Por qué es Necesaria la Trazabilidad en Educación

- **Verificación de títulos:** Empleadores necesitan validar credenciales de candidatos
- **Portabilidad:** Estudiantes deben poder compartir sus credenciales fácilmente
- **Prevención de fraude:** Títulos falsificados son un problema global
- **Independencia del emisor:** Los estudiantes no deben depender siempre de la universidad
- **Interoperabilidad:** Certificados que funcionan en múltiples plataformas

### Tipos de Certificados Aplicables

| **Tipo** | **Ejemplos** |
| --- | --- |
| **Diplomas** | Licenciaturas, Maestrías, Doctorados |
| **Certificados** | Cursos, Talleres, Bootcamps |
| **Badges** | Competencias específicas (programación, diseño, etc.) |
| **Transcripciones** | Historial académico completo |
| **Reconocimientos** | Premios, distinciones, menciones honoríficas |
| **Certificaciones profesionales** | PMP, CPA, certificaciones técnicas |

---

## 3. Problemas Reales a Resolver

### Títulos Falsificados

Miles de diplomas falsos se venden en mercados negros. Estudios estiman que el 10-30% de CVs contienen información educativa falsa o exagerada.

### Verificaciones Manuales Lentas

Las universidades tardan días o semanas en verificar un título. Los departamentos de recursos humanos deben contactar manualmente a cada institución.

### Dependencia del Emisor

Si una universidad cierra o cambia su sistema, los estudiantes pierden acceso a sus credenciales o la capacidad de verificarlas.

### Falta de Identidad Digital Estandarizada

Cada país, universidad o plataforma usa su propio formato. No existe interoperabilidad global.

### Certificados Físicos Extraviados

Diplomas en papel que se pierden, se dañan o deben apostillarse para uso internacional (proceso costoso y lento).

### Falta de Propiedad del Estudiante

Los certificados "pertenecen" a la universidad, no al estudiante. El graduado debe solicitar copias cada vez que las necesita.

---

## 4. Aspectos Clave a Tener en Cuenta en el TFM

### 1. Formato JSON del Diploma

Diseñar un esquema JSON-LD (o similar) que incluya:

```json
{
  "@context": "https://w3id.org/openbadges/v2",
  "type": "Assertion",
  "id": "https://universidad.edu/credentials/diploma-12345",
  "recipient": {
    "type": "email",
    "identity": "estudiante@example.com",
    "hashed": true
  },
  "badge": {
    "name": "Máster en Blockchain",
    "description": "Completó exitosamente el programa de Máster",
    "issuer": {
      "name": "Universidad Tecnológica",
      "url": "https://universidad.edu"
    },
    "criteria": "Aprobó todos los módulos con calificación mínima de 7.0"
  },
  "issuedOn": "2025-06-15T10:30:00Z",
  "verification": {
    "type": "BlockchainSignature",
    "publicKey": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
  }
}

```

### 2. Publicación del Hash del Diploma

**Proceso:**

1. Generar el certificado en formato JSON
2. Calcular el hash SHA-256 del JSON completo
3. Publicar solo el hash en blockchain (no el contenido completo)
4. El estudiante guarda el archivo JSON completo

**Ventajas:**

- Privacidad: los datos no están en blockchain
- Eficiencia: solo 32 bytes por certificado
- Verificabilidad: cualquiera puede recalcular el hash y comparar

### 3. Proceso de Emisión Automático

Crear un sistema (API o dApp) que permita:

- **Input:** Datos del estudiante + programa completado
- **Proceso:** Generar JSON → Firmar → Calcular hash → Publicar en blockchain
- **Output:** Archivo descargable para el estudiante (.json o .pdf con QR)

### 4. Revocación de Títulos

Implementar mecanismo para invalidar certificados:

**Casos de uso:**

- Fraude académico descubierto posteriormente
- Error en la emisión (datos incorrectos)
- Graduado que no completó requisitos finales
- Certificación profesional que expira

**Implementación:**

- Registro on-chain de certificados revocados
- Verificador debe consultar lista de revocación
- Opcional: sistema de revocación descentralizado

### 5. Verificador Web

Crear una interfaz simple donde:

**Input:**

- Arrastrar archivo JSON del diploma
- O ingresar ID/hash del certificado

**Proceso:**

- Recalcular hash del JSON
- Consultar blockchain para verificar anclaje
- Verificar firma digital del emisor
- Consultar lista de revocaciones

**Output:**

- ✅ Certificado válido + detalles
- ❌ Certificado no encontrado / Hash no coincide
- ⚠️ Certificado revocado + razón

### 6. Privacidad y Datos Personales

Consideraciones GDPR y protección de datos:

- **Hashed emails:** No publicar correos en texto plano
- **DIDs (Decentralized Identifiers):** Usar identificadores descentralizados
- **Minimal disclosure:** Revelar solo lo necesario
- **Zero-knowledge proofs (opcional):** Probar posesión sin revelar contenido

---

## 5. Componentes Recomendados del MVP

### 5.1. Smart Contract

El contrato inteligente debe incluir como mínimo las siguientes estructuras:

```solidity
// ⚠️ TU TAREA: Definir estos enums
enum CertificateType { Diploma, Certificate, Badge, Transcript, Recognition, Professional }
enum CertificateStatus { Valid, Revoked, Expired }
enum IssuerStatus { Active, Suspended, Revoked }

// ⚠️ TU TAREA: Implementar estos structs
struct Certificate {
    uint256 id;
    bytes32 certificateHash;  // Hash SHA-256 del JSON del certificado
    address issuer;
    address recipient;
    CertificateType certificateType;
    string programName;
    uint256 issuedDate;
    uint256 expiryDate;       // 0 si no expira
    CertificateStatus status;
    string metadataURI;       // IPFS o URL al JSON completo
}

struct Issuer {
    address issuerAddress;
    string name;
    string country;
    string website;
    uint256 registrationDate;
    IssuerStatus status;
    bool isVerified;          // Verificado por admin
}

struct Recipient {
    address recipientAddress;
    string did;               // Decentralized Identifier (opcional)
    uint256[] certificateIds;
}

struct Revocation {
    uint256 certificateId;
    uint256 revocationDate;
    string reason;
    address revokedBy;
}

// Variables de estado
address public admin;
uint256 public nextCertificateId = 1;
mapping(bytes32 => bool) private usedHashes; // Prevenir duplicados

// Mappings
mapping(uint256 => Certificate) public certificates;
mapping(bytes32 => uint256) public hashToCertificateId;
mapping(address => Issuer) public issuers;
mapping(address => Recipient) public recipients;
mapping(uint256 => Revocation) public revocations;
mapping(address => uint256[]) public issuerCertificates;

// Eventos
event IssuerRegistered(address indexed issuerAddress, string name, string country);
event IssuerVerified(address indexed issuerAddress);
event IssuerStatusChanged(address indexed issuerAddress, IssuerStatus newStatus);
event CertificateIssued(uint256 indexed certificateId, bytes32 indexed certificateHash, address indexed recipient, address issuer);
event CertificateRevoked(uint256 indexed certificateId, string reason, address revokedBy);
event CertificateVerified(uint256 indexed certificateId, address verifier);

// ⚠️ TU TAREA: Programar estas funciones principales

// Gestión de Emisores
function registerIssuer(string memory _name, string memory _country, string memory _website) public;
function verifyIssuer(address _issuerAddress) public; // Solo admin
function updateIssuerStatus(address _issuerAddress, IssuerStatus _newStatus) public; // Solo admin
function getIssuer(address _issuerAddress) public view returns (Issuer memory);
function isAuthorizedIssuer(address _issuerAddress) public view returns (bool);

// Emisión de Certificados
function issueCertificate(
    bytes32 _certificateHash,
    address _recipient,
    CertificateType _certType,
    string memory _programName,
    uint256 _expiryDate,
    string memory _metadataURI
) public returns (uint256);

function batchIssueCertificates(
    bytes32[] memory _certificateHashes,
    address[] memory _recipients,
    CertificateType _certType,
    string memory _programName,
    string[] memory _metadataURIs
) public returns (uint256[] memory);

// Verificación de Certificados
function verifyCertificate(bytes32 _certificateHash) public view returns (
    bool exists,
    bool isValid,
    CertificateStatus status,
    address issuer,
    address recipient
);

function verifyCertificateById(uint256 _certificateId) public returns (bool);
function getCertificate(uint256 _certificateId) public view returns (Certificate memory);
function getCertificateByHash(bytes32 _certificateHash) public view returns (Certificate memory);

// Revocación
function revokeCertificate(uint256 _certificateId, string memory _reason) public;
function revokeCertificateByHash(bytes32 _certificateHash, string memory _reason) public;
function getRevocation(uint256 _certificateId) public view returns (Revocation memory);

// Consultas para Recipientes
function getRecipientCertificates(address _recipient) public view returns (uint256[] memory);
function getIssuerCertificates(address _issuer) public view returns (uint256[] memory);

// Funciones auxiliares
function certificateExists(bytes32 _certificateHash) public view returns (bool);
function isCertificateExpired(uint256 _certificateId) public view returns (bool);

```

### 5.2. Modelo de Datos

Estructura del certificado digital:

```json
{
  "certificateId": "CERT-2025-001",
  "studentName": "María García López",
  "studentId": "did:ethr:0x8f3e9b4a5c2d1e0f7a6b5c4d3e2f1a0b9c8d7e6f",
  "program": "Máster en Blockchain y Criptomonedas",
  "degree": "Master of Science",
  "gpa": 8.5,
  "issuer": {
    "name": "Universidad Politécnica de Madrid",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    "country": "España"
  },
  "issuedDate": "2025-06-15",
  "signature": "0x7f8c...",
  "blockchainAnchor": {
    "network": "Polygon",
    "transactionHash": "0xabc123...",
    "blockNumber": 12345678
  }
}

```

### 5.3. Tests Recomendados (sc/test/AcademicCertification.t.sol)

```solidity
// ⚠️ TU TAREA: Escribir y hacer pasar estos tests
contract AcademicCertificationTest is Test {
    // Setup y configuración inicial
    function setUp() public { }

    // Tests de gestión de emisores
    function testRegisterIssuer() public { }
    function testVerifyIssuer() public { }
    function testOnlyAdminCanVerifyIssuers() public { }
    function testUpdateIssuerStatus() public { }
    function testSuspendIssuer() public { }
    function testIsAuthorizedIssuer() public { }

    // Tests de emisión de certificados
    function testIssueDiploma() public { }
    function testIssueCertificate() public { }
    function testIssueBadge() public { }
    function testIssueTranscript() public { }
    function testOnlyVerifiedIssuerCanIssueCertificates() public { }
    function testCertificateIdIncrementation() public { }
    function testPreventDuplicateHashes() public { }

    // Tests de emisión por lotes
    function testBatchIssueCertificates() public { }
    function testBatchIssueMultipleRecipients() public { }
    function testBatchIssueValidation() public { }

    // Tests de verificación
    function testVerifyCertificateByHash() public { }
    function testVerifyCertificateById() public { }
    function testVerifyNonExistentCertificate() public { }
    function testVerificationReturnsCorrectData() public { }
    function testGetCertificate() public { }
    function testGetCertificateByHash() public { }

    // Tests de revocación
    function testRevokeCertificate() public { }
    function testRevokeCertificateByHash() public { }
    function testOnlyIssuerCanRevokeCertificate() public { }
    function testRevocationReason() public { }
    function testVerifyRevokedCertificate() public { }
    function testCannotRevokeAlreadyRevoked() public { }
    function testGetRevocationDetails() public { }

    // Tests de expiración
    function testCertificateWithExpiryDate() public { }
    function testCertificateWithoutExpiryDate() public { }
    function testCheckExpiredCertificate() public { }
    function testVerifyExpiredCertificate() public { }

    // Tests de consultas
    function testGetRecipientCertificates() public { }
    function testGetIssuerCertificates() public { }
    function testRecipientWithMultipleCertificates() public { }
    function testIssuerWithMultipleCertificates() public { }

    // Tests de validaciones
    function testCannotIssueWithEmptyHash() public { }
    function testCannotIssueToZeroAddress() public { }
    function testSuspendedIssuerCannotIssueCertificates() public { }
    function testRevokedIssuerCannotIssueCertificates() public { }

    // Tests de eventos
    function testIssuerRegisteredEvent() public { }
    function testIssuerVerifiedEvent() public { }
    function testCertificateIssuedEvent() public { }
    function testCertificateRevokedEvent() public { }
    function testCertificateVerifiedEvent() public { }

    // Tests de casos edge
    function testMultipleCertificatesForSameRecipient() public { }
    function testHashCollisionPrevention() public { }
    function testIssuerSelfRevocation() public { }
    function testAdminRevocation() public { }

    // Tests de flujo completo
    function testCompleteUniversityDiplomaFlow() public { }
    function testCompleteProfessionalCertificationFlow() public { }
    function testMultipleIssuersScenario() public { }
    function testCertificateLifecycleFlow() public { }
}
```

### 5.4. Arquitectura Recomendada

Componentes técnicos sugeridos:

- **Blockchain:** EVM (Polygon recomendado por bajo costo)
- **Backend:** Node.js / Python
- **Base de datos:** SQLite / MongoDB (para indexación rápida)
- **Frontend:** React / HTML+JavaScript
- **Smart Contracts:** Solidity
- **Almacenamiento:** IPFS para JSONs de certificados
- **QR Code:** Generación de QR para compartir certificados

---

## 6. Proyecto de Referencia: Blockcerts

### 6.1. ¿Qué es Blockcerts?

Blockcerts es un estándar abierto y un ecosistema de código abierto para la emisión y verificación de certificados digitales usando blockchain. Nace de un trabajo conjunto entre el **MIT Media Lab** y la empresa **Learning Machine**.

### 6.2. Enlaces Oficiales

- 🌐 **Sitio web oficial:** [https://www.blockcerts.org](https://www.blockcerts.org/)
- 📚 **Guía técnica:** [https://www.blockcerts.org/guide/](https://www.blockcerts.org/guide/)
- ℹ️ **About:** [https://www.blockcerts.org/about.html](https://www.blockcerts.org/about.html)
- 💻 **GitHub:** [https://github.com/blockchain-certificates](https://github.com/blockchain-certificates)

### 6.3. Problema que Resuelve

**Títulos y certificados fácilmente falsificables:**

- Diplomas impresos que pueden ser escaneados y editados
- Sellos y firmas que pueden ser replicados
- Verificación imposible sin contactar a la institución

**Verificaciones lentas y dependientes del emisor:**

- Proceso manual que tarda días
- Requiere que la institución esté disponible
- Costos administrativos altos

**Falta de propiedad del registro por parte del alumno:**

- El estudiante no controla sus credenciales
- Debe solicitar copias certificadas cada vez
- Si la institución cierra, pierde acceso

### 6.4. Cómo lo Resuelve

**Certificados en JSON firmado:**

- Formato estándar JSON-LD
- Incluye todos los metadatos del certificado
- Hash del JSON se ancla en blockchain

**El estudiante posee sus credenciales:**

- Recibe archivo JSON que puede guardar permanentemente
- No depende de la universidad para compartirlo
- Puede verificarlo en cualquier momento

**Verificación descentralizada:**

- Cualquiera puede verificar el certificado sin contactar al emisor
- Solo se necesita el archivo JSON + acceso a blockchain
- Verificación instantánea y gratuita

**Ecosistema de herramientas open source:**

- **cert-issuer:** Para emitir certificados
- **cert-tools:** Utilidades para gestión de certificados
- **cert-verifier:** Para verificar certificados
- **cert-wallet:** Wallet móvil para estudiantes

---

## 7. Datos del Proyecto Blockcerts

### 7.1. Naturaleza del Proyecto

**No es una empresa, es un estándar abierto:**

- Iniciado por MIT Media Lab y Learning Machine
- Código completamente open source en GitHub
- Comunidad global de contribuidores
- Adoptado por instituciones educativas y gobiernos

### 7.2. Adopción por Instituciones

**Massachusetts Institute of Technology (MIT):**

- Emite diplomas oficiales usando Blockcerts
- Los graduados reciben sus credenciales digitales verificables
- Pionero en adopción desde 2017

**Otras instituciones y gobiernos:**

- Universidades en Malta, Italia, Alemania
- Gobiernos experimentando con credenciales verificables
- Estados de EE.UU. implementando sistemas similares
- Iniciativas de Open Badges (estándar complementario)

### 7.3. Países con Proyectos Educativos Blockchain

**España:**

- Universidades explorando certificados digitales
- Títulos universitarios con firma electrónica avanzada
- Proyectos piloto en comunidades autónomas

**México:**

- Iniciativas de educación digital
- Certificaciones técnicas con blockchain
- Programas de formación continua

**Chile:**

- Ministerio de Educación explorando blockchain
- Universidades piloto con credenciales digitales

**Colombia:**

- Certificaciones profesionales digitales
- Programas de educación técnica

**Argentina:**

- Universidades nacionales con proyectos piloto
- Certificados de cursos online

### 7.4. Madurez del Estándar

**Ecosistema técnico:**

- Librerías maduras y bien documentadas
- Compatible con Bitcoin, Ethereum y otras blockchains
- Estándar W3C Verifiable Credentials compatible

**Casos de éxito:**

- Miles de certificados emitidos por MIT
- Adopción creciente en educación superior
- Integración con plataformas educativas (Moodle, Canvas)

---

## 8. Tecnologías y Modelo de Aplicación

### 8.1. Stack Tecnológico de Blockcerts

**Formato de credenciales:**

- JSON-LD (Linked Data)
- Compatible con Open Badges 2.0
- Camino hacia W3C Verifiable Credentials

**Blockchain:**

- Soporte para Bitcoin (primera implementación)
- Soporte para Ethereum
- Modular: puede usar cualquier blockchain

**Criptografía:**

- Hashing SHA-256 para certificados
- Firma digital con claves privadas del emisor
- Verificación con claves públicas

**Herramientas:**

- Python para cert-issuer y cert-tools
- JavaScript/React para cert-verifier (web)
- Aplicaciones móviles (iOS/Android) para cert-wallet

### 8.2. Proceso de Emisión Blockcerts

1. **Preparar datos:** CSV con información de graduados
2. **Generar certificados:** Crear JSON para cada estudiante
3. **Firmar:** Aplicar firma digital del emisor
4. **Calcular Merkle root:** Combinar hashes de múltiples certificados
5. **Anclar en blockchain:** Publicar Merkle root en una transacción
6. **Entregar:** Enviar archivos JSON a estudiantes

### 8.3. Modelo de Aplicación

**Para qué sirve:**

- Eliminar fraude de títulos falsos
- Reducir costos administrativos de verificación
- Dar propiedad de credenciales a estudiantes
- Facilitar movilidad académica internacional

**Quién lo usa:**

- Universidades (emisores)
- Estudiantes (poseedores)
- Empleadores (verificadores)
- Plataformas educativas (integración)

---

## 9. Cómo Inspirarse sin Copiar

**IMPORTANTE:** El objetivo de este TFM NO es copiar Blockcerts, sino crear tu propio sistema de certificación digital adaptado al caso que te interese.

### 9.1. Lo que DEBES Hacer

- **Elegir un tipo de credencial:** Diploma, certificado, badge, transcripción, reconocimiento
- **Diseñar un esquema JSON propio:** Inspirado en Blockcerts pero adaptado a tus necesidades
- **Definir el flujo de emisión → anclaje → verificación**
- **Crear un verificador web ligero:** Puede reutilizar ideas de Blockcerts
- **Pensar en revocación:** Cómo invalidar certificados si es necesario
- **Considerar el impacto:** Para empleadores, universidades y estudiantes

### 9.2. Lo que NO DEBES Hacer

- ❌ Copiar el código de Blockcerts sin entenderlo (aunque es open source, debe ser tu implementación)
- ❌ Usar exactamente el mismo formato JSON sin adaptación
- ❌ Presentar tu TFM como "Blockcerts instalado"
- ❌ Ignorar la parte de diseño y verificación (no es solo emitir, es el ecosistema completo)

### 9.3. Ejemplos de Adaptación

**Caso original (Blockcerts):**

```
Diplomas universitarios MIT → JSON-LD → Hash en Bitcoin → Verificador web

```

**Tu adaptación (ejemplo con certificados técnicos):**

```
Certificados de bootcamp de programación → JSON personalizado → Hash en Polygon → Verificador integrado en plataforma de empleo

```

**Tu adaptación (ejemplo con badges de competencias):**

```
Badges de competencias digitales → NFTs visuales → Metadatos on-chain → Verificador en LinkedIn/portfolio

```

**Tu adaptación (ejemplo con certificados profesionales):**

```
Certificación de contador público (CPA) → JSON con número de licencia → Hash en Ethereum → Verificador del colegio profesional

```

**Tu adaptación (ejemplo con transcripciones):**

```
Historial académico completo → JSON con todas las materias → Hash en blockchain privada → Verificador para universidades de destino

```

---

## 10. Ideas de Casos de Uso para tu TFM

### Opción 1: Diplomas Universitarios

- Títulos de grado, máster y doctorado
- Incluye calificación final y menciones
- Verificador público en web de la universidad
- Integración con RUCT (España) o sistemas nacionales

### Opción 2: Certificados de Cursos Online

- Completitud de MOOCs y bootcamps
- Badges por competencias adquiridas
- Verificador integrado en plataforma educativa
- Compartible en redes sociales profesionales

### Opción 3: Certificaciones Profesionales

- CPA, PMP, certificaciones técnicas
- Incluye número de licencia y vigencia
- Sistema de renovación/expiración
- Verificador del colegio profesional

### Opción 4: Transcripciones Académicas

- Historial completo de materias y calificaciones
- Verificación para admisiones universitarias
- Elimina necesidad de apostillas
- Privacidad: revelar solo promedio sin detallar materias

### Opción 5: Reconocimientos y Premios

- Becas, distinciones, reconocimientos especiales
- Verificación pública de logros
- Portfolio digital del estudiante
- NFTs visuales con diseño único