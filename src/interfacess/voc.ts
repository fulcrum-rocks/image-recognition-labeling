export interface IVoc {
	object?: [
		{
			name?: string;
			xmin?: number;
			ymin?: number;
			xmax?: number;
			ymax?: number;
		}
	];
	filename?: string;
	width?: number;
	height?: number;
}

export interface IElementry {
	_root: {
		_id: number;
		tag: any | "annotation";
		attrib: object;
		text: string;
		tail: any;
		_children?: [
			{
				_id: number;
				tag:
					| "folder"
					| "filename"
					| "path"
					| "source"
					| "size"
					| "segmented"
					| "object";
				attrib: object;
				text: string;
				tail: any;
				_children?: [
					{
						_id: number;
						tag:
							| "database"
							| "width"
							| "height"
							| "depth"
							| "name"
							| "pose"
							| "truncated"
							| "difficult"
							| "bndbox";
						attrib: object;
						text: string;
						tail: any;
						_children?: [
							{
								_id: number;
								tag: "xmin" | "ymax" | "xmax" | "ymax";
								attrib: object;
								text: string;
								tail: any;
								_children?: any;
							}
						];
					}
				];
			}
		];
	};
}
