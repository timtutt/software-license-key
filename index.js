const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const fs = require('fs');

class SoftwareLicenseKey {

  constructor(cert=null) {
    if (cert == null) {
      this.key = new NodeRSA();
      this.key.generateKeyPair();
    } else {
      this.key = new NodeRSA(cert);
    }
  }

  generateLicense(licenseKeyData) {

    if (!this.key.isPrivate()) {
      throw "Cannot generate license key. Key provided is not private.";
      return;
    }

    if (licenseKeyData == null) {
      throw "No license key data provided.";
      return;
    }

    var randomSymmetricKey = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Base64);
    var encrypteddata = CryptoJS.AES.encrypt(JSON.stringify(licenseKeyData), randomSymmetricKey).toString();

    //encrypt the symmetric key.
    var encryptedSymmetricKey = this.key.encryptPrivate(randomSymmetricKey, 'base64');

    //combine the encrypted symmetric key with the encrypted data
    var msg = encryptedSymmetricKey + "||" + encrypteddata;

    // build the signature for the license key data
    var signature = this.key.sign(JSON.stringify(licenseKeyData), 'base64');

    //build license Key
    var licenseKey = "====BEGIN LICENSE KEY====\n";
    licenseKey += msg + "\n";
    licenseKey += signature;
    licenseKey += "\n====END LICENSE KEY====";

    return licenseKey;
  }

  validateLicense(licenseKey) {
    //parse the license key
    var lines = licenseKey.split("\n");
    var keyMsg = lines[1].split("||");
    var signature = lines[2];

    //decrypt the random symmetric key
    try {
      var randomSymmetricKey = this.key.decryptPublic(keyMsg[0], 'utf8');
    } catch(e) {
      throw "Invalid data: Could not extract symmetric key.";
      return;
    }

    //decrypt the payload
    try {
      var decrypteddata = CryptoJS.AES.decrypt(keyMsg[1], randomSymmetricKey).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      throw "Invalid Data: Could not decrypt data with key found.";
      return;
    }


    //verify the signature.
    if (this.key.verify(decrypteddata, signature, 'utf8', 'base64')) {
      //return the decryped data.
      return JSON.parse(decrypteddata);
    } else {
      throw "License Key signature invalid. This license key may have been tampered with";
      return;
    }
  }

  /**
   * Exports the private key in PEM format
  */
  exportPrivateKey(filePath) {

    if (!this.key.isPrivate()) {
      throw "The key is not a private key. Cannot export private key from public key."
      return;
    }
    if (filePath == null) {
      return this.key.exportKey();
    } else {
      try {
        fs.writeFileSync(filePath, this.key.exportKey());
      } catch(e) {
        throw e; //error writing the private key out to disk.
      }
    }
  }

  /**
   * Exports the public key
  */
  exportPublicKey(filePath) {
    if (filePath == null) {
      return this.key.exportKey('public');
    } else {
      try {
        fs.writeFileSync(filePath, this.key.exportKey('public'));
      } catch(e) {
        throw e; //error writing the private key out to disk.
      }
    }
  }
}

module.exports = SoftwareLicenseKey;
