
const { createAuthHandler } = require('/opt/authLayer/authWrapper');


const lambdaHandler = async (event, context) => {

  const { user } = event;

  console.log("event.body: " + JSON.stringify(event));

  const XSOLLA_PROJECT_ID = 254006;
  const XSOLLA_MERCHANT_ID = "478588";
  const XSOLLA_API_KEY = "06ff94a2cfb4c8a7ff356e4d38af108d14666bdc";
  const url = "https://api.xsolla.com/merchant/v2/merchants/"
    + XSOLLA_MERCHANT_ID + "/token";
  const customHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Basic "
      + Buffer.from(XSOLLA_MERCHANT_ID + ":"
        + XSOLLA_API_KEY).toString('base64')
  }

  const body = {
    settings: {
      currency: "USD",
      language: "en",
      project_id: XSOLLA_PROJECT_ID,
      ui: {
        size: "medium"
      }
    },

    user: {
      email: { value: user.email },
      id: { value: user.email },
      name: { value: user.email }
    }
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: customHeaders,
    body: JSON.stringify(body)
  })

  const data = await resp.json();

  console.log(data);
  console.log("data.token: " + data.token);
  console.log("package_number: " + event.body.package_number)

  const url2 = "https://store.xsolla.com/api/v2/project/" + XSOLLA_PROJECT_ID
    + "/payment/item/StarbuckPackage" + event.body.package_number + "SKU";

  const customHeaders2 = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + data.token
  }

  const body2 = {
    sandbox: true,
    quantity: 1,
    settings: {
      ui: {
        theme: "63295a9a2e47fab76f7708e1",
        desktop: {
          header: {
            is_visible: true,
            visible_logo: true,
            visible_name: true,
            visible_purchase: true,
            type: "normal",
            close_button: false
          }
        }
      }
    }
  }

  console.log("flag1")

  const resp2 = await fetch(url2, {
    method: 'POST',
    headers: customHeaders2,
    body: JSON.stringify(body2)
  })

  console.log("flag2")
  const data2 = await resp2.json();
  console.log("data2: " + JSON.stringify(data2))

  return data2.token
}

exports.lambdaHandler = createAuthHandler(lambdaHandler);
