export class CustomDetectionUtils {
	__labels: any;
	__colors: any[];
	constructor(labels) {
		this.__labels = labels;
		this.__colors = [];
		for (let i = 0; i < labels.length; i++) {
			const color_space_values = [...Array(3)].map(
				e => ~~(Math.random() * (255 - 50)) + 50
			);
			const red = color_space_values[0];
			const green = color_space_values[1];
			const blue = color_space_values[2];
			this.__colors.push([red, green, blue]);
		}
	}
}
