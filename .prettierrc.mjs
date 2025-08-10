const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>', // node_modules
    '^(cplibrary|cpicons|cputil|cpclient|@cpclient|cpshots).*$', // Workspace packages
    '^(constants|data|hooks|util|utils)/.*$', // Various helpers
    '^(\\.|\\.\\.)/(.(?!.(css|scss)))*$', // Any local imports that AREN"T styles.
    '\\.(css|scss)$', // Styles
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
}

export default config
