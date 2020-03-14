import { CustomObjectDetection } from "./detect PIctures/CustomObjectDetection";
import * as path from "path";

function detect_from_image() {
	const detector = new CustomObjectDetection();
	detector.setModelTypeAsYOLOv3();
	detector.setModelPath(
		path.join(__dirname, "detection_model-ex-33--loss-4.97.h5")
	);
	detector.setJsonPath(path.join(__dirname, "detection_config.json"));
	detector.loadModel();
	// console.log(detector);
	// detections = detector.detectObjectsFromImage(input_image=os.path.join(__dirname , "1.jpg"),
	//                                              output_image_path=os.path.join(__dirname , "1-detected.jpg"),
	//                                              minimum_percentage_probability=40)
	// for detection in detections:
	//     print(detection["name"], " : ", detection["percentage_probability"], " : ", detection["box_points"])
}
detect_from_image();
