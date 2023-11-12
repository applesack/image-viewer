module.exports = {
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    "vue/multi-word-component-names": "off"
  },
  "globals": {
    "defineOptions": "readonly"
  }
};
