[![Build
Status](https://travis-ci.org/diracdeltas/signal-muon.svg?branch=master)](https://travis-ci.org/diracdeltas/signal-muon)

# Signal Muon

[Signal Desktop](https://github.com/WhisperSystems/Signal-Desktop) built on top
of [Muon](https://github.com/Brave/muon) so you can run it without Google
Chrome.

*THIS IS NOT PRODUCTION READY. Use at your own risk.* I am in no way affiliated
with WhisperSystems.

## Installing

### Prerequisites

You must have git, node 7.x, and either npm or Yarn installed. Then:

```
git clone --recursive https://github.com/diracdeltas/signal-muon.git
cd signal-muon
npm install
```

### Building

With npm:

```
npm run build
```

With Yarn:

```
yarn run build
```

Then open the app in the build directory logged in the console. Ex: `open
Signal-darwin-x64/Signal.app/` on MacOS.

### Updating

First fetch changes:

```
git pull origin master
git submodule update --recursive
```

If you are updating by a [MAJOR or MINOR](http://semver.org/) version number (ex:
0.0.3 to 0.1.0, or 0.1.0 to 1.0.0), run the following step to get an updated version of chromium. If you are
updating by a PATCH version (ex: 0.0.2 to 0.0.3), skip the following step.

```
npm run muon-update
```

Then re-build the package.

## Running in development mode

To run in development mode with the Signal staging server (no need to pair
with a mobile device), do `npm/yarn start` instead of `npm/yarn run build`.

## Caveats

In development mode, you can only message accounts that are registered on the Signal **staging**
server, so you will probably be very lonely unless you want to talk to other
Signal contributors. If you want someone to talk to, my test number is (oldest
telephone area code in San Francisco) + (decimal char code of capital Epsilon) + (the 513th prime).

If you want to link Signal-Muon to your mobile device so that you can talk
to your contacts, you need to do a build.
