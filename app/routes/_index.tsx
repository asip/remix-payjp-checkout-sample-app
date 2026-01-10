import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node"
// @ts-ignore
import { ClientOnly } from "remix-utils/client-only"
import { Link, useLoaderData } from '@remix-run/react';
import PayjpCheckout from '~/components/func/payjp-checkout'

export const meta: MetaFunction = () => {
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

  return (
    <div className="payjpButtonArea">
      <div>function component</div>
      <div><Link to="/class" >class component</Link></div>
      {/* <div><a href="/">class component</a></div> */}
      <ClientOnly>
        { () => <PayjpCheckout {...payjpCheckoutProps} /> }
      </ClientOnly>
    </div>
  );
}