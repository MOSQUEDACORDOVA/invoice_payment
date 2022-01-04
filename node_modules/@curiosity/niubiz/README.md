NIUBIZ(Perú) NODEJS *ex visanet
===

implementacion de NIUBIZ(Perú) para NodeJS

[ver ejemplo](https://github.com/arturoblack/visanet-nodejs-ejemplo)


Instalación
---

``` bash
npm i @curiosity/niubiz
```

Uso
---

Instanciacón de la clase Niubiz

``` js
const {Niubiz} = require('@arturoblack/niubiz');


const visa = new Niubiz({
  user: 'email',
  password: 'password',
  merchantId: 'codigo de comercio',
  env: 'dev', // por default es prod
});
```

Obtención de la llave de session

```js 
  // ontencion del token
  const securityToken = await visa.createToken();

  // cuerpo del mensaje
  const body = { 
    amount = 12.50, 
    channel: visa.channel, //web por defecto
    antifraud: 
      { 
        clientIp, 
        merchantDefineData: {MDD1: 'web', MDD2: 'Canl', MDD3: 'Canl'},
      },
  };

  // obtencion de la sessionKey (prar frontend)
  const {
    sessionKey,
    expirationTime
  } = await visa.createSession(securityToken, body);

```

Recepcion de la respuesta

``` js

    const body = {
      antifraud: null,
      captureType: 'manual',
      channel: visa.channel,
      countable: true,
      order: {
        amount:  12.50,
        currency: visa.currency, // PEN por defecto
        purchaseNumber,
        tokenId: transactionToken
      },
    };

    const payload = await visa.getAuthorization(securityToken, body);
```