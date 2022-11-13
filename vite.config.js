import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { IconsManifest } from 'react-icons/lib';
import { defineConfig } from 'vite';

const imports = IconsManifest.map(
  ({ id }) => `export * as ${id} from "react-icons/${id}";`
).join('\n');

writeFileSync('src/ReactIcons.jsx', imports);
console.log('ReactIcons.jsx generated');
const colorReplace = () => ({
  name: 'color-replace',
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      console.log(chunk.fileName);

      if (chunk.fileName.endsWith('.css')) {
        console.log(Object.keys(chunk));
        chunk.source = chunk.source
          .replaceAll('#111b26', 'transparent')
          .replaceAll(/#096dd9/gi, '#d81b60')
          .replaceAll(/#306bd2/gi, '#d81b60')
          .replaceAll(/#096dd9/gi, '#d81b60')
          .replaceAll(/#177ddc/gi, '#ec407a')
          .replaceAll(/#165996/gi, '#ec407a')
          .replaceAll(/#095cb5/gi, '#ec407a')
          .replaceAll(/#508ccd/gi, '#ec407a')
          .replaceAll(/#1890ff/gi, '#ec407a')
          .replaceAll(/#3c9be8/gi, '#ec407a')
          .replaceAll(/#40a9ff/gi, '#ec407a')
          .replaceAll(/#5ea7f8/gi, '#f06292')
          .replaceAll(/#e6f7ff/gi, '#fce4ec');
      }
    }
  },
  // transform: (code, id) =>
  //   code
  //     .replaceAll('#111b26', 'transparent')
  //     .replaceAll(/#096dd9/gi, '#d81b60')
  //     .replaceAll(/#306bd2/gi, '#d81b60')
  //     .replaceAll(/#096dd9/gi, '#d81b60')
  //     .replaceAll(/#177ddc/gi, '#ec407a')
  //     .replaceAll(/#165996/gi, '#ec407a')
  //     .replaceAll(/#095cb5/gi, '#ec407a')
  //     .replaceAll(/#508ccd/gi, '#ec407a')
  //     .replaceAll(/#1890ff/gi, '#ec407a')
  //     .replaceAll(/#3c9be8/gi, '#ec407a')
  //     .replaceAll(/#40a9ff/gi, '#ec407a')
  //     .replaceAll(/#5ea7f8/gi, '#f06292')
  //     .replaceAll(/#e6f7ff/gi, '#fce4ec'),
});
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), colorReplace()],
  base: './',
});
