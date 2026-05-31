import Category from "../libraries/category";
import WebAudioFontPlayer from "webaudiofontplayer";
import indexedDbStorage from "../libraries/indexeddbstorage";


const DRUM_SOLO = [
    // Mesure 1 — groove de base
    { midi: 36, time: 0.0  }, // kick
    { midi: 42, time: 0.0  }, // hi-hat
    { midi: 38, time: 0.5  }, // snare
    { midi: 42, time: 0.5  }, // hi-hat
    { midi: 36, time: 1.0  }, // kick
    { midi: 42, time: 1.0  }, // hi-hat
    { midi: 38, time: 1.5  }, // snare
    { midi: 42, time: 1.5  }, // hi-hat

    // Mesure 2 — fill descendant
    { midi: 50, time: 2.0  }, // high tom
    { midi: 48, time: 2.25 }, // hi-mid tom
    { midi: 47, time: 2.5  }, // low-mid tom
    { midi: 45, time: 2.75 }, // low tom
    { midi: 43, time: 3.0  }, // floor tom
    { midi: 36, time: 3.25 }, // kick
    { midi: 36, time: 3.5  }, // kick double
    { midi: 49, time: 3.75 }, // crash
];

const PROGRAM_ROOT_MIDI = [
    // 0–7 : Pianos
    60, 60, 60, 60, 60, 60, 60, 60,

    // 8–15 : Chromatic Perc
    60, 60, 60, 60, 60, 60, 60, 60,

    // 16–23 : Orgues
    60, 60, 60, 60, 60, 60, 60, 60,

    // 24–31 : Guitares
    // Nylon, Steel, Jazz, Clean, Muted, Overdrive, Distortion, Harmonics
    52, 52, 52, 52, 52, 52, 52, 64,

    // 32–39 : Basses
    40, 40, 40, 40, 40, 40, 40, 40,

    // 40–47 : Cordes
    // Violin, Viola, Cello, Contrabass, Tremolo, Pizzicato, Harp, Timpani
    69, 62, 50, 40, 62, 62, 60, 40,

    // 48–55 : Ensemble
    60, 60, 60, 60, 65, 65, 65, 60,

    // 56–63 : Cuivres
    // Trumpet, Trombone, Tuba, Muted Trumpet, French Horn, Brass, Synth Brass x2
    62, 52, 45, 62, 60, 60, 60, 60,

    // 64–71 : Reed
    // Soprano Sax, Alto Sax, Tenor Sax, Baritone Sax, Oboe, English Horn, Bassoon, Clarinet
    65, 60, 55, 48, 65, 60, 52, 62,

    // 72–79 : Pipe (flûtes)
    // Piccolo, Flute, Recorder, Pan Flute, Blown Bottle, Shakuhachi, Whistle, Ocarina
    72, 67, 65, 65, 65, 65, 70, 65,

    // 80–87 : Synth Lead
    60, 60, 60, 60, 60, 60, 60, 60,

    // 88–95 : Synth Pad
    60, 60, 60, 60, 60, 60, 60, 60,

    // 96–103 : Synth Effects
    60, 60, 60, 60, 60, 60, 60, 60,

    // 104–111 : Ethnic
    // Sitar, Banjo, Shamisen, Koto, Kalimba, Bagpipe, Fiddle, Shanai
    60, 60, 60, 60, 60, 60, 62, 60,

    // 112–119 : Percussif
    60, 60, 60, 60, 60, 60, 60, 60,

    // 120–127 : Sound Effects
    60, 60, 60, 60, 60, 60, 60, 60,
];


const SCALES = {
    phrygian: {
        rootOffset: 0,
        intervals: [0, 1, 3, 5, 7, 8, 10, 12],
    },
    dorian: {
        rootOffset: -2,
        intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    },
    minor: {
        rootOffset: -7,
        intervals: [0, 2, 3, 5, 7, 8, 11, 12],
    },
};

const NOTE_DURATION = 0.5; // secondes
const NOTE_GAP      = 0.6; // secondes entre les notes


const CATALOG = {

	endpoint: 'https://webaudiofonts.com/presets/',
	catalog: null,
	parent: null,
	container: null,
	audioCtx: null,
	player: null,

	init: async function() {
		this.parent = document.querySelector('.categories');
		this.container = create('div');
		(await this.getCatalog()).categories.forEach(category => new Category(this.container, category, this));
		this.parent.replaceChildren(this.container);
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	},


    getCatalog: async function() {
        if(this.catalog) return this.catalog;
        const cachedata = await sessionStorage.getItem('waf_catalog');
        if (cachedata) this.catalog = JSON.parse(cachedata);
        else {
            const response = await fetch(`${this.endpoint}catalog.json`);
            if (!response.ok) throw new Error(`Impossible to download catalog: ${response.status}`);
            this.catalog = await response.json();
            await sessionStorage.setItem('waf_catalog', JSON.stringify(this.catalog));
        }
        const catalogDate = new Date(this.catalog.updatedAt).getTime();
        const catalogVersion = await indexedDbStorage.getItem(`waf_catalog_version`) || 1;
        if(catalogVersion < catalogDate) {
            await indexedDbStorage.clear();
            indexedDbStorage.setItem(`waf_catalog_version`, catalogDate)
        }
        return this.catalog;
    },


    getPreset: async function(id) {
        try {
            if(typeof id === 'object') return id;
            const cacheid = `waf_preset_${id}`;
            const cachedata = await indexedDbStorage.getItem(cacheid);
            if (cachedata) return JSON.parse(cachedata);
            const response = await fetch(`${this.endpoint}${id}.json`);
            const preset = await response.json();
            if(preset.zones === undefined) {
                console.error(`Invalid preset: ${$id}`);
                throw new Error(`Invalid preset: ${$id}`);
            }
            indexedDbStorage.setItem(cacheid, JSON.stringify(preset), true);
            return preset;
        } catch(e) {
            console.error(`Invalid preset: ${id}`);
            throw new Error(`Invalid preset: ${id}`);
        }
    },


	initPreset: async function(presetId) {
		if(!this.player) {
			const preset = await this.getPreset(presetId);
			this.player = await WebAudioFontPlayer.load(preset, this.audioCtx);
		}
		else if(this.player.preset.id != presetId) {
			const preset = await this.getPreset(presetId);
			await this.player.setPreset(preset);
		}
	},


	playScale: async function(presetId, scaleKey) {
		await this.initPreset(presetId);
		const parts = presetId.match(/([0-9]{3})/i);
		const scale = SCALES[scaleKey];
		const root = PROGRAM_ROOT_MIDI[+parts[1]] + (scale.rootOffset ?? 0);
		for (const semitones of scale.intervals) {
			this.player.queueWaveTable(this.audioCtx.currentTime, root + semitones, NOTE_DURATION, 0.5);
			await new Promise(r => setTimeout(r, NOTE_GAP * 1000));
		}
	},


	drumSolo: async function(presetId) {
		await this.initPreset(presetId);
		const startTime = this.audioCtx.currentTime + 0.1;
		for (const hit of DRUM_SOLO) {
			this.player.queueWaveTable(startTime + hit.time, hit.midi, 2, 0.5);
		}
		const totalDuration = Math.max(...DRUM_SOLO.map(h => h.time)) + 2.0;
		await new Promise(r => setTimeout(r, totalDuration * 1000));
	},


};


export default CATALOG;