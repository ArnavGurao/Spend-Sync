export default function myPlugin(options = {}) {
  return {
    name: 'my-plugin', // required, unique name
    // Boilerplate for Vite virtual modules starting with ~/
    resolveId(source) {
      if (source.startsWith('~/')) {
        // We indicate to Vite that this is a virtual module
        return '\0my-plugin:' + source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0my-plugin:~/')) {
        // Virtual module code example
        // You could generate content dynamically here
        const virtualPath = id.replace(/^\\0my-plugin:/, '');
        return `// Virtual module for ${virtualPath}\nexport default \'Hello from ${virtualPath}\';`;
      }
      return null;
    },
    // Retain original hooks, e.g., config and transform
    config(config, { command }) {
      // Optionally modify config here
    },
    transform(code, id) {
      // You can modify file contents here/e
      // Return modified code or null
      return code;
    },
  };
}
