declare module 'markdown-it-texmath' {
  import { PluginWithOptions } from 'markdown-it'
  
  interface TexmathOptions {
    engine: any;
    delimiters: string | Array<{
      name: string;
      inline: [string, string];
      display: [string, string];
    }>;
  }

  const texmath: PluginWithOptions<TexmathOptions>
  export default texmath
}

declare module 'katex' {
  const katex: any
  export default katex
} 