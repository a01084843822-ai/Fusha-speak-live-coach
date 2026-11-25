import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createExtensionZip() {
  const zip = new JSZip();
  const extensionDir = path.resolve('extension');

  function addFolderToZip(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        addFolderToZip(fullPath, subZip);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  // Also include PRD.md and SPEC.md and a clean README
  const rootFolder = zip.folder('fusha-speak-chrome-extension');
  addFolderToZip(extensionDir, rootFolder);

  const readmeContent = `# Fusha-Speak Live Coach (ئەرەب تىلى نۇتۇق ۋە مۇھىت مەشقاۋۇلى)
## Google Chrome Extension (Manifest V3)

### ئىشلىتىش ۋە قاچىلاش ئۇسۇلى:
1. بۇ زىپ ھۆججىتىنى كومپيۇتېرىڭىزدا بىرەر مۇندەرىجىگە چىقىرىڭ (Extract).
2. Google Chrome كۆرگۈچىنى ئېچىپ، ئادرېس بالدىقىغا مۇنداق يېزىڭ: chrome://extensions
3. ئوڭ ئۈستى تەرەپتىكى «ئاچقۇچى ھالىتى» (Developer mode) نى ئېچىڭ.
4. سول تەرەپتىكى «ئېچىلغان قىستۇرمىنى يۈكلەش» (Load unpacked) كۇنۇپكىسىنى بېسىڭ.
5. «fusha-speak-chrome-extension» قىسقۇچىنى تاللاڭ.
6. قىستۇرما دەرھال Chrome نىڭ يان تاختىسى (Side Panel) بىلەن قوراللار كۆزنىكىدە تولۇق ئىشقا كىرىشىدۇ!

### ئەخلاقىي ۋە بىخەتەرلىك پرىنسىپلىرى:
- نۆل تېلېمېتىرىيە (Zero Telemetry & 100% Local Privacy)
- خىتاي شىركەتلىرى ۋە مۇلازىمەتلىرىدىن 100% خالىي
- شەرقىي تۈركىستان ئىلىم مەرىپىتى ۋە ئەھلى سۈننەت ئەخلاقى بويىچە ئىشلەندى.
`;
  rootFolder.file('README.md', readmeContent);

  // Generate buffer
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  // 1. Output to root
  fs.writeFileSync(path.resolve('fusha-speak-chrome-extension.zip'), content);
  fs.writeFileSync(path.resolve('extension.zip'), content);

  // 2. Output to public folder so it is directly downloadable via web URL
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'fusha-speak-chrome-extension.zip'), content);
  fs.writeFileSync(path.join(publicDir, 'extension.zip'), content);

  console.log('Zip file created successfully!');
  console.log(`Size: ${(content.length / 1024).toFixed(2)} KB`);
}

createExtensionZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
