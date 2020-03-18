export interface IInitTrainer {
	__model_type: string;
	__training_mode: boolean;
	__model_min_input_size: number;
	__model_max_input_size: number;
	__model_anchors: number[];
	__inference_anchors: [];
	__json_directory: string;
	__model_labels: string[];
	__num_objects: number;
	__pre_trained_model: string;
	__train_images_folder: string;
	__train_annotations_folder: string;
	__train_cache_file: string;
	__train_times: number;
	__train_batch_size: number;
	__train_learning_rate: number;
	__train_epochs: number;
	__train_warmup_epochs: number;
	__train_ignore_treshold: number;
	__train_gpus: number;
	__train_grid_scales: number[];
	__train_obj_scale: number;
	__train_noobj_scale: number;
	__train_xywh_scale: number;
	__train_class_scale: number;
	__model_directory: string;
	__train_weights_name: string;
	__train_debug: boolean;
	__logs_directory: string;
	__validation_images_folder: string;
	__validation_annotations_folder: string;
	__validation_cache_file: string;
	__validation_times: number;
}

export interface IFoldersPath {
	__train_images_folder: string; // train/images
	__train_annotations_folder: string; // train/annotations
	__validation_images_folder: string; // validation/images
	__validation_annotations_folder: string; // validation/annotations
	__train_cache_file: string; // cache/detection_train_data.pkl
	__validation_cache_file: string; // cache/detection_test_data.pkl
	__model_directory: string; // models
	__train_weights_name: string; // models/detection_model-
	__json_directory: string; // json
	__logs_directory: string; // logs
}
