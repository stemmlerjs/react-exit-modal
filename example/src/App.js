import React, { Component } from 'react'

import { ExitModal } from 'react-exit-modal'
import 'rodal/lib/rodal.css';

export default class App extends Component {
  render () {
    return (
      <div>
          hell0
        <ExitModal>
          <div>some content</div>
        </ExitModal>
      </div>
    )
  }
}
