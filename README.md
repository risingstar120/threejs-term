# Three.js on the Terminal

This is an example of how you can run three.js in your terminal.
Sysadmins can now run three.js in remote ssh sessions!

### Install and Running

```
npm i -g threejs-term
threejs-term
```

### Features
- Shows off using three.js in node based environments.
- Terminal / ASCII based rendering
- Screen resize detection aka "Responsive Design"!
- Support mouse events
- Emulate keypress

### Internals
This is built with some awesome libraries.
- [three.js](https://github.com/mrdoob/three.js/) - Duh!
- [blessed](https://github.com/chjj/blessed) - Loads of terminal goodness!
- [node-canvas](https://github.com/Automattic/node-canvas) - Canvas emulation on node.js

### Development

Play with the [source](https://github.com/zz85/threejs-term/blob/master/play.js)

Install dependencies
```
yarn install # or npm install
```

Run
```
node play.js
```

It's tricky to debug blessed apps (since console.log's gonna messup the terminal),
so I'll pipe console.error messages to a log file and tail it elsewhere.
log() helper function can also be used.

```
node play.js 2>> logs.txt
tail -f logs.txt
```

### Made by
Yet another random idea by the [Graphics Noob](https://twitter.com/BlurSpline)