#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const process = require("process")

const tsconfigFilePath = path.join(process.env.INIT_CWD, "tsconfig.json")
const declarationsFilePath = path.join(process.env.INIT_CWD, "declarations.d.ts")

// Check if it's a Typescript project
if (!fs.existsSync(tsconfigFilePath)) return

// If `declarations.d.ts` doesn't contain the fix for Framer URL imports, inject it.
if (
    !fs.existsSync(declarationsFilePath) ||
    !fs.readFileSync(declarationsFilePath).toString().includes('declare module "https://framer.com/m/*"')
) {
    fs.appendFileSync(
        declarationsFilePath,
        '// NOTE: The declaration below was injected by `"framer"`\n// see https://www.framer.com/docs/guides/handshake for more information.\ndeclare module "https://framer.com/m/*";\n'
    )
}
