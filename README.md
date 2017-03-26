[![Build
Status](https://travis-ci.org/diracdeltas/signal-muon.svg?branch=master)](https://travis-ci.org/diracdeltas/signal-muon)

# Signal Muon

[Signal Desktop](https://github.com/WhisperSystems/Signal-Desktop) built on top
of [Muon](https://github.com/Brave/muon) so you can run it without Google
Chrome.

*THIS IS NOT PRODUCTION READY. Use at your own risk.* I am in no way affiliated
with WhisperSystems.

## Running in development mode

You must have node 7.x and npm or Yarn installed.

With npm:

```
git clone --recursive https://github.com/diracdeltas/signal-muon.git
cd signal-muon
npm install
npm start
```

With Yarn:

```
git clone --recursive https://github.com/diracdeltas/signal-muon.git
cd signal-muon
yarn install
yarn start
```

## Building

With npm:

```
npm run build
```

With Yarn:

```
yarn run build
```

## Caveats

In development mode, you can only message accounts that are registered on the Signal **staging**
server, so you will probably be very lonely unless you want to talk to other
Signal contributors. If you want someone to talk to, my test number is (oldest
telephone area code in San Francisco) + (decimal char code of capital Epsilon) + (the 513th prime).

If you want to link Signal-Muon to your mobile device so that you can talk
to your contacts, you need to do a build.
