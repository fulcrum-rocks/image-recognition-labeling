import * as path from "path";
import * as fs from "fs";
import * as pickle from "pickle";
import { parseStringPromise } from "xml2js";
import { IAnnotation } from "./interfaces";
var xml = require("xml-js");
export function parse_voc_annotation(ann_dir, img_dir, cache_name, labels) {
  let img: any = {};
  let obj = [];
  let all_insts;
  let seen_labels = {};
  labels = labels || [];
  fs.exists(cache_name, exist => {
    // ===================== Cache exist ===============
    if (exist) {
      const handle = fs.readFileSync(cache_name);
      let cache = pickle.load(handle);
      all_insts = cache["all_insts"];
      seen_labels = cache["seen_labels"];
    } else {
      // ===================== Load add files ===============
      let sorted = [];
      let tree: any[] = [];
      const files = fs.readdirSync(ann_dir);
      files.forEach(file => {
        sorted.push(file);
      });
      sorted.sort((a, b) => {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      sorted.forEach(async ann => {
        const xmlData = fs
          .readFileSync(path.join(ann_dir, ann))
          .toString("utf8");
        const jsonData = xml.xml2json(xmlData, {
          compact: true,
          spaces: 1
        });
        tree.push(JSON.parse(jsonData));
      });
      // ===========================================
      if (tree) {
        tree.forEach((elem: IAnnotation) => {
          const ann = elem.annotation;

          // ===================== Img =================
          img["filename"] = path.join(img_dir, ann.filename._text);
          img["width"] = ann.size.width._text;
          img["height"] = ann.size.height._text;

          const obj = {};

          if (ann.object.name) {
          } else {
            console.log("fdgsfgdfg => " + JSON.stringify(ann.object));
          }

          obj["name"] = ann.object.name._text;
          if (obj["name"] in seen_labels) {
            seen_labels[obj["name"]] += 1;
          } else {
            seen_labels[obj["name"]] = 1;
          }

          if (ann.object.bndbox[0]) {
            obj["xmin"] = Math.floor(
              Math.round(ann.object.bndbox[0].xmin._text)
            );
            obj["ymin"] = Math.floor(
              Math.round(ann.object.bndbox[0].ymin._text)
            );
            obj["xmax"] = Math.floor(
              Math.round(ann.object.bndbox[0].xmax._text)
            );
            obj["ymax"] = Math.floor(
              Math.round(ann.object.bndbox[0].ymax._text)
            );
          } else if (ann.object.bndbox) {
            obj["xmin"] = Math.floor(Math.round(ann.object.bndbox.xmin._text));
            obj["ymin"] = Math.floor(Math.round(ann.object.bndbox.ymin._text));
            obj["xmax"] = Math.floor(Math.round(ann.object.bndbox.xmax._text));
            obj["ymax"] = Math.floor(Math.round(ann.object.bndbox.ymax._text));
          }
          console.log(obj);

          if (labels.length > 0 && obj["name"]! in labels) {
          } else {
            img["object"] = obj;
          }

          // if (img["object"].length > 0) {
          //   all_insts += img;
          // }
        });
        fs.writeFileSync(
          `${cache_name}.json`,
          JSON.stringify({
            all_insts,
            seen_labels
          })
        );
      }
    }
  });
  console.log(all_insts, seen_labels);
  return { all_insts, seen_labels };
}
