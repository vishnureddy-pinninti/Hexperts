const tls = require('tls');
const fs = require('fs');

const certificates = {
    'hexperts.hexagon.com': {
        cert: './certs/hexagon.crt',
        ca: './certs/hexagonCA.crt',
        key: './certs/hexagon.key',
    },
    'hexperts.intergraph.com': {
        cert: './certs/intergraph.crt',
        ca: './certs/intergraphCA.crt',
        key: './certs/intergraph.key',
    },
    'hexperts.ingrnet.com': {
        cert: './certs/ingrnet.crt',
        ca: './certs/ingrnetCA.crt',
        key: './certs/ingrnet.key',
    },
    'localhost': {
        cert: './certs/ingrnet.crt',
        ca: './certs/ingrnetCA.crt',
        key: './certs/ingrnet.key',
    },
};

// if CA contains more certificates it will be parsed to array
const sslCADecode = (source) => {

    if (!source || typeof (source) !== "string") {
        return [];
    }

    return source.split(/-----END CERTIFICATE-----[\s\n]+-----BEGIN CERTIFICATE-----/)
        .map((value, index, array) => {
        if (index) {
            value = "-----BEGIN CERTIFICATE-----" + value;
        }
        if (index !== array.length - 1) {
            value = value + "-----END CERTIFICATE-----";
        }
        value = value.replace(/^\n+/, "").replace(/\n+$/, "");
        return value;
    });
}

const getSecureContexts = (certs) => {
    if (!certs || Object.keys(certs).length === 0) {
      throw new Error("Any certificate wasn't found.");
    }

    const certsToReturn = {};

    for (const serverName of Object.keys(certs)) {
      const appCert = certs[serverName];

        certsToReturn[serverName] = tls.createSecureContext({
            key: fs.readFileSync(appCert.key),
            cert: fs.readFileSync(appCert.cert),
            // If the 'ca' option is not given, then node.js will use the default
            ca: appCert.ca ? sslCADecode(
                fs.readFileSync(appCert.ca, "utf8"),
            ) : null,
        });
    }

    return certsToReturn;
}

const secureContexts = getSecureContexts(certificates);

const options = {
    // A function that will be called if the client supports SNI TLS extension.
    SNICallback: (servername, cb) => {
        const ctx = secureContexts[servername];

        if (cb) {
            cb(null, ctx);
        } else {
            return ctx;
        }
    },
};

module.exports = options;
