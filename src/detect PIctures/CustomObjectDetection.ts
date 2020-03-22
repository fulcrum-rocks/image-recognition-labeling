import * as fs from "fs";
import tf from "@tensorflow/tfjs";
import { CustomDetectionUtils } from "./CustomDetectionUtils";

export class CustomObjectDetection {
	__model_type: string;
	__model_path: any;
	__detection_config_json_path: any;
	__model_labels: any[];
	__model_anchors: any[];
	__input_size: number;
	__object_threshold: number;
	__nms_threshold: number;
	__model: any;
	__detection_utils: any;
	constructor() {
		this.__model_type = "";
		this.__model_path = "";
		this.__model_labels = [];
		this.__model_anchors = [];
		this.__detection_config_json_path = "";
		this.__input_size = 416;
		this.__object_threshold = 0.4;
		this.__nms_threshold = 0.4;
		this.__model = "None";
		this.__detection_utils = new CustomDetectionUtils([]);
	}
	setModelTypeAsYOLOv3() {
		this.__model_type = "yolov3";
	}
	setModelPath(detection_model_path) {
		this.__model_path = detection_model_path;
	}
	setJsonPath(configuration_json) {
		this.__detection_config_json_path = configuration_json;
	}
	async loadModel(this) {
		if (this.__model_type == "yolov3") {
			const configFile = fs
				.readFileSync(this.__detection_config_json_path)
				.toString();
			const detection_model_json = JSON.parse(configFile);
			this.__model_labels = detection_model_json["labels"];
			this.__model_anchors = detection_model_json["anchors"];
			this.__detection_utils = new CustomDetectionUtils(
				this.__model_labels
			);
			// const tf = require('@tensorflow/tfjs');

			const model = tf.sequential();
			this.__model = yolo_main(
				Input((shape = (None, None, 3))),
				3,
				this.__model_labels.length
			);

			let myYolo = await yolo.v3(this.__detection_config_json_path);
			// console.log(myYolo);

			this.__model.load_weights(this.__model_path);
		}
	}
}
