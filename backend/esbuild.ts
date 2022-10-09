import { buildSync } from "esbuild"
import * as fs from "fs"
import * as path from "path"

// @ts-ignore
fs.rmSync(path.join(__dirname, "dist"), { force: true, recursive: true })

buildSync({
    entryPoints: ["src/handler.ts"],
    bundle: true,
    outdir: "dist",
    outbase: "src",
    platform: "node",
    target: "es2019",
    external: ["aws-sdk"],
})
