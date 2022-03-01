// common parameters
const AuthenticationType = 'http_signature';
const RunEnvironment = 'apitest.cybersource.com';
const MerchantId = 'evalwfsaw';

// http_signature parameters
const MerchantKeyId = '4820b6bc-bb01-4bf9-8ffa-4685b2060e75';
const MerchantSecretKey = 'U5Mzdc8OueUpUyJ9zzfzXpQDhVW3VK3NmNfh0W4bEFQ=';

// jwt parameters
const KeysDirectory = 'Resource';
const KeyFileName = 'evalwfsaw';
const KeyAlias = 'evalwfsaw';
const KeyPass = 'evalwfsaw';

//meta key parameters
const UseMetaKey = false;
const PortfolioID = '';

// logging parameters
const EnableLog = true;
const LogFileName = 'cybs';
const LogDirectory = '../log';
const LogfileMaxSize = '5242880'; //10 MB In Bytes

// Constructor for Configuration
function Configuration() {

	var configObj = {
		'authenticationType': AuthenticationType,	
		'runEnvironment': RunEnvironment,

		'merchantID': MerchantId,
		'merchantKeyId': MerchantKeyId,
		'merchantsecretKey': MerchantSecretKey,
        
		'keyAlias': KeyAlias,
		'keyPass': KeyPass,
		'keyFileName': KeyFileName,
		'keysDirectory': KeysDirectory,

		'useMetaKey': UseMetaKey,
		'portfolioID': PortfolioID,
        
		'enableLog': EnableLog,
		'logFilename': LogFileName,
		'logDirectory': LogDirectory,
		'logFileMaxSize': LogfileMaxSize
	};
	return configObj;

}

module.exports = Configuration;