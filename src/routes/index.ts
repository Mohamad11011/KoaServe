import Router from "koa-router";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const router = new Router();
interface KoaBody {
  inputFiles: string[];
  outputFile: string;
  videoPath: string;
  inputFile: string;
  imagePath: string;
  x?: number;
  y?: number;
  position?: string;
}

// Define your routes
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });

const storagePath = process.env.STORAGE_PATH || "";

// router.post("/save", async (ctx) => {
//   // ctx.request.socket.setTimeout(10 * 60 * 1000);
//   const { inputFiles, outputFile } = ctx.request.body as KoaBody;
//   if (Array.isArray(inputFiles) && inputFiles.length > 0 && outputFile) {
//     try {
//       await save(inputFiles, outputFile, storagePath);
//       ctx.status = 200;
//       ctx.body = {
//         message: "Video hls converted successfully",
//         inputFile: inputFiles,
//         outputFile: `${storagePath}/` + outputFile,
//       };
//     } catch (error: any) {
//       ctx.status = 500;
//       ctx.body = {
//         message: "Error in process",
//         error: error?.message,
//       };
//     }
//   } else {
//     ctx.status = 400;
//     ctx.body = {
//       message: "Invalid query parameters",
//     };
//   }
// });


const parentDirectory = path.dirname(__dirname);
const SERVING_PATH = path.join(parentDirectory, "assets");
const SERVING_URI = process.env.SERVING_URI || "";
const getFilesInDirectory = (dir: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file: any) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recurse into subdirectory
      results = results.concat(getFilesInDirectory(filePath));
    } else {
      // Add file path
      results.push(filePath);
    }
  });

  return results;
};
router.get("/assets", async (ctx) => {
  try {
    const files = fs.readdirSync(SERVING_PATH);
    const filteredFiles = files.filter(
      (file: string) => file.endsWith(".mp4") || file.endsWith(".m3u8")
    );
    const fileUrls = filteredFiles.map(
      (file: string) => `${SERVING_URI}${file}`
    );

    ctx.body = {
      success: true,
      files: fileUrls,
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: `Error reading files from assets folder: ${SERVING_PATH}`,
      error: error.message,
    };
  }
});

//main launcher
router.get("/", async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    message: "koa server is running",
  };
});
export { router as routes };
