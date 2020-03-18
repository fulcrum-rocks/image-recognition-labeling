import * as fs from "fs";
import * as ET from "elementtree";

export function parse_voc_annotation(
	ann_dir: string,
	img_dir: string,
	cache_name: string,
	labels: string[] = []
) {
	let all_insts = [];
	let seen_labels: {} = {};
	const exist = fs.existsSync(cache_name);
	// ===================== Cache exist ===============
	if (exist) {
		const handle = fs.readFileSync(cache_name).toString();
		let cache = JSON.parse(handle);
		all_insts = cache["all_insts"];
		seen_labels = cache["seen_labels"];
	} else {
		// ===================== Load add files ===============
		fs.readdirSync(ann_dir)
			.sort()
			.forEach(async ann => {
				const img = {};
				const xmlData = fs
					.readFileSync(`${ann_dir}\\${ann}`)
					.toString();
				const et = ET.parse(xmlData);

				// ===================== Img =================
				img["filename"] = `${img_dir}\\${et.findtext("filename")}`;
				img["width"] = Number(et.findtext("size/width"));
				img["height"] = Number(et.findtext("size/height"));

				// ====================== Object ===============
				for (const object of et.findall("object")) {
					const obj = {};
					obj["name"] = object.findtext("name");
					// ================= Image count ================
					if (obj["name"] in seen_labels) {
						seen_labels[obj["name"]] += 1;
					} else {
						seen_labels[obj["name"]] = 1;
					}

					// ================= append object to image ============
					for (const bndbox of object.findall("bndbox")) {
						obj["xmin"] = bndbox.findtext("xmin");
						obj["ymin"] = bndbox.findtext("ymin");
						obj["xmax"] = bndbox.findtext("xmax");
						obj["ymax"] = bndbox.findtext("ymax");
					}

					// ================= Push object to image ===============
					if (labels.length > 0 && !labels.includes(obj["name"])) {
						break;
					} else {
						if (img["object"]) {
							img["object"].push(obj);
						} else {
							img["object"] = [obj];
						}
					}
				}
				if (img["object"].length > 0) {
					all_insts.push(img);
				}
			});

		const cache = JSON.stringify({
			all_insts: all_insts,
			seen_labels: seen_labels,
		});
		fs.writeFileSync(cache_name, cache);
	}
	return { all_insts, seen_labels };
}
