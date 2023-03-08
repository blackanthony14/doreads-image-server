import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { v4 } from "uuid";
import { HttpError } from "../types/custom.error";
import * as fs from "fs";

export interface FileMetadata {
  id: string;
  filePath: string;
  filename: string;
  originalName: string;
}

export type CreateImage = Omit<
  {
    id: string;
    filename: string;
    originalName: string;
    path: string;
  },
  "id"
>;

class ImageService {
  private defaultPath = resolve("./covers");
  private metadataFilePath = resolve(__dirname, "../database/metadata.json");

  private validateMimeType(mimeType: string) {
    if (!mimeType.includes("image")) {
      throw new HttpError("File type is not supported", 400);
    }
  }

  private async saveFile(
    file: Express.Multer.File,
    dir: string,
    filePath: string
  ) {
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new HttpError("Error trying to save a file", 500);
    }
  }

  private saveMetadata(metadata: FileMetadata[]) {
    writeFileSync(this.metadataFilePath, JSON.stringify(metadata));
  }

  private readMetadata(): FileMetadata[] {
    try {
      const data = readFileSync(this.metadataFilePath);
      return JSON.parse(data.toString());
    } catch (error) {
      return [];
    }
  }

  private createImageMetadata(file: Express.Multer.File): FileMetadata {
    const id = v4();
    const type = file.originalname.split(".")[1];
    return {
      id,
      filePath: "/",
      filename: `${id}.${type}`,
      originalName: file.originalname,
    };
  }

  async saveImage(file: Express.Multer.File) {
    this.validateMimeType(file.mimetype);

    const metadata = this.readMetadata();
    const exist = metadata.find(
      (item) => item.originalName === file.originalname
    );
    if (exist) {
      throw new HttpError("Image already exists", 400);
    }

    const imageMetadata = this.createImageMetadata(file);
    const dir = this.defaultPath + imageMetadata.filePath;
    const filePath = imageMetadata.filePath + "/" + imageMetadata.filename;
    this.saveFile(
      file,
      this.defaultPath + imageMetadata.filePath,
      this.defaultPath + imageMetadata.filePath + "/" + imageMetadata.filename
    );
  
    const createImage: CreateImage = {
      filename: imageMetadata.filename,
      path: filePath,
      originalName: imageMetadata.originalName,
    };

    metadata.push(imageMetadata);
    this.saveMetadata(metadata);

    return {
      imageName: imageMetadata.id,
    };
  }
  async findImage(imageId: string) {
    try {
      const metadata = this.readMetadata();
      const image = metadata.find((item) => item.id === imageId);

      if (!image) {
        throw new HttpError("Image not found ID", 404);
      }
      return {
        default: this.defaultPath,
        path: image.filePath,
        name: image.filename
      };
    } catch (error) {
      throw new HttpError("File not found", 404);
    }
  }
}

export default new ImageService();