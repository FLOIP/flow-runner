module.exports = {
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'project': './tsconfig.json',
  },

  extends: [
    'plugin:jest/recommended',
    'plugin:lodash/recommended',
    'eslint:recommended',

    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',

    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  plugins: [
    'jest',
    'lodash',
    'lodash-fp',
    '@typescript-eslint',
  ],

  env: {
    'jest/globals': true,
  },

  overrides: [
    {
      'files': [
        '*.vue',
        '*.js',
        '*.ts',
        '*.tsx',
      ],
    },
  ],

  rules: {
    /********************
     * Typescript rules *
     ********************/
    /********************
     * Typescript rules *
     ********************/
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowNullable: true,
      },
    ],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      },
    ],



    /*************************
     * Modified ESLint rules *
     *************************/
    'one-var': ['error', 'never'],

    // These are off due to https://github.com/typescript-eslint/typescript-eslint/blob/f335c504bcf75623d2d671e2e784b047e5e186b9/docs/getting-started/linting/FAQ.md#eslint-plugin-import
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/no-cycle': 'off',
    'import/no-unused-modules': 'off',
    'import/no-deprecated': 'off',

    'import/no-absolute-path': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'no-empty-function': ['error', {allow: ['constructors']}],
    'no-tabs': 'error',

    'no-use-before-define': [
      'off',
      {
        functions: true,
        classes: true,
        variables: false,
      },
    ],
    'lines-between-class-members': ['off'],
    'prefer-destructuring': [
      'error',
      {object: false, array: false},
    ],
    'space-before-function-paren': [
      'error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
          'info',
        ],
      },
    ],
    'object-curly-spacing': [
      'error',
      'never',
    ],

    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      },
    ],

    'indent': [
      'off',
      2,
      {
        VariableDeclarator: 'off',
        MemberExpression: 1,
        ArrayExpression: 2,
        ObjectExpression: 'off',
        CallExpression: {'arguments': 2},
        FunctionDeclaration: {'parameters': 2},
        FunctionExpression: {'parameters': 2},
      },
    ],
    'no-trailing-spaces': [
      'error',
      {skipBlankLines: true},
    ],
    'max-len': [
      'warn',
      {code: 140},
    ],
    'eol-last': [
      'warn',
      'always',
    ],
    semi: [
      'warn',
      'never',
    ],
    'no-param-reassign': 'off',
    'import/no-unresolved': ['off'],
    'implicit-arrow-linebreak': 'off',

    // Argument for this best presented here: https://youtu.be/eEBOvqMfPoI?t=1665
    'no-else-return': ['off'],
    'spaced-comment': 'off',

    /**********
     * Lodash *
     **********/
    'lodash/import-scope': [
      'error',
      'member',
    ],
    'lodash/matches-prop-shorthand': 'off',

    // Disable all lodash prefer checks for things that already exist natively
    'lodash/prefer-lodash-method': ['off'],
    'lodash/prefer-lodash-typecheck': 'off',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/preferred-alias': 'off',
    'lodash/prefer-includes': 'off',
    'lodash/prefer-get': 'off',
    'lodash/prefer-is-nil': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-matches': 'off',
    'lodash/prefer-over-quantifier': 'off',
    'lodash/prefer-some': 'off',
    'lodash/prefer-startswith': 'off',
    'lodash/prefer-times': 'off',
    'lodash/prop-shorthand': ['warn', 'never'],


    /*************
     * Lodash FP *
     *************/
    'lodash-fp/consistent-compose': 'off',
    'lodash-fp/consistent-name': [
      'error',
      '_',
    ],
    'lodash-fp/no-argumentless-calls': 'error',
    'lodash-fp/no-chain': 'error',
    'lodash-fp/no-extraneous-args': 'error',
    'lodash-fp/no-extraneous-function-wrapping': 'off',
    'lodash-fp/no-extraneous-iteratee-args': 'error',
    'lodash-fp/no-extraneous-partials': 'error',
    'lodash-fp/no-for-each': 'off',
    'lodash-fp/no-partial-of-curried': 'error',
    'lodash-fp/no-single-composition': 'off',
    'lodash-fp/no-submodule-destructuring': 'error',
    'lodash-fp/no-unused-result': 'error',
    'lodash-fp/prefer-compact': 'error',
    'lodash-fp/prefer-composition-grouping': 'error',
    'lodash-fp/prefer-constant': [
      'off',
      {
        arrowFunctions: false,
      },
    ],
    'lodash-fp/prefer-flat-map': 'error',
    'lodash-fp/prefer-get': 'error',
    'lodash-fp/prefer-identity': [
      'error',
      {
        arrowFunctions: false,
      },
    ],
    'lodash-fp/preferred-alias': 'off',
    'lodash-fp/use-fp': 'off',

    /**************
     * Jest Rules *
     **************/
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

  },
}

