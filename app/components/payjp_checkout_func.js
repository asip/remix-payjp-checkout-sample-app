import React, { useEffect } from "react";

function PayjpCheckoutFunc(props) {

  const onCreated = (response) => {
    const payload = {token: response.id}
    props.onCreatedHandler(payload);
  }

  const onFailed = (statusCode, errorResponse) => {
    const payload = {message: errorResponse.message}
    props.onFailedHandler(payload);
  }

  useEffect(() => {
    const windowAlertBackUp = window.alert;
    window.payjpCheckoutOnCreated = onCreated;
    window.payjpCheckoutOnFailed = onFailed;
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {
    };

    //console.log(props);

    const script = document.createElement('script');
    script.src = 'https://checkout.pay.jp/';
    script.classList.add(props.className);
    script.dataset['key'] = props.dataKey;
    props.dataPartial ? (script.dataset['partial'] = props.dataPartial) : (script.dataset['partial'] = 'false')
    props.dataText && (script.dataset['text'] = props.dataText);
    props.dataSubmitText && (script.dataset['submitText'] = props.dataSubmitText);
    props.dataTokenName && (script.dataset['tokenName'] = props.dataTokenName);
    props.dataPreviousToken && (script.dataset['previousToken'] = props.dataPreviousToken);
    props.dataLang && (script.dataset['lang'] = props.dataLang);
    script.dataset['onCreated'] = 'payjpCheckoutOnCreated';
    script.dataset['onFailed'] = 'payjpCheckoutOnFailed';
    props.dataNamePlaceholder && (script.dataset['namePlaceholder'] = props.dataNamePlaceholder);
    props.dataTenant && (script.dataset['tenant'] = props.dataTenant);

    //console.log(script);
    let payjpCheckoutElement = document.getElementById('payjpCheckout');
    payjpCheckoutElement && payjpCheckoutElement.appendChild(script);

    return () => {
      // すでに https://checkout.pay.jp/ の checkout.js が実行済みで、script タグを削除しているだけ
      payjpCheckoutElement && payjpCheckoutElement.removeChild(script);
      window.payjpCheckoutOnCreated = null;
      window.payjpCheckoutOnFailed = null;
      window.alert = windowAlertBackUp;
      window.PayjpCheckoutFunc = null;
    }
  })

  return (<div id="payjpCheckout"></div>);
}

PayjpCheckoutFunc.defaultProps = {
  className: 'payjp-button'
};

export default PayjpCheckoutFunc;