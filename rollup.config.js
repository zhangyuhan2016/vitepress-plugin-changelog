import typescript from 'rollup-plugin-typescript2';
export default {
  input: './src/changelog.ts', // 替换成你的入口文件路径
  output: {
    file: 'dist/changelog.js', // 替换成你的输出文件路径
    format: 'es', // CommonJS 格式适用于 Node.js
    sourcemap: false,
  },
  plugins: [
    typescript()
  ],
  external: [
    'md5',
    'simple-git',
  ]
};
