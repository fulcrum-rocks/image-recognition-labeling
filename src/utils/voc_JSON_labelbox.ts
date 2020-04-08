import * as fs from "fs";
import * as cv from "opencv4nodejs";

export function parse_voc_annotation_labelbox_JSON(
	ann_dir: string,
	img_dir: string,
	cache_name: string,
	labels: string[] = []
) {
	let all_insts = [];
	let seen_labels: {} = {};
	let exist = fs.existsSync(cache_name);
	exist = null;
	// ===================== Cache exist ===============
	if (exist) {
		const handle = fs.readFileSync(cache_name).toString();
		let cache = JSON.parse(handle);
		all_insts = cache["all_insts"];
		seen_labels = cache["seen_labels"];
	} else {
		// ===================== Load add files ===============

		const data = fs.readFileSync(`${ann_dir}\\1.json`).toString();
		const JsonData = JSON.parse(data);

		JsonData.forEach(ann => {
			console.log(`${img_dir}\\${ann["External ID"]}`);
			const image = cv.imread(`${img_dir}\\${ann["External ID"]}`);
			const size = image.sizes;
			console.log(size);

			// ===================== Img =================
			const img = {};
			img["filename"] = `${ann["External ID"]}`;
			img["height"] = size[0];
			img["width"] = size[1];
			const path = `${ann_dir}\\${img["filename"]}`;

			// ====================== Object ===============
			ann.Label.mask.forEach(object => {
				const obj = {};
				obj["name"] = "mask";
				// ================= Image count ================
				if (obj["name"] in seen_labels) {
					seen_labels[obj["name"]] += 1;
				} else {
					seen_labels[obj["name"]] = 1;
				}

				// ================= append object to image ============
				const xArr: number[] = [];
				const yArr: number[] = [];
				object.geometry.forEach(e => {
					xArr.push(e.x);
					yArr.push(e.y);
				});
				obj["xmin"] = [Math.min(...xArr)];
				obj["ymin"] = [Math.min(...yArr)];
				obj["xmax"] = [Math.max(...xArr)];
				obj["ymax"] = [Math.max(...yArr)];

				console.log(ann["External ID"]);

				// ================= Push object to image ===============
				if (labels.length > 0 && !labels.includes(obj["name"])) {
				} else {
					if (img["object"]) {
						img["object"].push(obj);
					} else {
						img["object"] = [obj];
					}
				}
			});

			if (img["object"].length > 0) {
				all_insts.push(img);
			}
			Save_VOC_models(img, path, ann_dir);
		});

		const cache = JSON.stringify({
			all_insts: all_insts,
			seen_labels: seen_labels,
		});
		fs.writeFileSync(cache_name, cache);
	}
	return { all_insts, seen_labels };
}

export const Save_VOC_models = (img, _path, ann_dir) => {
	var et = require("elementtree");
	var XML = et.XML;
	var ElementTree = et.ElementTree;
	var element = et.Element;
	var subElement = et.SubElement;
	let annotation,
		folder,
		filename,
		path,
		source,
		database,
		size,
		width,
		height,
		depth,
		segmented,
		object,
		name,
		pose,
		truncated,
		difficult,
		bndbox,
		xmin,
		ymin,
		xmax,
		ymax;

	annotation = element("annotation");

	folder = subElement(annotation, "folder");
	folder.text = "images";

	filename = subElement(annotation, "filename");
	filename.text = img.filename;

	path = subElement(annotation, "path");
	path.text = _path;

	source = subElement(annotation, "source");
	database = subElement(source, "database");
	database.text = "Unknown";

	size = subElement(annotation, "size");
	width = subElement(size, "width");
	width.text = img.width;
	height = subElement(size, "height");
	height.text = img.height;
	depth = subElement(size, "depth");
	depth.text = img.depth ? img.depth : 3;

	segmented = subElement(annotation, "segmented");
	segmented.text = "0";

	if (img.object) {
		img.object.forEach(_object => {
			object = subElement(annotation, "object");
			name = subElement(object, "name");
			name.text = _object.name;
			pose = subElement(object, "pose");
			pose.text = _object.pose ? _object.pose : "Unspecified";
			truncated = subElement(object, "truncated");
			truncated.text = _object.truncated ? _object.truncated : "0";
			difficult = subElement(object, "difficult");
			difficult.text = _object.difficult ? _object.difficult : "0";
			bndbox = subElement(object, "bndbox");
			xmin = subElement(bndbox, "xmin");
			xmin.text = _object.xmin;
			ymin = subElement(bndbox, "ymin");
			ymin.text = _object.ymin;
			xmax = subElement(bndbox, "xmax");
			xmax.text = _object.xmax;
			ymax = subElement(bndbox, "ymax");
			ymax.text = _object.ymax;
		});
	}

	const etree = new ElementTree(annotation);
	const xml = etree.write({ xml_declaration: false });

	fs.writeFileSync(
		`${ann_dir}\\${img.filename.replace(".jpg", ".xml")}`,
		xml
	);
	return "ok";
};
