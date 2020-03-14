import * as path from "path";
import * as fs from "fs";
import { generateAnchors } from "./utils/anchors";
import { parse_voc_annotation } from "./utils/voc";
import * as np from "numjs";
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
		this.__train_images_folder = path.join(
			data_directory,
			"train",
			"images"
		);
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
		console.log(anchors);

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
	}

	async trainModule(this) {
		// train_ints, valid_ints, labels, max_box_per_image = self._create_training_instances(
		//     self.__train_annotations_folder,
		//     self.__train_images_folder,
		//     self.__train_cache_file,
		//     self.__validation_annotations_folder,
		//     self.__validation_images_folder,
		//     self.__validation_cache_file,
		//     self.__model_labels
		// )
		// if self.__training_mode:
		//     print('Training on: \t' + str(labels) + '')
		//     print("Training with Batch Size: ", self.__train_batch_size)
		//     print("Number of Experiments: ", self.__train_epochs)
		// ###############################
		// #   Create the generators
		// ###############################
		// train_generator = BatchGenerator(
		//     instances=train_ints,
		//     anchors=self.__model_anchors,
		//     labels=labels,
		//     downsample=32,  # ratio between network input's size and network output's size, 32 for YOLOv3
		//     max_box_per_image=max_box_per_image,
		//     batch_size=self.__train_batch_size,
		//     min_net_size=self.__model_min_input_size,
		//     max_net_size=self.__model_max_input_size,
		//     shuffle=True,
		//     jitter=0.3,
		//     norm=normalize
		// )
		// valid_generator = BatchGenerator(
		//     instances=valid_ints,
		//     anchors=self.__model_anchors,
		//     labels=labels,
		//     downsample=32,  # ratio between network input's size and network output's size, 32 for YOLOv3
		//     max_box_per_image=max_box_per_image,
		//     batch_size=self.__train_batch_size,
		//     min_net_size=self.__model_min_input_size,
		//     max_net_size=self.__model_max_input_size,
		//     shuffle=True,
		//     jitter=0.0,
		//     norm=normalize
		// )
		// ###############################
		// #   Create the model
		// ###############################
		// if os.path.exists(self.__pre_trained_model):
		//     self.__train_warmup_epochs = 0
		// warmup_batches = self.__train_warmup_epochs * \
		//     (self.__train_times * len(train_generator))
		// os.environ['CUDA_VISIBLE_DEVICES'] = self.__train_gpus
		// multi_gpu = [int(gpu) for gpu in self.__train_gpus.split(',')]
		// train_model, infer_model = self._create_model(
		//     nb_class=len(labels),
		//     anchors=self.__model_anchors,
		//     max_box_per_image=max_box_per_image,
		//     max_grid=[self.__model_max_input_size,
		//               self.__model_max_input_size],
		//     batch_size=self.__train_batch_size,
		//     warmup_batches=warmup_batches,
		//     ignore_thresh=self.__train_ignore_treshold,
		//     multi_gpu=multi_gpu,
		//     lr=self.__train_learning_rate,
		//     grid_scales=self.__train_grid_scales,
		//     obj_scale=self.__train_obj_scale,
		//     noobj_scale=self.__train_noobj_scale,
		//     xywh_scale=self.__train_xywh_scale,
		//     class_scale=self.__train_class_scale,
		// )
		// ###############################
		// #   Kick off the training
		// ###############################
		// callbacks = self._create_callbacks(
		//     self.__train_weights_name, infer_model)
		// train_model.fit_generator(
		//     generator=train_generator,
		//     steps_per_epoch=len(train_generator) * self.__train_times,
		//     validation_data=valid_generator,
		//     validation_steps=len(valid_generator) * self.__train_times,
		//     epochs=self.__train_epochs + self.__train_warmup_epochs,
		//     verbose=1,
		//     callbacks=callbacks,
		//     workers=4,
		//     max_queue_size=8
		// )
	}

	async _create_training_instances(
		this,
		train_annot_folder,
		train_image_folder,
		train_cache,
		valid_annot_folder,
		valid_image_folder,
		valid_cache,
		labels
	) {
		//       let { all_insts, seen_labels } = parse_voc_annotation(train_annot_folder, train_image_folder, train_cache, labels)
		//       const train_ints = all_insts
		//       const train_labels = seen_labels
		//     const train_valid_split = int(0.8 * len(train_ints))
		//     np.random.seed(0)
		//     np.random.shuffle(train_ints)
		//     np.random.seed()
		// valid_ints = train_ints[train_valid_split:]
		// train_ints = train_ints[:train_valid_split]
		// # compare the seen labels with the given labels in config.json
		// if len(labels) > 0:
		// overlap_labels = set(labels).intersection(set(train_labels.keys()))
		// # return None, None, None if some given label is not in the dataset
		// if len(overlap_labels) < len(labels):
		// if(self.__training_mode):
		// print(
		// 'Some labels have no annotations! Please revise the list of labels in your configuration.')
		// return None, None, None, None
		// else:
		// if(self.__training_mode):
		// print('No labels are provided. Train on all seen labels.')
		// print(train_labels)
		// labels = train_labels.keys()
		// max_box_per_image = max([len(inst['object'])
		//     for inst in (train_ints + valid_ints)])
		// return train_ints, valid_ints, sorted(labels), max_box_per_image
		//   }
	}
}
