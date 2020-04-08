import { DetectionModelTrainer } from "./Training";

async function train_detection_model() {
	let trainer = new DetectionModelTrainer();
	await trainer.setModelTypeAsYOLOv3();
	await trainer.setDataDirectory("mask_500");
	await trainer.setTrainConfig(["mask"], 8, 100, "pretrained-yolov3.h5");
	await trainer.trainModel();
}
train_detection_model();
