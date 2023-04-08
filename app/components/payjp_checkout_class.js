import React from 'react';

class PayjpCheckoutClass extends React.Component {
  constructor(props) {
    super(props);
    this.payjpCheckoutElement = null;
  }

  static defaultProps = {
    className: 'payjp-button',
    dataKey: '',
    onCreatedHandler: () => {
    },
    onFailedHandler: () => {
    },
  };

  componentDidMount() {
    this.windowAlertBackUp = window.alert;
    window.payjpCheckoutOnCreated = this.onCreated;
    window.payjpCheckoutOnFailed = this.onFailed;
    window.payjpCheckoutContext = this;
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {
    };

    this.script = document.createElement('script');
    this.script.src = 'https://checkout.pay.jp/';
    this.script.classList.add(this.props.className);
    this.script.dataset['key'] = this.props.dataKey;
    this.props.dataPartial ? (this.script.dataset['partial'] = this.props.dataPartial) : (this.script.dataset['partial'] = 'false')
    this.props.dataText && (this.script.dataset['text'] = this.props.dataText);
    this.props.dataSubmitText && (this.script.dataset['submitText'] = this.props.dataSubmitText);
    this.props.dataTokenName && (this.script.dataset['tokenName'] = this.props.dataTokenName);
    this.props.dataPreviousToken && (this.script.dataset['previousToken'] = this.props.dataPreviousToken);
    this.props.dataLang && (this.script.dataset['lang'] = this.props.dataLang);
    this.script.dataset['onCreated'] = 'payjpCheckoutOnCreated';
    this.script.dataset['onFailed'] = 'payjpCheckoutOnFailed';
    this.props.dataNamePlaceholder && (this.script.dataset['namePlaceholder'] = this.props.dataNamePlaceholder);
    this.props.dataTenant && (this.script.dataset['tenant'] = this.props.dataTenant);

    this.payjpCheckoutElement = document.getElementById('payjpCheckout');
    this.payjpCheckoutElement && this.payjpCheckoutElement.appendChild(this.script);
  }

  componentWillUnmount() {
    // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
    this.payjpCheckoutElement.removeChild(this.script);
    window.payjpCheckoutOnCreated = null;
    window.payjpCheckoutOnFailed = null;
    window.payjpCheckoutContext = null;
    window.alert = this.windowAlertBackUp;
    window.PayjpCheckoutClass = null;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  onCreated(response) {
    const payload = {token: response.id}
    window.payjpCheckoutContext.props.onCreatedHandler(payload);
  }

  onFailed(statusCode, errorResponse) {
    const payload = {message: errorResponse.message}
    window.payjpCheckoutContext.props.onFailedHandler(payload);
  }

  render() {
    return <div id="payjpCheckout"></div>;
  }
}

export default PayjpCheckoutClass;