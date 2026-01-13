import * as React from 'react'

interface PayjpCheckoutResponse {
  // card: any
  // created: number
  id: string
  // livemode: boolean
  // object: string
  // used: boolean
}

interface PayjpCheckoutErrorResponse {
  // code: string
  message: string
  // status: number // http (response) status code
  // type: string
}

export interface PayjpCheckoutPayload {
  token: string
}

export interface PayjpCheckoutErrorPayload {
  statusCode: number
  message: string
}

interface PayjpWindow extends Window {
  payjpCheckoutOnCreated: ((response: PayjpCheckoutResponse) => void) | null
  payjpCheckoutOnFailed: ((statusCode: number, errorResponse: PayjpCheckoutErrorResponse) => void) | null
  PayjpCheckout: unknown | null
}

declare const window: PayjpWindow

interface PayjpCheckoutProps {
  className?: string
  dataKey?: string
  dataPartial?: string
  dataText?: string
  dataSubmitText?: string
  dataTokenName?: string
  dataPreviousToken?: string
  dataLang?: string
  dataNamePlaceholder?: string
  dataTenant?: string,
  onCreatedHandler: ((payload: PayjpCheckoutPayload) => void)
  onFailedHandler: ((payload: PayjpCheckoutErrorPayload) => void)
}

class PayjpCheckout extends React.Component<PayjpCheckoutProps> {

  payjpCheckoutElement: HTMLElement | null = null
  script: HTMLScriptElement | null = null

  // windowAlertBackUp!: () => void
  payjpCheckoutId: string

  constructor(props: PayjpCheckoutProps) {
    super(props)
    this.onCreated = this.onCreated.bind(this)
    this.onFailed = this.onFailed.bind(this)
    this.payjpCheckoutId = crypto.randomUUID()
  }

  static defaultProps = {
    className: 'payjp-button',
    dataKey: '',
    onCreatedHandler: () => {},
    onFailedHandler: () => {},
  }

  componentDidMount() {
    // this.windowAlertBackUp = window.alert
    window.payjpCheckoutOnCreated = this.onCreated
    window.payjpCheckoutOnFailed = this.onFailed
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

    this.script = document.createElement('script')
    this.script.src = 'https://checkout.pay.jp/'
    this.props.className && this.script.classList.add(this.props.className)
    this.script.dataset.key = this.props.dataKey || ''
    this.script.dataset.partial = this.props.dataPartial || 'false'
    if (this.props.dataText) this.script.dataset.text = this.props.dataText
    if (this.props.dataSubmitText) this.script.dataset.submitText = this.props.dataSubmitText
    if (this.props.dataTokenName) this.script.dataset.tokenName = this.props.dataTokenName
    if (this.props.dataPreviousToken) this.script.dataset.previousToken = this.props.dataPreviousToken
    if (this.props.dataLang) this.script.dataset.lang = this.props.dataLang
    this.script.dataset.onCreated = 'payjpCheckoutOnCreated'
    this.script.dataset.onFailed = 'payjpCheckoutOnFailed'
    if (this.props.dataNamePlaceholder) this.script.dataset.namePlaceholder = this.props.dataNamePlaceholder
    if (this.props.dataTenant) this.script.dataset.tenant = this.props.dataTenant

    this.payjpCheckoutElement = document.getElementById(this.payjpCheckoutId)
    this.payjpCheckoutElement?.appendChild(this.script)
  }

  componentWillUnmount() {
    // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
    this.payjpCheckoutElement?.removeChild(this.script as Node)
    window.payjpCheckoutOnCreated = null
    window.payjpCheckoutOnFailed = null
    // window.alert = this.windowAlertBackUp
    window.PayjpCheckout = null
  }

  shouldComponentUpdate(_nextProps: unknown, _nextState: unknown, _nextContext: unknown) {
    return false // PAY.JP スクリプトが DOM を直接操作するため、React の再レンダリングを抑制
  }

  onCreated(response: PayjpCheckoutResponse) {
    const payload: PayjpCheckoutPayload = {token: response.id}
    this.props.onCreatedHandler(payload)
  }

  onFailed(statusCode: number, errorResponse: PayjpCheckoutErrorResponse) {
    const payload: PayjpCheckoutErrorPayload = {statusCode, message: errorResponse.message}
    this.props.onFailedHandler(payload)
  }

  render() {
    return <div id={this.payjpCheckoutId}></div>
  }
}

export default PayjpCheckout
