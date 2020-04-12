# LABELING FOR IMAGE RECOGNITION

How to Create Neural Network for Recognizing Masks

Create annotation boxes to pictures
Generate anchors for image recognition

Supports:

1. Labelbox
2. Supervise

How to run:

npm install

write to env file {foldername} and objects names at pictures

put pictures to folder src/{foldername}/train/images

label this pictures using labelbox

https://labelbox.com/

put ready json file to folder src/{foldername}/train/annotations

npm run start

Labesl ready for trainig using Yolov3

Copy {foldername} to second project for training

Use array from logs or at src/{foldername}/detection_config.json as anchor for second project
