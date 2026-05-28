# WebAudioFonts

**A complete open-source stack for MIDI audio playback in the browser.**

WebAudioFonts is a collection of three focused projects that work together to bring high-quality, instrument-rich MIDI playback to any web application — with no plugins, no server-side audio processing, and no heavy runtime dependencies.

---

## The Stack

```
┌─────────────────────────────────────────────────┐
│                Your Application                 │
├─────────────────────────────────────────────────┤
│               midi-audio-player                 │  ← Playback engine / API
├────────────────────────┬────────────────────────┤
│   webaudiofontplayer   │        sf2-json        │  ← Audio engine  /  Preset CDN
├────────────────────────┴────────────────────────┤
│                  Web Audio API                  │
└─────────────────────────────────────────────────┘
```

| Project | Role | Package |
|---|---|---|
| [**midi-audio-player**](#midi-audio-player) | High-level MIDI player with full API, EQ, reverb, karaoke, and event system | `npm install midi-audio-player` |
| [**webaudiofontplayer**](#webaudiofontplayer) | Low-level Web Audio engine — schedules notes, handles controllers and pitch bend | `npm install webaudiofontplayer` |
| [**sf2-json**](#sf2-json) | SoundFont-to-JSON pipeline and preset CDN — converts `.sf2` banks into streamable preset files | Self-hosted |

---

## midi-audio-player

> **The main entry point for most use cases.**

A full-featured MIDI playback engine. Load a `.mid` file from a URL, `ArrayBuffer`, or Base64 string, and play it with a rich Web Audio signal chain — all in a few lines of code.

**Highlights:**
- Automatic instrument preset resolution and streaming
- 10-band parametric EQ with named presets
- Convolution reverb
- Per-channel volume control
- Karaoke mode with timed HTML lyric frames and vocal channel muting
- Auto-repair of corrupted MIDI files and silence trimming
- SVG waveform generation and real-time amplitude metering
- Full MIDI protocol support (pitch bend, controllers, program change)
- IndexedDB preset cache — presets are only downloaded once
- ESM-native, works with any bundler or vanilla browser environment

```ts
import MidiAudioPlayer from 'midi-audio-player';

const player = new MidiAudioPlayer({ volume: 0.8, reverb: 0.2, eqPreset: 'jazz' });

player.on('computed', ({ title, duration }) => console.log(`${title} — ${duration.toFixed(1)}s`));
player.on('endOfFile', () => this.playNextSong());

await player.play('https://example.com/song.mid');
```

**Repository:** [github.com/WebAudioFonts/midi-audio-player](https://github.com/WebAudioFonts/midi-audio-player)
&nbsp;·&nbsp;
**npm:** [npmjs.com/package/midi-audio-player](https://www.npmjs.com/package/midi-audio-player)

---

## webaudiofontplayer

> **The low-level audio engine powering midi-audio-player.**

A lightweight Web Audio scheduler that takes WebAudioFont preset data and renders it through the Web Audio API. Handles note queuing, sustain pedal, pitch bend, MIDI controllers, and envelope management.

Use this directly if you need fine-grained control over note scheduling — for a step sequencer, a custom MIDI router, or any application that doesn't need the full MIDI file pipeline.

```ts
import WebAudioFontPlayer from 'webaudiofontplayer';

const audioCtx = new AudioContext();
const player = new WebAudioFontPlayer(preset, audioCtx, destination);

player.queueWaveTable(audioCtx.currentTime, noteNumber, duration, volume);
```

**Repository:** [github.com/WebAudioFonts/webaudiofontplayer](https://github.com/WebAudioFonts/webaudiofontplayer)
&nbsp;·&nbsp;
**npm:** [npmjs.com/package/webaudiofontplayer](https://www.npmjs.com/package/webaudiofontplayer)

---

## sf2-json

> **Convert any SoundFont into a streamable preset library.**

A build pipeline that takes `.sf2` SoundFont files and converts them into individual JSON preset files, along with a `catalog.json` index. The output can be deployed as a static site and used as a drop-in replacement for the default WebAudioFonts CDN.

Use this if you want to:
- Self-host presets to reduce latency or eliminate CDN dependency
- Curate a custom instrument set from any `.sf2` bank
- Build a private preset library for a specific application

Once deployed, point `midi-audio-player` at your endpoint:

```ts
const player = new MidiAudioPlayer({
    endpoint: 'https://my-cdn.example.com/presets/',
});
```

**Repository:** [github.com/WebAudioFonts/sf2-json](https://github.com/WebAudioFonts/sf2-json)

---

## Preset CDN

The default preset endpoint (`https://webaudiofonts.github.io/presets/`) hosts **3,000+ free instrument presets** derived from multiple open-source SoundFont banks, including FluidR3 GM, Aspirin, Musyng Kite, and more.

Presets are automatically cached in IndexedDB by `midi-audio-player`, so they are only downloaded once per browser session.

---

## Browser Compatibility

All projects require a modern browser with:
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## License

All projects are released under the [MIT License](LICENSE).

## Author

Maxime Larrivée-Roy
