# react-exit-modal

> A modal that triggers when you exit the window.

[![NPM](https://img.shields.io/npm/v/react-exit-modal.svg)](https://www.npmjs.com/package/react-exit-modal) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-exit-modal
```

## Usage

```jsx
import React, { Component } from 'react'

import { ExitModal, ExitModalAnimations } from 'react-exit-modal'
import 'rodal/lib/rodal.css';

class Example extends Component {
  render () {
    return (
      <ExitModal
        minimumSecondsOnPage={3},
        animation={ExitModalAnimations.ZOOM}
        showMask={true}

        // unique name to describe the modal
        modalName={'landing-page-signup-modal'} 
        modalExpiryHours={12} // 
      >
        <div>Your content</div>
      </ExitModal>
    )
  }
}
```

## License

MIT © [stemmlerjs](https://github.com/stemmlerjs)
