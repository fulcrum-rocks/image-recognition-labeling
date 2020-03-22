export interface IAnnotation {
	annotation: {
		folder: { _text: string };
		filename: { _text: string };
		path: { _text: string };
		source: { database: any };
		size: {
			width: { _text: number };
			height: { _text: number };
			depth: { _text: number };
		};
		segmented: { _text: number };
		object: {
			name: { _text: string };
			pose: { _text: string };
			truncated: { _text: number };
			difficult: { _text: number };
			bndbox: any;
		};
	};
}
