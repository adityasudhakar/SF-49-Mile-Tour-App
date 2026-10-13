const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function replaceInFile(filePath, search, replacement, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`${label} not found; skipping patch.`);
    return;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const patched = original.replace(search, replacement);

  if (patched === original) {
    console.log(`${label} patch already applied or upstream file changed.`);
    return;
  }

  fs.writeFileSync(filePath, patched);
  console.log(`Patched ${label}.`);
}

const boostPodspecPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native",
  "third-party-podspecs",
  "boost.podspec"
);

replaceInFile(
  boostPodspecPath,
  "https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2",
  "https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2",
  "React Native boost.podspec"
);

const codegenPodspecs = [
  path.join(
    __dirname,
    "..",
    "node_modules",
    "react-native",
    "React",
    "FBReactNativeSpec",
    "FBReactNativeSpec.podspec"
  ),
  path.join(
    __dirname,
    "..",
    "node_modules",
    "react-native",
    "ReactCommon",
    "React-rncore.podspec"
  ),
];

for (const podspecPath of codegenPodspecs) {
  replaceInFile(
    podspecPath,
    /  use_react_native_codegen!\(s, \{\n(?:    .+\n)+?  \}\)\n/m,
    "",
    path.relative(path.join(__dirname, ".."), podspecPath)
  );
}

replaceInFile(
  codegenPodspecs[0],
  /  s.header_dir             = "FBReactNativeSpec"\n(?:  s.source_files           = .+\n)?/,
  '  s.header_dir             = "FBReactNativeSpec"\n  s.source_files           = "generated/FBReactNativeSpec/**/*.{h,mm}"\n',
  path.relative(path.join(__dirname, ".."), codegenPodspecs[0])
);

const reactNativeRoot = path.join(__dirname, "..", "node_modules", "react-native");
const fbSpecGeneratedRoot = path.join(
  reactNativeRoot,
  "React",
  "FBReactNativeSpec",
  "generated"
);
const fbSpecHeader = path.join(
  fbSpecGeneratedRoot,
  "FBReactNativeSpec",
  "FBReactNativeSpec.h"
);

if (!fs.existsSync(fbSpecHeader)) {
  fs.mkdirSync(fbSpecGeneratedRoot, { recursive: true });

  const schemaPath = path.join(fbSpecGeneratedRoot, "schema.json");
  const librariesRoot = path.join(reactNativeRoot, "Libraries");
  const nativeJsFiles = [];
  const collectNativeJsFiles = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectNativeJsFiles(fullPath);
      } else if (/^Native.*\.js$/.test(entry.name)) {
        nativeJsFiles.push(fullPath);
      }
    }
  };

  collectNativeJsFiles(librariesRoot);
  execFileSync(
    process.execPath,
    [
      path.join(
        __dirname,
        "..",
        "node_modules",
        "react-native-codegen",
        "lib",
        "cli",
        "combine",
        "combine-js-to-schema-cli.js"
      ),
      schemaPath,
      ...nativeJsFiles,
    ],
    { stdio: "inherit" }
  );
  execFileSync(
    process.execPath,
    [
      path.join(reactNativeRoot, "scripts", "generate-specs-cli.js"),
      "--platform",
      "ios",
      "--schemaPath",
      schemaPath,
      "--outputDir",
      fbSpecGeneratedRoot,
      "--libraryName",
      "FBReactNativeSpec",
      "--libraryType",
      "modules",
    ],
    { stdio: "inherit" }
  );
  console.log("Generated FBReactNativeSpec files for CocoaPods.");
}

const yogaValueHeader = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native",
  "ReactCommon",
  "yoga",
  "yoga",
  "YGValue.h"
);

replaceInFile(
  yogaValueHeader,
  /operator"" (_pt|_percent)/g,
  'operator""$1',
  path.relative(path.join(__dirname, ".."), yogaValueHeader)
);
