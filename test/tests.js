var assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
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
      assert.strictEqual(licenseKey.split("\n").length, 4);
    })
    it('license key should begin with ====BEGIN LICENSE KEY====', function() {
      assert.equal(licenseKey.split("\n")[0], "====BEGIN LICENSE KEY====");
    });
    it('license key should contain pipes in second line', function() {
      assert.notEqual(licenseKey.split("\n")[1].indexOf("||"), -1);
    });
    it('license key should end with ====END LICENSE KEY====', function() {
      var lines = licenseKey.split("\n");
      assert.strictEqual(lines[lines.length - 1], "====END LICENSE KEY====");
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
      assert.throws(()=>{validator.exportPrivateKey()}, new Error("The key is not a private key. Cannot export private key from public key."));
    });

    it('should be able to validate license key', function() {
      assert.equal(JSON.stringify(validator.validateLicense(licenseKey)), "{\"fakeField\":\"Fake Data\"}");
    });

  });

  describe('Key export', function() {
    it('exportPrivateKey() without path returns PEM string', function() {
      var pem = generator.exportPrivateKey();
      assert.strictEqual(typeof pem, 'string');
      assert(pem.includes('-----BEGIN RSA PRIVATE KEY-----'), 'should contain private key header');
      assert(pem.includes('-----END RSA PRIVATE KEY-----'), 'should contain private key footer');
    });
  });

  describe('Key export to file', function() {
    var tempDir;
    before(function() {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'software-license-key-test-'));
    });
    after(function() {
      try {
        fs.rmSync(tempDir, { recursive: true });
      } catch (e) {}
    });

    it('exportPrivateKey(filePath) writes PEM to file', function() {
      var keyPath = path.join(tempDir, 'private.pem');
      generator.exportPrivateKey(keyPath);
      assert(fs.existsSync(keyPath), 'file should exist');
      var content = fs.readFileSync(keyPath, 'utf8');
      assert(content.includes('-----BEGIN RSA PRIVATE KEY-----'));
      assert(content.includes('-----END RSA PRIVATE KEY-----'));
    });

    it('exportPublicKey(filePath) writes PEM to file', function() {
      var keyPath = path.join(tempDir, 'public.pub');
      generator.exportPublicKey(keyPath);
      assert(fs.existsSync(keyPath), 'file should exist');
      var content = fs.readFileSync(keyPath, 'utf8');
      assert(content.includes('-----BEGIN PUBLIC KEY-----'));
      assert(content.includes('-----END PUBLIC KEY-----'));
    });

    it('validator can be created from exported public key file', function() {
      var publicPath = path.join(tempDir, 'exported.pub');
      generator.exportPublicKey(publicPath);
      var keyFromFile = fs.readFileSync(publicPath, 'utf8');
      var fileValidator = new SoftwareLicenseKey(keyFromFile);
      var license = generator.generateLicense({ fromFile: true });
      assert.deepStrictEqual(fileValidator.validateLicense(license), { fromFile: true });
    });
  });
});

describe('Generate license error cases', function() {
  var generator;
  before(function() {
    generator = new SoftwareLicenseKey();
  });

  it('generateLicense(null) throws', function() {
    assert.throws(
      function() { generator.generateLicense(null); },
      /No license key data provided/
    );
  });

  it('generateLicense(undefined) throws', function() {
    assert.throws(
      function() { generator.generateLicense(); },
      /No license key data provided/
    );
  });
});

describe('Validate license error cases', function() {
  var generator;
  var validator;
  var validLicense;
  before(function() {
    generator = new SoftwareLicenseKey();
    validLicense = generator.generateLicense({ foo: 'bar' });
    validator = new SoftwareLicenseKey(generator.exportPublicKey());
  });

  it('validates valid license', function() {
    assert.deepStrictEqual(validator.validateLicense(validLicense), { foo: 'bar' });
  });

  it('throws on empty string', function() {
    assert.throws(function() { validator.validateLicense(''); });
  });

  it('throws on malformed license (too few lines)', function() {
    var malformed = '====BEGIN LICENSE KEY====\nonly-one-line\n====END LICENSE KEY====';
    assert.throws(
      function() { validator.validateLicense(malformed); },
      /Invalid data|Invalid Data|signature invalid/
    );
  });

  it('throws when license was generated with different key pair', function() {
    var otherGenerator = new SoftwareLicenseKey();
    var otherLicense = otherGenerator.generateLicense({ other: true });
    assert.throws(
      function() { validator.validateLicense(otherLicense); },
      /Invalid data|Invalid Data|signature invalid/
    );
  });
});

describe('User-provided PEM keys', function() {
  var generator;
  var validator;
  var privateKeyPem;
  var publicKeyPem;
  before(function() {
    var temp = new SoftwareLicenseKey();
    privateKeyPem = temp.exportPrivateKey();
    publicKeyPem = temp.exportPublicKey();
    generator = new SoftwareLicenseKey(privateKeyPem);
    validator = new SoftwareLicenseKey(publicKeyPem);
  });

  it('generates license with private key instance', function() {
    var license = generator.generateLicense({ userId: 'u1', plan: 'pro' });
    assert.strictEqual(license.split('\n').length, 4);
    assert(license.startsWith('====BEGIN LICENSE KEY===='));
  });

  it('validates license with matching public key', function() {
    var license = generator.generateLicense({ userId: 'u1', plan: 'pro' });
    var data = validator.validateLicense(license);
    assert.strictEqual(data.userId, 'u1');
    assert.strictEqual(data.plan, 'pro');
  });
});

describe('Invalid PEM in constructor', function() {
  it('throws when given invalid private key string', function() {
    assert.throws(
      function() { new SoftwareLicenseKey('not-a-valid-pem'); },
      /key|PEM|parse|invalid/i
    );
  });

  it('throws when given invalid public key string', function() {
    assert.throws(
      function() { new SoftwareLicenseKey('-----BEGIN PUBLIC KEY-----\ninvalid\n-----END PUBLIC KEY-----'); },
      /key|PEM|parse|invalid|Error/i
    );
  });

  it('throws when given empty string', function() {
    assert.throws(function() { new SoftwareLicenseKey(''); });
  });
});
