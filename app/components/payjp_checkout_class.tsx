import React from 'react';

interface CheckoutResponse {
  // card: any
  // created: number
  id: string
  // livemode: boolean
  // object: string
  // used: boolean
}

interface CheckoutErrorResponse {
  // code: string
  message: string
  // status: number // http (response) status code
  // type: string
}

interface Window {
  payjpCheckoutOnCreated: ((response: CheckoutResponse) => void) | null
  payjpCheckoutOnFailed: ((statusCode: number, errorResponse: CheckoutErrorResponse) => void) | null
  // alert: () => void
  PayjpCheckout:  any | null
  payjpCheckoutContext: PayjpCheckoutClass | null
}

declare var window: Window

interface PayjpCheckoutPayload {
  token: string
}

interface PayjpCheckoutErrorPayload {
  statusCode: number
  message: string
}

interface PayjpCheckoutClassProps {
  className?: string
  dataKey?: string
  dataPartial?: string
  dataText?: string
  dataSubmitText?: string
  dataTokenName?:  string
  dataPreviousToken?: string
  dataLang?: string
  dataNamePlaceholder?: string
  dataTenant?: string,
  onCreatedHandler: ((payload: PayjpCheckoutPayload) => void)
  onFailedHandler: ((payload: PayjpCheckoutErrorPayload) => void)
}

class PayjpCheckoutClass extends React.Component<PayjpCheckoutClassProps> {

  payjpCheckoutElement: HTMLElement | null
  script!: HTMLScriptElement

  // windowAlertBackUp!: () => void

  constructor(props: PayjpCheckoutClassProps) {
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
    // this.windowAlertBackUp = window.alert;
    window.payjpCheckoutOnCreated = this.onCreated;
    window.payjpCheckoutOnFailed = this.onFailed;
    window.payjpCheckoutContext = this;
    /* // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {
    }; */

    this.script = document.createElement('script');
    this.script.src = 'https://checkout.pay.jp/';
    this.props.className && this.script.classList.add(this.props.className);
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
    this.payjpCheckoutElement?.appendChild(this.script);
  }

  componentWillUnmount() {
    // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
    this.payjpCheckoutElement?.removeChild(this.script);
    window.payjpCheckoutOnCreated = null;
    window.payjpCheckoutOnFailed = null;
    window.payjpCheckoutContext = null;
    // window.alert = this.windowAlertBackUp;
    window.PayjpCheckout = null;
  }

  shouldComponentUpdate(_nextProps: any, _nextState: any, _nextContext: any) {
    return false;
  }

  onCreated(response: CheckoutResponse) {
    const payload: PayjpCheckoutPayload = {token: response.id}
    window.payjpCheckoutContext?.props.onCreatedHandler(payload);
  }

  onFailed(statusCode: number, errorResponse: CheckoutErrorResponse) {
    const payload: PayjpCheckoutErrorPayload = {statusCode, message: errorResponse.message}
    window.payjpCheckoutContext?.props.onFailedHandler(payload);
  }

  render() {
    return <div id="payjpCheckout"></div>;
  }
}

export default PayjpCheckoutClass;