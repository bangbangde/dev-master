# element, antd, material 等组件库样式管理方案比较

## #element vue

> https://github.com/ElemeFE/element

以 Button 组件为例，其 vue 文件位于 `element/packages/button/src/button.vue`，
文件内不包含 style 标签，也没有引入任何样式文件。

```vue
<template>
  <button
    class="el-button"
    :class="..."
  >
    ...
  </button>
</template>
<script>
...
</script>
```

其样式定义于 `element/packages/theme-chalk/src/button.scss`:

```scss
@charset "UTF-8";
@import "common/var";
@import "mixins/button";
@import "mixins/mixins";
@import "mixins/utils";

@include b(button) {...}
```

## #antd react

antd 使用了 cssinjs 方案，同样以 Button 组件为例:


```tsx
// https://github.com/ant-design/ant-design/blob/master/components/button/button.tsx

import classNames from 'classnames';
import useStyle from './style';

...

const classes = classNames(
  prefixCls,
  hashId,
  {
    ...
  },
  compactItemClassnames,
  className,
);

<button
  className={classes}
>
  ...
</button>
```

样式就在当前组件目录下的 style 文件夹

index.ts
```ts
// https://github.com/ant-design/ant-design/blob/master/components/button/style/index.ts

import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genGroupStyle from './group';
import { genFocusStyle } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import { genCompactItemVerticalStyle } from '../../style/compact-item-vertical';

...

export default genComponentStyleHook('Button', (token) => {
  const { controlTmpOutline, paddingContentHorizontal } = token;

  const buttonToken = mergeToken<ButtonToken>(token, {
    colorOutlineDefault: controlTmpOutline,
    buttonPaddingHorizontal: paddingContentHorizontal,
  });

  return [
    // Shared
    genSharedButtonStyle(buttonToken),

    // Size
    genSizeSmallButtonStyle(buttonToken),
    genSizeBaseButtonStyle(buttonToken),
    genSizeLargeButtonStyle(buttonToken),
    ...
  ];
});
```

## # antd vue3

样式使用 less 编写，单独放置在组件所在目录下的 style 文件夹。组件 tsx 内没有直接引入。

- https://github.com/vueComponent/ant-design-vue/blob/main/components/button/button.tsx
- https://github.com/vueComponent/ant-design-vue/blob/main/components/button/style/index.tsx


## # material react
cssinjs 方案，样式就写在组件 js 里。看 Button 组件实现：

```js
// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Button/Button.js


import styled, { rootShouldForwardProp } from '../styles/styled';
import buttonClasses, { getButtonUtilityClass } from './buttonClasses';
...

const Button = React.forwardRef(function Button(inProps, ref) {

  ...

  const commonIconStyles = (ownerState) => ({
    ...(ownerState.size === 'small' && {
      '& > *:nth-of-type(1)': {
        fontSize: 18,
      },
    }),
    ...(ownerState.size === 'medium' && {
      '& > *:nth-of-type(1)': {
        fontSize: 20,
      },
    }),
    ...(ownerState.size === 'large' && {
      '& > *:nth-of-type(1)': {
        fontSize: 22,
      },
    }),
  });

  ...

  const classes = useUtilityClasses(ownerState);

  return (
    <ButtonRoot
      className={clsx(contextProps.className, classes.root, className)}
      classes={classes}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonRoot>
  );
});
```

样式文件