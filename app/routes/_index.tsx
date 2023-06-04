import type { V2_MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node"
import { Link, useLoaderData } from '@remix-run/react';
import PayjpCheckoutClass from '~/components/payjp_checkout_class'

export const meta: V2_MetaFunction = () => {
  return [{ title: "Remix Pay.jp Checkout sample App" }];
};

export async function loader() {
  return json({
    env: {
      PAYJP_PUBLIC_KEY: process.env.PAYJP_PUBLIC_KEY,
    },
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const payjpCheckoutProps = {
    dataKey: data.env.PAYJP_PUBLIC_KEY,
    dataText: 'クレジットカードで支払う',
    dataPartial: 'true',
    onCreatedHandler: onCreated,
    onFailedHandler: onFailed,
  }

  function onCreated(payload: any) {
    //console.log(payload)
    console.log(payload.token)
  }

  function onFailed(payload: any) {
    console.log(payload.message)
  }

  const [checkout, setCheckout] = useState<any>(null);

  useEffect(() => {
    const check = (
      <PayjpCheckoutClass {...payjpCheckoutProps} />
    );
    setCheckout(check);
  }, []);

  return (
    <div className="payjpButtonArea">
      <div>class component</div>
      <div><Link to="/func">function component</Link></div>
      {/* <div><a href="/func">function component</a></div> */}
      {checkout}
    </div>
  );
}
