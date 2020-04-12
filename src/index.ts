import { DetectionModelTrainer } from "./Training";
require("dotenv").config();

async function train_detection_model() {
	let trainer = new DetectionModelTrainer();
	await trainer.setModelTypeAsYOLOv3();
	await trainer.setDataDirectory(process.env.DIRECTORY);
	await trainer.setTrainConfig(
		process.env.LABELS.split(","),
		8,
		30,
		"pretrained-yolov3.h5"
	);
	await trainer.trainModel();
}
train_detection_model();
