import { parse_voc_annotation } from "./voc";
import * as tf from "@tensorflow/tfjs-node";
import * as np from "numjs";
import * as kmeans from "node-kmeans";
export async function generateAnchors(
	train_annotation_folder,
	train_image_folder,
	train_cache_file,
	model_labels
) {
	console.log(
		"Generating anchor boxes for training images and annotation..."
	);
	const num_anchors = 9;

	let train_imgs;
	let { all_insts, seen_labels } = parse_voc_annotation(
		train_annotation_folder,
		train_image_folder,
		train_cache_file,
		model_labels
	);

	let annotation_dims = [];
	all_insts.forEach(image => {
		image.object.forEach(obj => {
			let relative_w =
				(parseFloat(obj["xmax"]) - parseFloat(obj["xmin"])) /
				image["width"];
			let relatice_h =
				(parseFloat(obj["ymax"]) - parseFloat(obj["ymin"])) /
				image["height"];
			annotation_dims.push([relative_w, relatice_h]);
		});
	});
	const centroids = run_kmeans(annotation_dims, num_anchors);

	const anchors = centroids;

	// widths = anchors[:, 0]
	// sorted_indices = np.argsort(widths)

	// let anchor_array = []
	// let reverse_anchor_array = []
	// const out_string = ""
	// const r = "anchors: ["

	// for (i in sorted_indices){
	//   anchor_array.append(int(anchors[i, 0] * 416))
	//   anchor_array.append(int(anchors[i, 1] * 416))

	//   out_string += str(int(anchors[i, 0] * 416)) + ',' + str(int(anchors[i, 1] * 416)) + ', '
	// }

	// reverse_anchor_array.append(anchor_array[12:18])
	// reverse_anchor_array.append(anchor_array[6:12])
	// reverse_anchor_array.append(anchor_array[0:6])

	// print("Anchor Boxes generated.")
	// return anchor_array, reverse_anchor_array
}

function run_kmeans(ann_dims, anchor_num) {
	const kmeanslist = kmeans.clusterize(
		ann_dims,
		{ k: anchor_num },
		(err, res) => {
			if (err) console.error(err);
			else console.log("%o", res);
		}
	);
	return kmeanslist;
}
