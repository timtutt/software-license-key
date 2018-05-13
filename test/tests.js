var assert = require('assert');
const SoftwareLicenseKey = require('../index');

describe('Automatically Generated Keys', function() {

  var generator;
  var licenseKey;
  var publicKey;
  before(function() {
    generator = new SoftwareLicenseKey();
  });

  describe('Generate License Key', function() {
    it('license key should have 4 lines', function() {
      licenseKey = generator.generateLicense({"fakeField": "Fake Data"});
      assert.equal(licenseKey.split("\n").length, '4');
    })
    it('license key should begin with ====BEGIN LICENSE KEY====', function() {
      assert.equal(licenseKey.split("\n")[0], "====BEGIN LICENSE KEY====");
    });
    it('license key should contain pipes in second line', function() {
      assert.notEqual(licenseKey.split("\n")[1].indexOf("||"), -1);
    });
    it('exported public key has -----BEGIN PUBLIC KEY----- in first line', function() {
      publicKey = generator.exportPublicKey();
      assert.equal(publicKey.split("\n")[0], "-----BEGIN PUBLIC KEY-----");
    });
  });

  describe('Validating License Keys', function() {
    var validator;
    before(function() {
      validator = new SoftwareLicenseKey(publicKey);
    });

    it('should not be able to generate a license key', function() {
      assert.throws(()=> {validator.generateLicense()});
    });

    it('exported public key should match public key', function() {
      assert.equal(validator.exportPublicKey(), publicKey);
    });

    it ('should not be able to export a private key', function() {
      assert.throws(()=>{validator.exportPrivateKey()}, "The key is not a private key. Cannot export private key from public key.");
    });

    it('should be able to validate license key', function() {
      assert.equal(JSON.stringify(validator.validateLicense(licenseKey)), "{\"fakeField\":\"Fake Data\"}");
    });

  });
});
