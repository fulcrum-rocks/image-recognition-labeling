import { DetectionModelTrainer } from "./Training";

async function train_detection_model() {
	let trainer = new DetectionModelTrainer();
	await trainer.setModelTypeAsYOLOv3(); // __model_type: 'yolov3'
	await trainer.setDataDirectory("fire-dataset");
	await trainer.setTrainConfig(["fire"], 8, 100, "pretrained-yolov3.h5");
	await trainer.trainModel();
}
train_detection_model();
