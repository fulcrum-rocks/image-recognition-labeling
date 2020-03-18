export interface IAnnotation {
<<<<<<< HEAD
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
=======
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

export interface Iimg {
	filename?: string;
	width?: number;
	height?: number;
	object?: any[];
}

export interface IObject {
	name?: string;
	xmin?: number;
	ymin?: number;
	xmax?: number;
	ymax?: number;
>>>>>>> 4af1ed38d7a1af7ccc8aca4a839094eebde7fc18
}
