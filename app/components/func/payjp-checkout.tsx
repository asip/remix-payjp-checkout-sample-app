import { useCallback, useEffect, useId } from "react"

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
  // alert: () => void
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

const PayjpCheckout = ({
  className = 'payjp-button',
  dataKey,
  dataPartial,
  dataText,
  dataSubmitText,
  dataTokenName,
  dataPreviousToken,
  dataLang,
  dataNamePlaceholder,
  dataTenant,
  onCreatedHandler = () => undefined,
  onFailedHandler = () => undefined
}: PayjpCheckoutProps) => {
  const payjpCheckoutId = useId()

  const onCreated = useCallback((response: PayjpCheckoutResponse) => {
    const payload: PayjpCheckoutPayload = {token: response.id}
    onCreatedHandler(payload)
  }, [onCreatedHandler])

  const onFailed = useCallback((statusCode: number, errorResponse: PayjpCheckoutErrorResponse) => {
    const payload: PayjpCheckoutErrorPayload = {statusCode, message: errorResponse.message}
    onFailedHandler(payload)
  }, [onFailedHandler])

  useEffect(() => {
    // const windowAlertBackUp = window.alert
    window.payjpCheckoutOnCreated = onCreated
    window.payjpCheckoutOnFailed = onFailed
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

    //console.log(props)

    const script = document.createElement('script')
    script.src = 'https://checkout.pay.jp/'
    script.classList.add(className)
    script.dataset.key = dataKey || ''
    script.dataset.partial = dataPartial || 'false'
    if (dataText) script.dataset.text = dataText
    if (dataSubmitText) script.dataset.submitText = dataSubmitText
    if (dataTokenName) script.dataset.tokenName = dataTokenName
    if (dataPreviousToken) script.dataset.previousToken = dataPreviousToken
    if (dataLang) script.dataset.lang = dataLang
    script.dataset.onCreated = 'payjpCheckoutOnCreated'
    script.dataset.onFailed = 'payjpCheckoutOnFailed'
    if (dataNamePlaceholder) script.dataset.namePlaceholder = dataNamePlaceholder
    if (dataTenant) script.dataset.tenant = dataTenant

    const payjpCheckoutElement = document.getElementById(payjpCheckoutId)
    payjpCheckoutElement?.appendChild(script)

    return () => {
      // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
      payjpCheckoutElement?.removeChild(script)
      window.payjpCheckoutOnCreated = null
      window.payjpCheckoutOnFailed = null
      // window.alert = windowAlertBackUp
      window.PayjpCheckout = null
    }
  }, [className, dataKey, dataPartial, dataText, dataSubmitText, dataTokenName, dataPreviousToken, dataLang, dataNamePlaceholder, dataTenant, onCreated, onFailed, payjpCheckoutId]) // 依存配列を追加

  return (<div id={payjpCheckoutId}></div>)
}

export default PayjpCheckout
