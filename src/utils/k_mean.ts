const kmeans = require("node-kmeans");
export function k_means(ann_dims, anchor_num) {
	return kmeans.clusterize(ann_dims, { k: anchor_num }, (err, res) => {
		if (err) console.error(err);
		// else console.log("%o", res);
	});
}
