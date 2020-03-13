import * as path from "path";
import * as fs from "fs";
import { generateAnchors } from "./utils/anchors";
export class DetectionModelTrainer {
  __train_images_folder: string;
  __train_annotations_folder: string;
  __validation_images_folder: string;
  __validation_annotations_folder: string;
  __train_cache_file: string;
  __validation_cache_file: string;
  __model_directory: string;
  __train_weights_name: string;
  __json_directory: string;
  __logs_directory: string;
  constructor() {
    this.init();
  }
  // ============ Init ================
  init(this) {
    this.__model_type = "";
    this.__training_mode = "True";
    this.__model_min_input_size = 288;
    this.__model_max_input_size = 448;
    this.__model_anchors = [];
    this.__inference_anchors = [];
    this.__json_directory = "";
    this.__model_labels = [];
    this.__num_objects = 0;
    this.__pre_trained_model = "";
    this.__train_images_folder = "";
    this.__train_annotations_folder = "";
    this.__train_cache_file = "";
    this.__train_times = 8;
    this.__train_batch_size = 4;
    this.__train_learning_rate = 1e-4;
    this.__train_epochs = 100;
    this.__train_warmup_epochs = 3;
    this.__train_ignore_treshold = 0.5;
    this.__train_gpus = "0,1";
    this.__train_grid_scales = [1, 1, 1];
    this.__train_obj_scale = 5;
    this.__train_noobj_scale = 1;
    this.__train_xywh_scale = 1;
    this.__train_class_scale = 1;
    this.__model_directory = "";
    this.__train_weights_name = "";
    this.__train_debug = "True";
    this.__logs_directory = "";
    this.__validation_images_folder = "";
    this.__validation_annotations_folder = "";
    this.__validation_cache_file = "";
    this.__validation_times = 1;
  }

  // =============== Add type to this =============
  async setModelTypeAsYOLOv3(this) {
    return (this.__model_type = "yolov3");
  }
  // =============== Add/read folders list to this =============
  async setDataDirectory(data_directory) {
    data_directory = `${__dirname}\\${data_directory}`;
    this.__train_images_folder = path.join(data_directory, "train", "images");
    this.__train_annotations_folder = path.join(
      data_directory,
      "train",
      "annotations"
    );
    this.__validation_images_folder = path.join(
      data_directory,
      "validation",
      "images"
    );
    this.__validation_annotations_folder = path.join(
      data_directory,
      "validation",
      "annotations"
    );

    fs.mkdir(path.join(data_directory, "cache"), e => {});
    this.__train_cache_file = path.join(
      data_directory,
      "cache",
      "detection_train_data.json"
    );
    this.__validation_cache_file = path.join(
      data_directory,
      "cache",
      "detection_test_data.json"
    );

    fs.mkdir(path.join(data_directory, "models"), e => {});
    fs.mkdir(path.join(data_directory, "json"), e => {});
    fs.mkdir(path.join(data_directory, "logs"), e => {});

    this.__model_directory = path.join(data_directory, "models");
    this.__train_weights_name = path.join(
      this.__model_directory,
      "detection_model-"
    );
    this.__json_directory = path.join(data_directory, "json");
    this.__logs_directory = path.join(data_directory, "logs");
  }

  // =============== Set configs =============
  async setTrainConfig(
    this,
    object_names_array,
    batch_size,
    num_experiments,
    train_from_pretrained_model
  ) {
    batch_size = batch_size || 4;
    num_experiments = num_experiments || 100;
    train_from_pretrained_model = train_from_pretrained_model || "";

    const anchors = await generateAnchors(
      this.__train_annotations_folder,
      this.__train_images_folder,
      this.__train_cache_file,
      this.__model_labels
    );
    this.__model_anchors = anchors;
    this.__inference_anchors = this.__model_anchors;

    this.__model_labels = object_names_array.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.__num_objects = object_names_array.length;
    this.__train_batch_size = batch_size;
    this.__train_epochs = num_experiments;
    this.__pre_trained_model = train_from_pretrained_model;

    let json_data = {};
    json_data["labels"] = this.__model_labels;
    json_data["anchors"] = this.__inference_anchors;
    fs.writeFileSync(
      `${this.__json_directory}/detection_config.json`,
      JSON.stringify(json_data)
    );

    // print("Detection configuration saved in ", os.path.join(this.__json_directory, "detection_config.json"))

    //           >> train    >> images       >> img_1.jpg
    //                       >> images       >> img_2.jpg
    //                       >> images       >> img_3.jpg
    //                       >> annotations  >> img_1.xml
    //                       >> annotations  >> img_2.xml
    //                       >> annotations  >> img_3.xml

    //           >> validation   >> images       >> img_151.jpg
    //                           >> images       >> img_152.jpg
    //                           >> images       >> img_153.jpg
    //                           >> annotations  >> img_151.xml
    //                           >> annotations  >> img_152.xml
    //                           >> annotations  >> img_153.xml
  }
}
