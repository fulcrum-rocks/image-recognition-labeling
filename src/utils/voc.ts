import * as path from "path";
import * as fs from "fs";
import * as pickle from "pickle";
import { parseStringPromise } from "xml2js";
import { IAnnotation, Iimg, IObject } from "./interfaces";
var xml = require("xml-js");
export function parse_voc_annotation(ann_dir, img_dir, cache_name, labels) {
	labels = labels || [];
	let all_insts = [];
	let seen_labels = [];

	// ===================== Cache exist ===============
	// const exist = fs.existsSync(cache_name);
	// if (exist) {
	// 	const handle = fs.readFileSync(cache_name).toString();
	// 	const cache = JSON.parse(handle);
	// 	all_insts = cache["all_insts"];
	// 	seen_labels = cache["seen_labels"];
	// }

	// ===================== Load add files ===============
	let sorted: string[] = []; // xml files names
	let tree: IAnnotation[] = []; // xml to json structure

	// ===================== Load file and sort ==========
	const files = fs.readdirSync(ann_dir);
	files.forEach(file => {
		sorted.push(file);
	});
	sorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
	// =================== Convert XML to json ==========
	sorted.forEach(async ann => {
		const xmlData = fs
			.readFileSync(path.join(ann_dir, ann))
			.toString("utf8");
		const jsonData = xml.xml2json(xmlData, {
			compact: true,
			spaces: 4,
		});
		tree.push(JSON.parse(jsonData));
	});
	// ===========================================
	if (tree) {
		tree.forEach((elem: IAnnotation) => {
			const img: Iimg = {};
			let obj: any = [];
			const ann = elem.annotation;

			// ===================== Img =================
			img.filename = path.join(img_dir, ann.filename._text);
			img.width = ann.size.width._text;
			img.height = ann.size.height._text;

			// ================== Always array object =========
			if (Array.isArray(ann.object)) {
				obj = ann.object;
			} else {
				obj = [ann.object];
			}

			// ============== Push if seen (few picture types) ===========
			if (obj.name in seen_labels) {
				seen_labels[obj.name] += 1;
			} else {
				seen_labels[obj.name] = 1;
			}

			// =================== Create object with Cords ==============
			let object: IObject[] = [];
			obj.forEach(elem => {
				const cords = {};
				cords["name"] = elem.name._text;
				cords["xmin"] = Math.floor(Math.round(elem.bndbox.xmin._text));
				cords["ymin"] = Math.floor(Math.round(elem.bndbox.ymin._text));
				cords["xmax"] = Math.floor(Math.round(elem.bndbox.xmax._text));
				cords["ymax"] = Math.floor(Math.round(elem.bndbox.ymax._text));
				if (cords["name"] in seen_labels) {
					seen_labels[cords["name"]] += 1;
				} else {
					seen_labels[cords["name"]] = 1;
				}

				object.push(cords);
			});

			// ================== If already exist ================
			if (labels.length > 0 && obj["name"]! in labels) {
			} else {
				img.object = object;
			}
			all_insts.push(img);
		});
	}

	// =================== Save to cashe ===============
	// fs.writeFileSync(
	// 	`${cache_name}`,
	// 	JSON.stringify({
	// 		all_insts,
	// 		seen_labels,
	// 	})
	// );
	const result = {
		all_insts,
		seen_labels,
	};
	return result;
}
