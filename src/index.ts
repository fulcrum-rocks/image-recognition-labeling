<<<<<<< HEAD
import { DetectionModelTrainer } from "./Training";
import { IInitTrainer } from "./interfacess/trainer";
=======
const { getDataFilePath, drawBlueRect } = require("opencv4nodejs");

import * as cv from "opencv4nodejs";
import { DetectionModelTrainer } from "./Training";
>>>>>>> 4af1ed38d7a1af7ccc8aca4a839094eebde7fc18

async function train_detection_model() {
	let trainer = new DetectionModelTrainer();
	await trainer.setModelTypeAsYOLOv3(); // __model_type: 'yolov3'
<<<<<<< HEAD
	await trainer.setDataDirectory("fire-dataset");
	await trainer.setTrainConfig(["fire"], 8, 100, "pretrained-yolov3.h5");
	await trainer.trainModel();
}
train_detection_model();
=======
	await trainer.setDataDirectory("fire-dataset"); // __train_images_folder...etc
	await trainer.setTrainConfig(["fire"], 8, 100, "pretrained-yolov3.h5");
	console.log(trainer);
	// trainer.trainModel()
}
train_detection_model();

// // util function to normalize a value between a given range.
// function normalize(value, min, max) {
//   if (min === undefined || max === undefined) {
//     return value;
//   }
//   return (value - min) / (max - min);
// }

// // data can be loaded from URLs or local file paths when running in Node.js.
// const TRAIN_DATA_PATH =
// 'https://storage.googleapis.com/mlb-pitch-data/pitch_type_training_data.csv';
// const TEST_DATA_PATH =    'https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv';

// // Constants from training data
// const VX0_MIN = -18.885;
// const VX0_MAX = 18.065;
// const VY0_MIN = -152.463;
// const VY0_MAX = -86.374;
// const VZ0_MIN = -15.5146078412997;
// const VZ0_MAX = 9.974;
// const AX_MIN = -48.0287647107959;
// const AX_MAX = 30.592;
// const AY_MIN = 9.397;
// const AY_MAX = 49.18;
// const AZ_MIN = -49.339;
// const AZ_MAX = 2.95522851438373;
// const START_SPEED_MIN = 59;
// const START_SPEED_MAX = 104.4;

// const NUM_PITCH_CLASSES = 7;
// const TRAINING_DATA_LENGTH = 7000;
// const TEST_DATA_LENGTH = 700;

// // Converts a row from the CSV into features and labels.
// // Each feature field is normalized within training data constants
// const csvTransform =
//     ({xs, ys}) => {
//       const values = [
//         normalize(xs.vx0, VX0_MIN, VX0_MAX),
//         normalize(xs.vy0, VY0_MIN, VY0_MAX),
//         normalize(xs.vz0, VZ0_MIN, VZ0_MAX), normalize(xs.ax, AX_MIN, AX_MAX),
//         normalize(xs.ay, AY_MIN, AY_MAX), normalize(xs.az, AZ_MIN, AZ_MAX),
//         normalize(xs.start_speed, START_SPEED_MIN, START_SPEED_MAX),
//         xs.left_handed_pitcher
//       ];
//       return {xs: values, ys: ys.pitch_code};
//     }

//     tf.data.TextLineDataset()

// const trainingData =
//     tf.data.csv(TRAIN_DATA_PATH, {columnConfigs: {pitch_code: {isLabel: true}}})
//         .map(csvTransform)
//         .shuffle(TRAINING_DATA_LENGTH)
//         .batch(100);

// // Load all training data in one batch to use for evaluation
// const trainingValidationData =
//     tf.data.csv(TRAIN_DATA_PATH, {columnConfigs: {pitch_code: {isLabel: true}}})
//         .map(csvTransform)
//         .batch(TRAINING_DATA_LENGTH);

// // Load all test data in one batch to use for evaluation
// const testValidationData =
//     tf.data.csv(TEST_DATA_PATH, {columnConfigs: {pitch_code: {isLabel: true}}})
//         .map(csvTransform)
//         .batch(TEST_DATA_LENGTH);
>>>>>>> 4af1ed38d7a1af7ccc8aca4a839094eebde7fc18
