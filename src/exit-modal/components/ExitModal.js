import React from 'react'
import PropTypes from 'prop-types'
import exitIntent from 'exit-intent'
import Rodal from 'rodal';
// include styles
import 'rodal/lib/rodal.css';
import { ExitModalAnimations } from './ExitModalAnimations';

export class ExitModal extends React.Component {
  static defaultProps = {
    minimumSecondsOnPage: 5,
    animation: ExitModalAnimations.ZOOM,
    showMask: true
  }
  
  constructor (props) {
    super(props);

    this.state = { 
      visible: false,
      modalShown: false,
      timeMounted: null
    };

    this.removeExitIntent = exitIntent({
      threshold: 20,
      maxDisplays: 10,
      eventThrottle: 100,
      onExitIntent: this.onExitIntent.bind(this)   
    })
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      timeMounted: new Date()
    })
  }

  onExitIntent = () => {
    const { modalShown } = this.state;
    const time = new Date();

    const delta = time.getTime() - this.state.timeMounted.getTime();
    const shouldPresentModal = delta >= (this.props.minimumSecondsOnPage * 1000);

    if (shouldPresentModal && !modalShown) {
      this.show();
      this.setState({ ...this.state, modalShown: true })
    }
  }

  removeExitIntent = () => {
    this.removeExitIntent();
  }

  show () {
    this.setState({ visible: true });
  }

  hide () {
    this.setState({ visible: false });
  }

  render () {
    const {
      width,
      height,
      animation,
      showMask
    } = this.props;

    return (
      <Rodal 
        animation={animation}
        showMask={showMask}
        className="exit-modal"
        width={width ? width : 400}
        height={height ? height : 240}
        visible={this.state.visible} 
        onClose={this.hide.bind(this)}>
        { this.props.children }
      </Rodal>
    )
  }
}

ExitModal.propTypes = {
  children: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  minimumSecondsOnPage: PropTypes.number,
  animation: PropTypes.string
}