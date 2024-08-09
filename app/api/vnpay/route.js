
import crypto from 'crypto';
import querystring from 'querystring';

export default function handler(req, res) {
  const { amount, orderId } = req.body;

  let vnpUrl = process.env.VNP_URL;
  const vnpTmnCode = process.env.VNP_TMNCODE;
  const vnpHashSecret = process.env.VNP_HASHSECRET;
  const vnpReturnUrl = process.env.VNP_RETURNURL;

  const date = new Date();
  const createDate = date.toISOString().slice(0, 19).replace(/-/g, '').replace(/T/g, '').replace(/:/g, '');

  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpTmnCode,
    vnp_Amount: amount * 100, // amount in VND * 100
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    vnp_Locale: 'vn',
    vnp_OrderInfo: `Payment for order ${orderId}`,
    vnp_OrderType: 'billpayment',
    vnp_ReturnUrl: vnpReturnUrl,
    vnp_TxnRef: orderId,
    vnp_ExpireDate: createDate + '2359',
  };

  const sortedParams = Object.fromEntries(Object.entries(params).sort());
  const signData = querystring.stringify(sortedParams);
  const hmac = crypto.createHmac('sha512', vnpHashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnpUrl += '?' + signData + '&vnp_SecureHash=' + signed;

  res.status(200).json({ vnpUrl });
}
