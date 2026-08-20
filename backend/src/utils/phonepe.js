import crypto from "node:crypto";

const DEFAULT_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86",
  saltKey: process.env.PHONEPE_SALT_KEY || "96434309-7796-489d-8924-ab56988a6076",
  saltIndex: process.env.PHONEPE_SALT_INDEX || "1",
  hostUrl: process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox",
};

export function getPhonePeConfig() {
  return {
    merchantId: process.env.PHONEPE_MERCHANT_ID || DEFAULT_CONFIG.merchantId,
    saltKey: process.env.PHONEPE_SALT_KEY || DEFAULT_CONFIG.saltKey,
    saltIndex: process.env.PHONEPE_SALT_INDEX || DEFAULT_CONFIG.saltIndex,
    hostUrl: process.env.PHONEPE_HOST_URL || DEFAULT_CONFIG.hostUrl,
  };
}

/**
 * Initiates a payment request with PhonePe PG
 * @param {Object} params
 * @param {string} params.merchantTransactionId
 * @param {string} params.merchantUserId
 * @param {number} params.amountInRupees
 * @param {string} params.redirectUrl
 * @param {string} params.callbackUrl
 * @param {string} [params.mobileNumber]
 * @returns {Promise<{ success: boolean, redirectUrl: string, data: Object, message: string }>}
 */
export async function initiatePhonePePay({
  merchantTransactionId,
  merchantUserId,
  amountInRupees,
  redirectUrl,
  callbackUrl,
  mobileNumber = "9999999999",
}) {
  const config = getPhonePeConfig();
  const amountInPaise = Math.round(Number(amountInRupees) * 100);

  const payload = {
    merchantId: config.merchantId,
    merchantTransactionId,
    merchantUserId: String(merchantUserId),
    amount: amountInPaise,
    redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl,
    mobileNumber: String(mobileNumber || "9999999999").replace(/\D/g, "").slice(-10) || "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const apiPath = "/pg/v1/pay";
  const stringToHash = base64Payload + apiPath + config.saltKey;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = `${sha256}###${config.saltIndex}`;

  const response = await fetch(`${config.hostUrl}${apiPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({ request: base64Payload }),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok || !responseData.success) {
    throw new Error(
      responseData.message || "Failed to initiate PhonePe payment."
    );
  }

  const redirectInfo = responseData.data?.instrumentResponse?.redirectInfo;
  if (!redirectInfo?.url) {
    throw new Error("PhonePe payment URL was not returned by gateway.");
  }

  return {
    success: true,
    redirectUrl: redirectInfo.url,
    data: responseData.data,
    message: responseData.message || "Payment initiated successfully.",
  };
}

/**
 * Checks the status of a PhonePe transaction
 * @param {string} merchantTransactionId
 * @returns {Promise<{ success: boolean, code: string, message: string, data: Object }>}
 */
export async function verifyPhonePeStatus(merchantTransactionId) {
  const config = getPhonePeConfig();
  const apiPath = `/pg/v1/status/${config.merchantId}/${merchantTransactionId}`;
  const stringToHash = apiPath + config.saltKey;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = `${sha256}###${config.saltIndex}`;

  const response = await fetch(`${config.hostUrl}${apiPath}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": config.merchantId,
    },
  });

  const responseData = await response.json().catch(() => ({}));

  return {
    success: response.ok && responseData.success,
    code: responseData.code || "PAYMENT_PENDING",
    message: responseData.message || "",
    data: responseData.data || {},
  };
}
