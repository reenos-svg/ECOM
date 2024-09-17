// global.d.ts
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  handler: (response) => void;
  prefill: {
    name: string;
    contact: string;
  };
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  Razorpay: new (options: RazorpayOptions) => any;
}

interface ImportMetaEnv {
  readonly RAZORPAY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
