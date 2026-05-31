import Preset from "./preset";

export default class Instrument {

	#parent = null;
	#instrument = null;
	#catalog = null;

	constructor(parent, instrument, catalog = null) {
		this.#parent = parent;
		this.#instrument = instrument;
		this.#catalog = catalog;
		this.#create();
	}

	#create() {
		const details = this.#parent.create('details');
		details.create('summary', null, this.#instrument.name);
		const container = details.create('div', 'presets_details');

		
		this.#instrument.presets.forEach(preset => {
			const match = preset.id.match(/[0-9]{3}([0-9]+)_(.*)/i);
			preset.label = `${preset.name} / ${match[2]} #${+match[1] + 1}`;
		});

		this.#instrument.presets = this.#instrument.presets.sort((a, b) => a.label.localeCompare(b.label));		
		this.#instrument.presets.forEach(preset => {
			new Preset(container, preset, this.#catalog);
		});


	}

}