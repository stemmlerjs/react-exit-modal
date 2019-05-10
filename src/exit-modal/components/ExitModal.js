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
    showMask: true,
    modalName: 'exit-modal',
    modalExpiryHours: 12,
    className: '',
    mobileTimerSeconds: 15,
    showOnMobile: true
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

  isMobile = () => {
    if (typeof window.navigator !== 'undefined') {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
      }
    }
    return false;
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      timeMounted: new Date()
    });

    if (this.isMobile() && this.props.showOnMobile) {
      console.log(`Displaying modal in ${this.props.mobileTimerSeconds} seconds.`)
      setTimeout(() => {
        this.onExitIntent();
      }, this.props.mobileTimerSeconds * 1000)
    }
  }

  saveEventToLocalStorage = () => {
    if (typeof window !== undefined) { 
      window.localStorage.setItem(
        this.props.modalName, 
        JSON.stringify({ dispatchTime: new Date() })
      )
    }
  }

  getDateDispatched = () => {
    if (typeof window !== undefined) {
      try {
        const raw = window.localStorage.getItem(this.props.modalName);
        const event = JSON.parse(raw);
        const { dispatchTime } = event;
        return new Date(dispatchTime);
      } catch (err) {
        return null;
      }
    }
  }

  hasAlreadyPresentedModal = () => {
    const dateDispatched = this.getDateDispatched();
    const expiryTimeThresh = 1000 * 60 * 60 * this.modalExpiryHours;

    if (dateDispatched) {
      const date = new Date();
      const expiryTime = date.getTime() - dateDispatched.getTime();

      if (expiryTime >= expiryTimeThresh) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  onExitIntent = () => {
    const { modalShown } = this.state;
    const time = new Date();
    const hasAlreadyPresentedModal = this.hasAlreadyPresentedModal();

    if (hasAlreadyPresentedModal) {
      return;
    }
    
    const delta = time.getTime() - this.state.timeMounted.getTime();
    const shouldPresentModal = delta >= (this.props.minimumSecondsOnPage * 1000);

    if (shouldPresentModal && !modalShown) {
      this.show();
      this.setState({ ...this.state,  })
    }
  }

  removeExitIntent = () => {
    this.removeExitIntent();
  }

  show () {
    this.setState({ visible: true, modalShown: true });
  }

  hide () {
    this.setState({ visible: false });
    this.saveEventToLocalStorage();
  }

  render () {
    const {
      width,
      height,
      animation,
      showMask,
      className
    } = this.props;

    return (
      <div style={{
        display: this.state.visible ? 'auto' : 'none'
      }}>
        <Rodal 
          animation={animation}
          showMask={showMask}
          className={className ? className : 'exit-modal'}
          width={width ? width : 400}
          height={height ? height : 240}
          visible={this.state.visible} 
          onClose={this.hide.bind(this)}>
          { this.props.children }
        </Rodal>
      </div>
    )
  }
}

ExitModal.propTypes = {
  children: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  minimumSecondsOnPage: PropTypes.number,
  animation: PropTypes.string,
  modalName: PropTypes.string,
  modalExpiryHours: PropTypes.number,
  className: PropTypes.string,
  mobileTimerSeconds: PropTypes.number,
  showOnMobile: PropTypes.bool
}