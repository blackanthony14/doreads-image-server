import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join, resolve } from "path";
import { v4 } from "uuid";
import { HttpError } from "../types/custom.error";
import { Prisma } from "@prisma/client";
import client from "../database/client";

export interface FileMetadata {
  id: string;
  filePath: string;
  filename: string;
  originalName: string;
}

export type CreateImage = Omit<Prisma.ImagesCreateInput, "id">;

class ImageService {
  private defaultPath = resolve("./covers");

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

  findByFileName(originalName: string) {
    return client.images.findFirst({
      where: {
        originalName,
      },
    });
  }

  private createFileMetadata(file: Express.Multer.File) {
    const id = v4();
    const type = file.originalname.split(".")[1];
    return {
      id,
      filePath: "",
      filename: `${id}.${type}`,
      originalName: file.originalname,
    };
  }

  async saveImage(file: Express.Multer.File) {
    this.validateMimeType(file.mimetype);
    const meta = this.createFileMetadata(file);

    const dir = this.defaultPath + meta.filePath;
    const filePath = meta.filePath + "/" + meta.filename;

    const exist = await this.findByFileName(meta.originalName);

    if (exist) {
      throw new HttpError("Image already exists", 400);
    }

    this.saveFile(file, dir, dir + "/" + meta.filename);

    const image = await client.images.create({
      data: {
        filename: meta.filename,
        uuid: meta.id,
        path: filePath,
        originalName: meta.originalName,
      },
    });
    return {
      imageName: image.uuid,
    };
  }

  async findImage(id: string) {
    const image = await client.images.findFirst({
      where: {
        uuid: id,
      },
    });
    if (!image) {
      throw new HttpError("Image doesn't exist", 404);
    }
    return image.path;
  }
}

export default new ImageService();
