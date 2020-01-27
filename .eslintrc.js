module.exports = {
    extends: [
        '@nuxtjs/eslint-config-typescript'
    ],
    rules: {
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "indent": "off",
        "@typescript-eslint/indent": ["error", 4],
        "arrow-parens": ["warn", "as-needed"],
        "no-console": "off"
    }
}
