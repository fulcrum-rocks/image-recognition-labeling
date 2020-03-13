import { parse_voc_annotation } from "./voc";
import * as tf from "@tensorflow/tfjs-node";
export async function generateAnchors(
  train_annotation_folder,
  train_image_folder,
  train_cache_file,
  model_labels
) {
  console.log("Generating anchor boxes for training images and annotation...");
  const num_anchors = 9;

  let train_imgs;
  let train_labels = parse_voc_annotation(
    train_annotation_folder,
    train_image_folder,
    train_cache_file,
    model_labels
  );
  console.log(train_labels);

  let annotation_dims = [];
  for (const image in train_imgs) {
    for (const obj in image["object"]) {
      let relative_w =
        (parseFloat(obj["xmax"]) - parseFloat(obj["xmin"])) / image["width"];
      let relatice_h =
        (parseFloat(obj["ymax"]) - parseFloat(obj["ymin"])) / image["height"];
      annotation_dims.push([relative_w, relatice_h]);
    }
  }

  console.log(annotation_dims);

  var x = tf.tensor([-3, 4]);

  //   annotation_dims: any = tf.tensor(annotation_dims);
  //   const centroids = run_kmeans(annotation_dims, num_anchors);

  // # write anchors to file
  // print('Average IOU for', num_anchors, 'anchors:', '%0.2f' % avg_IOU(annotation_dims, centroids))

  // anchors = centroids.copy()

  // widths = anchors[:, 0]
  // sorted_indices = np.argsort(widths)

  // anchor_array = []
  // reverse_anchor_array = []
  // out_string = ""
  // r = "anchors: ["
  // for i in sorted_indices:
  //     anchor_array.append(int(anchors[i, 0] * 416))
  //     anchor_array.append(int(anchors[i, 1] * 416))

  //     out_string += str(int(anchors[i, 0] * 416)) + ',' + str(int(anchors[i, 1] * 416)) + ', '

  // reverse_anchor_array.append(anchor_array[12:18])
  // reverse_anchor_array.append(anchor_array[6:12])
  // reverse_anchor_array.append(anchor_array[0:6])

  // print("Anchor Boxes generated.")
  // return anchor_array, reverse_anchor_array
}

function run_kmeans(ann_dims, anchor_num) {
  //   let vectors = new Array();
  //   for (let i = 0 ; i < data.length ; i++) {
  //     vectors[i] = [ data[i]['size'] , data[i]['revenue']];
  //   }
  //   const kmeans = require('node-kmeans');
  //   kmeans.clusterize(vectors, {k: 4}, (err,res) => {
  //     if (err) console.error(err);
  //     else console.log('%o',res);
  //   });
  // const ann_num = ann_dims.shape[0]
  // let iterations = 0
  // prev_assignments = np.ones(ann_num)*(-1)
  // iteration = 0
  // old_distances = np.zeros((ann_num, anchor_num))
  // indices = [random.randrange(ann_dims.shape[0]) for i in range(anchor_num)]
  // centroids = ann_dims[indices]
  // anchor_dim = ann_dims.shape[1]
  // while True:
  //     distances = []
  //     iteration += 1
  //     for i in range(ann_num):
  //         d = 1 - IOU(ann_dims[i], centroids)
  //         distances.append(d)
  //     distances = np.array(distances) # distances.shape = (ann_num, anchor_num)
  //     #assign samples to centroids
  //     assignments = np.argmin(distances,axis=1)
  //     if (assignments == prev_assignments).all() :
  //         return centroids
  //     #calculate new centroids
  //     centroid_sums=np.zeros((anchor_num, anchor_dim), np.float)
  //     for i in range(ann_num):
  //         centroid_sums[assignments[i]]+=ann_dims[i]
  //     for j in range(anchor_num):
  //         centroids[j] = centroid_sums[j]/(np.sum(assignments==j) + 1e-6)
  //     prev_assignments = assignments.copy()
  //     old_distances = distances.copy()
}
