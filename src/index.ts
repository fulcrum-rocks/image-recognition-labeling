const { getDataFilePath, drawBlueRect } = require("opencv4nodejs");

import * as cv from "opencv4nodejs";
import { DetectionModelTrainer } from "./Training";

async function train_detection_model() {
  let trainer = new DetectionModelTrainer();
  await trainer.setModelTypeAsYOLOv3(); // __model_type: 'yolov3'
  await trainer.setDataDirectory("fire-dataset"); // __train_images_folder...etc
  await trainer.setTrainConfig(["fire"], 8, 100, "pretrained-yolov3.h5");
  console.log(trainer);
  // console.log(trainer);

  // trainer.trainModel()
}
train_detection_model();
