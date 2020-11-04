const Constants = require("./constants/Constants");
const { BlockchainManager } = require("../src/BlockchainManager");
const { Credentials } = require("uport-credentials");

const config = {
  gasPrice: 10000,
  providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG
};

let blockchainManager;
let jwt;
let payload;
let signer;
let identity;
let prefixToAdd;
let createdCredential;

const personData = {
  dni: 12345678,
  names: "Homero",
  lastNames: "Simpson",
  nationality: "Argentina"
};

const subject = {
  DatosPersonales: {
    preview: {
      fields: ["dni", "names", "lastNames", "nationality"],
      type: 2,
    },
    category: "identity",
    data: personData,
  },
};

let aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

function initializeBlockchainManager() {
  blockchainManager = new BlockchainManager(config);
}

async function createJWT(didWithPrefix) {  
  signer = blockchainManager.getSigner(identity.privateKey);
  payload = { name: "TEST" };
  jwt = await blockchainManager.createJWT(didWithPrefix, identity.privateKey, {
    ...payload,
  });
  return jwt; 
}

function createIdentities() {
  return Credentials.createIdentity();
}

function addPrefix(prefixToAdd, did) {
  const prefixDid = did.slice(0, 9) + prefixToAdd + did.slice(9, did.length);
  return prefixDid;
}

describe("Blockchain Manager on MAINNET should", () => {
  beforeEach(async () => {
    initializeBlockchainManager();
    prefixToAdd = "";
  });
  
  it("create a jwt with a MAINNET prefix DID and verify it", async () => {
    identity = createIdentities();
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const returnedJwt = await createJWT(didWithPrefix);
    const result = await blockchainManager.verifyJWT(returnedJwt);

    expect(result.jwt).toEqual(returnedJwt);
    expect(result.payload).toEqual(expect.objectContaining(payload));
    expect(result.issuer).toEqual(didWithPrefix);
    expect(result.doc).toBeDefined();
  });

  it("decode the jwt when invoking decodeJWT method from MAINNET", async () => {
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const result = await blockchainManager.decodeJWT(jwt);

    expect(result.signature).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.payload.iss).toBe(didWithPrefix);
  });
});
  
describe("Blockchain Manager on RSK should", () => {
  beforeEach(async () => {
    initializeBlockchainManager();
    prefixToAdd = "rsk:";
  });
  
  it("create a jwt with a RSK prefix DID and verify it", async () => {
    identity = createIdentities();
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const returnedJwt = await createJWT(didWithPrefix);
    const result = await blockchainManager.verifyJWT(returnedJwt);

    expect(result.jwt).toEqual(returnedJwt);
    expect(result.payload).toEqual(expect.objectContaining(payload));
    expect(result.issuer).toEqual(didWithPrefix);
    expect(result.doc).toBeDefined();
  });

  it("decode the jwt when invoking decodeJWT method from RSK", async () => {
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const result = await blockchainManager.decodeJWT(jwt);

    expect(result.signature).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.payload.iss).toBe(didWithPrefix);
  });
});
  
describe("Blockchain Manager on LACCHAIN should", () => {
  beforeEach(async () => {
    initializeBlockchainManager();
    prefixToAdd = "lacchain:";
  });
  
  it("create a jwt with a LACCHAIN prefix DID and verify it", async () => {
    identity = createIdentities();
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const returnedJwt = await createJWT(didWithPrefix);
    const result = await blockchainManager.verifyJWT(returnedJwt);

    expect(result.jwt).toEqual(returnedJwt);
    expect(result.payload).toEqual(expect.objectContaining(payload));
    expect(result.issuer).toEqual(didWithPrefix);
    expect(result.doc).toBeDefined();
  });

  it("decode the jwt when invoking decodeJWT method from LACCHAIN", async () => {
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const result = await blockchainManager.decodeJWT(jwt);

    expect(result.signature).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.payload.iss).toBe(didWithPrefix);
  });
});

describe("Blockchain Manager on BFA should", () => {
  beforeEach(async () => {
    initializeBlockchainManager();
    prefixToAdd = "bfa:";
  });
  
  it("create a jwt with a BFA prefix DID and verify it", async () => {
    identity = createIdentities();
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const returnedJwt = await createJWT(didWithPrefix);
    const result = await blockchainManager.verifyJWT(returnedJwt);

    expect(result.jwt).toEqual(returnedJwt);
    expect(result.payload).toEqual(expect.objectContaining(payload));
    expect(result.issuer).toEqual(didWithPrefix);
    expect(result.doc).toBeDefined();
  });

  it("decode the jwt when invoking decodeJWT method from BFA", async () => {
    const didWithPrefix = addPrefix(prefixToAdd, identity.did);
    const result = await blockchainManager.decodeJWT(jwt);

    expect(result.signature).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.payload.iss).toBe(didWithPrefix);
  });
});

describe("Blockchain Manager Credentials should", () => {
  beforeEach(async () => {
    initializeBlockchainManager();
    prefixToAdd = "";
  });

  it.only("create a Credential invoking createCertificate method with lacchain did ", async () => {

    const issuer_identity = createIdentities();
    const subject_identity = createIdentities();

    const issuer_didWithPrefix = addPrefix(prefixToAdd, issuer_identity.did);
    const result = await blockchainManager.createCertificate(      
      subject_identity.did,
      subject,
      aYearFromNow,
      issuer_didWithPrefix,
      issuer_identity.privateKey
    );
    createdCredential = result;
    
    expect(result).toBeDefined();    
  });

  it.only("verify a created Credential invoking verifyCertificate method", async () => {
    const result = await blockchainManager.verifyCertificate(createdCredential);
    console.log('\n\nresult :>> ', JSON.stringify(result, 0, 3));

    expect(result).toBeDefined();
    expect(result.payload.vc.credentialSubject.DatosPersonales.data.dni).toBe(personData.dni);
  });
});
