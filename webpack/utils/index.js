const fs = require("fs");
const path = require("path");

function isExistFile(path) {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
}

function tryPathResolve(modulePath) {
  if (modulePath.match(/\.[j|t]s[x]?$/)) {
    return modulePath;
  }

  // 是一个目录，类似直接使用 /journey，实际上用的是 /journey/index
  if (isExistFile(modulePath)) {
    const completePath = tryCompletePath((ext) =>
      path.join(modulePath, "index" + ext)
    );
    if (!completePath) {
      throw new Error("Couldn't find: " + modulePath);
    }
    return completePath;
  } else {
    const completePath = tryCompletePath((ext) => modulePath + ext);
    if (!completePath) {
      return modulePath;
    }
    return completePath;
  }
}

function tryCompletePath(func) {
  const SUFFIX = [".js", ".jsx", ".ts", ".tsx"];
  for (let i = 0; i < SUFFIX.length; i++) {
    const curPath = func(SUFFIX[i]);
    if (fs.existsSync(curPath)) {
      return curPath;
    }
  }
}

function tryCreateOutputDir(dirPath) {
    if (!isExistFile(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  }

module.exports = {
  isExistFile,
  tryPathResolve,
  tryCompletePath,
  tryCreateOutputDir
};


