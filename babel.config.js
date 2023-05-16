const plugins = [
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "@babel/plugin-proposal-optional-chaining"
]
if(process.env.NODE_ENV === 'production') {
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn", "info"] }])
}

module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        jsx: {
          compositionAPI: true
        }
      }
    ]
  ],
  plugins
}
