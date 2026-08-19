import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentPath = context.parentURL?.startsWith("file:")
      ? fileURLToPath(context.parentURL)
      : null;

    if (parentPath) {
      const candidate = path.resolve(path.dirname(parentPath), specifier);
      if (!path.extname(candidate) && fs.existsSync(candidate + ".js")) {
        return nextResolve(specifier + ".js", context);
      }
    }
  }

  return nextResolve(specifier, context);
}
