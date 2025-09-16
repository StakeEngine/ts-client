# Stake Engine SDK (BETA)

Typescript client to communicate with the Stake Engine API.

API documentation: https://stake-engine.com/docs/rgs

# Installation

```
npm install stake-engine

or

yarn add stake-engine
```

# Usage

```typescript
import { RGSClient } from 'stake-engine';

const rgsClient = RGSClient({
  url: window.location.href,
});

const handleAuthenticate = async () => {
  const response = await rgsClient.Authenticate();
  return response;
};

const handlePlay = async (amount: number, mode: string) => {
  // ensure amount is RGS compliant amount (1 * API_MULTIPLIER)
  // Or make sure you pass in a bet level value.
  const response = await rgsClient.Play({
    amount,
    mode,
  });

  return response;
};

const handleEndRound = async () => {
  const response = await rgsClient.EndRound();
  return response;
};

const handleEvent = async () => {
  const response = await rgsClient.Event('some_event');
  return response;
};

/*
  Params:
    decimals: Forces a certain number of decimals, otherwise defaults to a reasonable value based on currency.
    removeSymbol: Removes the currency symbol from the string EG CAD$1.99 -> 1.99
    trimDecimalForIntegers: Any number that is a whole number will not display the decimal points. This may help when displaying bet levels. EG 2.00 -> 2
*/
DisplayAmount(balance, {
  removeSymbol: true,
  decimals: 2,
  wholeNumberDecimals: true,
});
```

## User Balance

There are 2 ways to get the user balance from the client: Standard request, Event Emitter.

Each request returns the balance in the API response and the frontend can get that value and update its UI like a standard function call.

An event is also emitted to the window everytime the balance of the user is updated with the value of the new balance. You can subscribe to the `balanceUpdated` event VIA `window.addEventListener()` and you will recieve the balance updates in the callback.

When a player has been idle for a few minutes, the client will periodically call the balance endpoints to get an updated balance for the play which is available through the event listener.

# Types

- Languages
- Currencies
- Response Types
- Configuration types

# Helper functions

- `DisplayBalance(balance: Balance): string`
- `DisplayAmount(val: number): string`
- `ParseAmount(val: number): number`
- `API_MULTIPLIER`

# Events

Listen to `balanceUpdate` events to update the balance in the UI. This triggers any time a Balance object is returned from the API.

```typescript
type Balance = {
  amount: number;
  currency: Currency;
};

window.addEventListener('balanceUpdate', (event: Event) => {
  const customEvent = event as CustomEvent<Balance>;
  console.log('Balance Event', customEvent.detail);
});
```

Listen to `roundActive` events to know whether to enable or disable UI buttons

```typescript
type RoundState = {
  active: boolean;
};

window.addEventListener('roundActive', (event: Event) => {
  const customEvent = event as CustomEvent<RoundState>;
  console.log('Balance Event', customEvent.detail);
});
```

# Example usage

## REACT: Subscribing to balance events example component

```typescript
import React, { useEffect, useState } from "react";

type Balance = {
  amount: number;
  currency: string;
};

const BalanceDisplay: React.FC = () => {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    const handleBalanceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<Balance>;
      setBalance(customEvent.detail);
    };

    window.addEventListener("balanceUpdate", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdate", handleBalanceUpdate);
    };
  }, []);

  if (!balance) {
    return <p className="text-gray-500">Waiting for balance update...</p>;
  }

  return (
    <div className="p-4 rounded-2xl shadow bg-white">
      <h2 className="text-lg font-semibold">Current Balance</h2>
      <p className="text-xl font-bold">

        {balance.amount} {balance.currency}
      </p>
    </div>
  );
};

export default BalanceDisplay;
```

## Svelte: Subscribing to balance events example

```typescript
<script lang="ts">
  type Balance = {
    amount: number;
    currency: string;
  };

  let balance: Balance | null = null;

  const handleBalanceUpdate = (event: CustomEvent<Balance>) => {
    balance = event.detail;
  };

  // attach listener when component mounts
  onMount(() => {
    window.addEventListener("balanceUpdate", handleBalanceUpdate as EventListener);
    return () => {
      window.removeEventListener("balanceUpdate", handleBalanceUpdate as EventListener);
    };
  });
</script>

<div class="p-4 rounded-2xl shadow bg-white">
  {#if balance}
    <h2 class="text-lg font-semibold">Current Balance</h2>
    <p class="text-xl font-bold">
      {balance.amount} {balance.currency}
    </p>
  {:else}
    <p class="text-gray-500">Waiting for balance update...</p>
  {/if}
</div>
```

# Contributing

TL;DR

1. Submit feedback via GitHub Issues
2. Participate in conversations via Discord
3. Contribute to our documentation by opening a Pull Request

If you've made it here, thank you for wanting to contribute to our project!

Help us create and improve this product! We want your input and we want your feedback!
