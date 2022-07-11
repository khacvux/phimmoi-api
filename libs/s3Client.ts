import { S3 } from "aws-sdk";
import config from "../src/config/config";
import fs from "fs";

interface fileModel {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}

interface objectParams {
  Bucket: string;
  Key: string;
}

const REGION = config.region;
const ACCESS_KEY = config.bucket.accesskey;
const SECRET_KEY = config.bucket.secretkey;

const s3 = new S3({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

const getSignedUrl = async (operation: string, params: objectParams) => {
  try {
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl(operation, params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    return url;
  } catch (error) {
    return error;
  }
};

export const uploadFile = async (file: fileModel) => {
  const fileStream = fs.readFileSync(file.path);

  const uploadParams = {
    Bucket: config.bucket.name,
    Body: fileStream,
    Key: file.filename,
  };

  try {
    return await new Promise((resolve, reject) => {
      s3.putObject(uploadParams, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const params: objectParams = {
            Bucket: config.bucket.name,
            Key: file.filename,
          };
          const url = await getSignedUrl("getObject", params);
          resolve(url);
        }
      });
    });
  } catch (error) {
    return error;
  }
};

export const deleteFile = async (params: objectParams) => {
  try {
    return await new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  } catch (error) {
    return error;
  }
};
