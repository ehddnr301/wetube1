## webpack with typescript

- <https://webpack.js.org/configuration/configuration-languages/>
- tsconfig-for-webpack-config.json 파일을 추가하여 줍니다.
- ts-node, @types/node, cross-env, @types/webpack, tsconfig-paths 의 설치가 필요합니다.

- `DeprecationWarning: Tapable.plugin is deprecated. Use new API on '.hooks' instead` 오류
- extract-text-webpack-plugin 를 최신버전으로 설치하여 해결했습니다.
- `yarn add extract-text-webpack-plugin@next`
