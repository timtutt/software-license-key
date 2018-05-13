# Software License Key

This is a library for generating and validating software license keys with data embedded in the license key.


## Installation
```bash
npm install software-license-key
```

## Setup
You can then require the library in your code by using:
```javascript
const SoftwareLicenseKey = require('software-license-key');
```

## Usage

### Key Generation

Key generation can be done manually or by leveraging the library. You can generate your own key pairs for usage by using the following commands:

```bash
#generate private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

#generate public key from private
openssl rsa -pubout -in private_key.pem -out public_key.pub
```

You can pass these keys to the library by calling the constructor with a parameter that is a buffer of the key itself.

  * With key external key files:
  ```javascript
  const fs = require('fs');

  //instantiate with the private key
  var privateKeyFile = fs.readFileSync('/path/to/cert.pem', 'utf8');
  var generator = new SoftwareLicenseKey(privateKeyFile);

  //instantiate with the public key
  var publicKeyFile = fs.readFileSync('/path/to/cert.pub', 'utf8');
  var validator = new SoftwareLicenseKey(publicKeyFile);
  ```
  * With string version of keys

  ```javascript
  var privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIEogIBAAKCAQEAwYXYEB7ubL1nKk/VltbQTGU1WNvwpH9VgAO6ZZH2J0uKQXAY\n" +
  "rDASO0OLsy/RnyWN+IS4hwr73KuxCppEG/6UOVlVKymCii/d5DrPjTnW5TtOD0hn\n" +
  "/SxxyW1IKaPJbWzhxlpbPygfytDAwS2FTRsDem4SJVLxVERsAI1RkKnN1rCtWb+u\n" +
  "V5PLga5ORAD0bCSniDdbEkkWLmWHgo6CYEUwUGDBXeqaXNEI+TXXZ+U3rIFejSZ8\n" +
  "+6GVKd7GG72EL1MS110S2MHOkrFRlA7v+7BrtGGx2bWdoX13wp5s7DVhJmmeakiQ\n" +
  "LOs7P3QvMvUjfOOef5uem1wJmL16xfsPP1UZxwIDAQABAoIBAHKSWyiwJ1gZikpy\n" +
  "mXGEHC4efUbub7nz6RqxGlmn4KPDBUdYpkLK8wBDLSIY3XHrOfI4IUdSKWqr+1Tb\n" +
  "oBcy0W5ihRnYqYBGdof4iYiDBccRJVXG+EnbVkJ6gI6meUpffAuC0yLBDpF0pam4\n" +
  "2YKcy6JgKD4QrO/G0mpBQFj1Lvg6+O3/DGwYfsWrn+Zen/4S/fHJ8NE6stQTHQcD\n" +
  "pE8kM/0po/wmzbvyKa5ygcl7LRFa4d0Lr7jngpj5KIVhJ0FA9uORJaS4vK5v9v58\n" +
  "mRKednWl0hnpspi469vo695gTfovOMrkiSoIMa14V8mP+1h0CAYWv9NZkrLQGC3u\n" +
  "Alj+KwECgYEA8fIF85Nwh60SbU/phmBbmGsjiB+blE+d1DFro0LiTIoMefVa0IhL\n" +
  "+JVRCKnNFqkAyzQDXcGYEzTXbMdZkMxS8ZvlfnTuUnGw0a336NH45M4qunOU4VCG\n" +
  "o1Ek6Cyu9nk4/ZNS7VsBiqtVBaGXINZN1jIPDQJQN3Udt6qkzsVqNO8CgYEAzMO6\n" +
  "MEtWLp+mtyLDCjOQgFr+RWoaiABPqdrKivWjDcgIr3WUr1CPy3Nv8YAlfiWMRbRB\n" +
  "+AfzXkW1vFx0jAVO70TqRS0MKkRjl1hKLZgyIsts3CoWhMWlMkKtTPXq1cIBUIrB\n" +
  "/Kq9EC9YPUvaVf41tptBJ6XB/VcES4MsjRJaWKkCgYAuo0Gkb0Jc1O7dZW8VeROO\n" +
  "8PAbeERMNYCt+4zNHsJykJXRGIuV8P/7/gRt0BV5jcBaaz9O3leLND9md5L7R3eh\n" +
  "nTSCyNV7zPCRqqBEH92DdX5lDIyhVh1t8+FSY/KiDkH/F1v/5vAII/iyqjBwov7E\n" +
  "EEg4cL63wfqlgd5dAU70vwKBgARmMBnZhIB77ZkBpi8R7IjVa6ESJn/FgfCkQrW5\n" +
  "kUc6hPVAEXGyyWQVltIZbrTHGbxlowUxJolf9geV9OsNMiTx1hamYRyHW5xkyTMx\n" +
  "keItfKk+Pj2cAXCS/iYpImJ1SJHyaTiEcotmeP7YIli2nXDO5Rd0+DX5KJ52sv5U\n" +
  "5pwBAoGAMNpoQcibyyjzuEAssiUP1QnyzxeM+o4PnbE02k8IRXLZoyHENkt+PQHN\n" +
  "tqYo2Gf5rSMg/SaDCgBrHlOb2WbQPawiAewjkZxlMD2wFzp7/bhTn3cN45bEhn/l\n" +
  "KyHMXak3IycYjYCznallCFUQ6OCiuTho+l891jTFuF/xgzI13EU=\n" +
  "-----END RSA PRIVATE KEY-----";

  var generator = new SoftwareLicenseKey(privateKey);

  var publicKey = "-----BEGIN PUBLIC KEY-----\n" +
"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwYXYEB7ubL1nKk/VltbQ\n" +
"TGU1WNvwpH9VgAO6ZZH2J0uKQXAYrDASO0OLsy/RnyWN+IS4hwr73KuxCppEG/6U\n" +
"OVlVKymCii/d5DrPjTnW5TtOD0hn/SxxyW1IKaPJbWzhxlpbPygfytDAwS2FTRsD\n" +
"em4SJVLxVERsAI1RkKnN1rCtWb+uV5PLga5ORAD0bCSniDdbEkkWLmWHgo6CYEUw\n" +
"UGDBXeqaXNEI+TXXZ+U3rIFejSZ8+6GVKd7GG72EL1MS110S2MHOkrFRlA7v+7Br\n" +
"tGGx2bWdoX13wp5s7DVhJmmeakiQLOs7P3QvMvUjfOOef5uem1wJmL16xfsPP1UZ\n" +
"xwIDAQAB\n" +
"-----END PUBLIC KEY-----";
  var validator = new SoftwareLicenseKey(publicKey);
  ```

  * Library Generated Keys

  If you'd prefer to have the library generate the key pairs for you, just instantiate it without passing a key.

  ```javascript
  var generator = new SoftwareLicenseKey();
  ```


### Generating A License Key
To generate a license key you must instantiate with a private key or no key for automatic generation.

```javascript
var generator = new SoftwareLicenseKey();
var licenseKeyData = {"fakeField": "some data"}
console.log(generator.generateLicense(licenseKeyData));
```

### Validating A License Key

To validate a license key you must use the corresponding public key for the private key that generated the license key.

```javascript
var publicKey = "-----BEGIN PUBLIC KEY-----\n" +
"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwYXYEB7ubL1nKk/VltbQ\n" +
"TGU1WNvwpH9VgAO6ZZH2J0uKQXAYrDASO0OLsy/RnyWN+IS4hwr73KuxCppEG/6U\n" +
"OVlVKymCii/d5DrPjTnW5TtOD0hn/SxxyW1IKaPJbWzhxlpbPygfytDAwS2FTRsD\n" +
"em4SJVLxVERsAI1RkKnN1rCtWb+uV5PLga5ORAD0bCSniDdbEkkWLmWHgo6CYEUw\n" +
"UGDBXeqaXNEI+TXXZ+U3rIFejSZ8+6GVKd7GG72EL1MS110S2MHOkrFRlA7v+7Br\n" +
"tGGx2bWdoX13wp5s7DVhJmmeakiQLOs7P3QvMvUjfOOef5uem1wJmL16xfsPP1UZ\n" +
"xwIDAQAB\n" +
"-----END PUBLIC KEY-----";

var validator = new SoftwareLicenseKey(publicKey);

var licenseKey = "====BEGIN LICENSE KEY====\n" +
"YgjrPp6+YEKin4Gox6CuEKwlu3qjvEGMu7GpelAjhnHLakQp9HdbzEZPMlFiD9++g1MKjCOu7lAwTpwXXIc/3YlsS2codN/piwAyx9HlbkCeXBk3PB+fOrv8a80Op7OZPTiY8As5YWrpfBLYZ79fOvsHqfZdc/i46aHYfX0NhW0K9RJfFgBFQRU1SaB4lDdOHedn2S6cBq5YyEgLBEIRPaheQR8/ojsa/KsI/oCC1m/0Jy1331aU/u/egGIGD8nh275zIoipJxmPzRszy6MRP8kTL+80NVneKWt7YFsNrQF9kvq6ggX9TijTsffJiUD2rkmRNVZ90LMPQKmg3eaL6g==||U2FsdGVkX1+29gUVOieMmxu/cfgZk9J4amjuzjX3aInFzubpSpSi/262FEyVmX/d\n" +
"ht0rbXKzg1gfRtnK1UU7cm+AyFKA0acCB+RN8F+GAkGFlUnH5YDI78j//IdPAWScqf5hEUIsrIC/RLIbKmDv8dWZ8+E7100xBt4IZ38IJ348Bcm0INcrfkjJNyj0okurWFjzubKCOcNxtEg931U8T34rQMSQhz1iVeNnLajpyO2/lNTMY00Xb7bYKVMpQsWRkGE3t60PYyH5EQWSksoK/R6Z4NymP4FMgRWAV8HnR4VbnCwJlkNHnmurdOFuQB0/kzoFCquXPJhaQRnbAlihaBC2GDamhBTnAdiEEQUHnGkKlh0kcIDWZI7UmoaMW52dri4BAXv/ZLwcyQrc1SnCMg==\n" +
"====END LICENSE KEY====";

var decryptedLicenseKeydata = validator.validateLicense(licenseKey);
console.log(JSON.stringify(decryptedLicenseKeydata));
```
