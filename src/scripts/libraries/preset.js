export default class Preset {

	#parent = null;
	#preset = null;
	#catalog = null;

	#loaded = false;
	#details = null;
	#container = null;


	constructor(parent, preset, catalog = null) {
		this.#parent = parent;
		this.#preset = preset;
		this.#catalog = catalog;
		this.#create();
	}


	#create() {
		const parts = this.#preset.id.match(/([0-9]{3})/i);
		this.#details = details = this.#parent.create('details');
		this.#details.create('summary', null, escapeHTML(this.#preset.label));
		this.#container = this.#details.create('div', 'scales_details', 'Loading...');
		this.#details.addEventListener('toggle', async () => {
			if(this.#details.open && !this.#loaded) {
				const preset = await busy(this.#catalog.getPreset(this.#preset.id));
				this.#container.replaceChildren();
				if(+parts[1] == 128) {
					this.#container.create('button', null, 'Drum Solo ▶').addEventListener('click', async () => {
						await playing(this.#catalog.drumSolo(this.#preset.id));
					});
				} else {
					this.#container.create('button', null, 'Harmonic Minor ▶').addEventListener('click', async () => {
						await playing(this.#catalog.playScale(this.#preset.id, 'minor'));
					});
					this.#container.create('button', null, 'Phrygian ▶').addEventListener('click', async () => {
						await playing(this.#catalog.playScale(this.#preset.id, 'phrygian'));
					});
					this.#container.create('button', null, 'Dorian ▶').addEventListener('click', async () => {
						await playing(this.#catalog.playScale(this.#preset.id, 'dorian'));
					});
				}
				this.#container.create('span', null, `<span class="incode presetIndex">${this.#preset.index}</span>&nbsp;&nbsp;<span class="incode presetId">${this.#preset.id}</span>&nbsp;&nbsp;<span class="presetzones">(${preset.value.zones.length} zones)</span>`);
				this.#container.querySelector('.presetIndex').addEventListener('click', () => {
					if(copyToClipboard(this.#preset.index)) this.#catalog.notification.thumbsUp("Preset Index copied");
					else this.#catalog.notification.error("Error copying Preset Index");
				});
				this.#container.querySelector('.presetId').addEventListener('click', () => {
					if(copyToClipboard(this.#preset.id)) this.#catalog.notification.thumbsUp("Preset ID copied");
					else this.#catalog.notification.error("Error copying Preset ID");
				});
				this.#loaded = true;
			}
		});
	}

}