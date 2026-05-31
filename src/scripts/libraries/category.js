import Instrument from "./instrument";


export default class Category {

	#parent = null;
	#category = null;
	#catalog = null;

	constructor(parent, category, catalog = null) {
		this.#parent = parent;
		this.#category = category;
		this.#catalog = catalog;
		this.#create();
	}

	#create() {
		const details = this.#parent.create('details');
		details.create('summary', null, this.#category.name);
		const container = details.create('div', 'instruments_details');
		this.#category.instruments.forEach(instrument => {
			new Instrument(container, instrument, this.#catalog);
		});



	}

}