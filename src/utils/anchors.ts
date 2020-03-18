import { parse_voc_annotation } from "./voc";
import * as tf from "@tensorflow/tfjs-node";
import { k_means } from "./k_mean";
export async function generateAnchors(
	train_annotation_folder: string,
	train_image_folder: string,
	train_cache_file: string,
	model_labels: string[]
) {
	console.log(
		"Generating anchor boxes for training images and annotation..."
	);
	const num_anchors = 9;

	const annotations = parse_voc_annotation(
		train_annotation_folder,
		train_image_folder,
		train_cache_file,
		model_labels
	);

	const train_imgs = annotations.all_insts;
	const train_labels = annotations.seen_labels;

	// ==========  run k_mean to find the anchors =============
	let annotation_dims = [];
	train_imgs.forEach(image => {
		image.object.forEach(object => {
			const relative_w =
				(object["xmax"] - object["xmin"]) / image["width"];
			const relatice_h =
				(object["ymax"] - object["ymin"]) / image["height"];
			annotation_dims.push([relative_w, relatice_h]);
		});
	});

	const clasters = k_means(annotation_dims, num_anchors);
	const centroids = [];
	clasters.groups.forEach(Group => {
		centroids.push(Group.centroid);
	});

	const anchors: any = centroids;

	const widths = anchors.map(c => c[0]);
	const sorted_indices: any = widths
		.map((item, index) => {
			return { item, index };
		})
		.sort((a, b) => a.item - b.item)
		.map(i => i.index);

	const anchor_array = [];
	let reverse_anchor_array = [];
	let out_string = "";

	for (let i = 0; i < sorted_indices.length; i++) {
		anchor_array.push(Math.trunc(anchors[i][0] * 416));
		anchor_array.push(Math.trunc(anchors[i][1] * 416));
		out_string +=
			Math.trunc(anchors[i][0] * 416) +
			"," +
			Math.trunc(anchors[i][1] * 416) +
			", ";
	}

	let block1 = [];
	block1.push(anchor_array[12]);
	block1.push(anchor_array[13]);
	block1.push(anchor_array[14]);
	block1.push(anchor_array[15]);
	block1.push(anchor_array[16]);
	block1.push(anchor_array[17]);

	let block2 = [];
	block2.push(anchor_array[6]);
	block2.push(anchor_array[7]);
	block2.push(anchor_array[8]);
	block2.push(anchor_array[9]);
	block2.push(anchor_array[10]);
	block2.push(anchor_array[11]);

	let block3 = [];
	block3.push(anchor_array[0]);
	block3.push(anchor_array[1]);
	block3.push(anchor_array[2]);
	block3.push(anchor_array[3]);
	block3.push(anchor_array[4]);
	block3.push(anchor_array[5]);

	reverse_anchor_array.push(block1, block2, block3);

	("Anchor Boxes generated.");
	return { anchor_array, reverse_anchor_array };
}
