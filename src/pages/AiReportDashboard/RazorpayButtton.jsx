
import logo from "../../assets/image/logo-itdose.png";
import { RazorPayOrder } from "./chatapi";
import { toast } from "react-toastify";

const RazorpayButton = ({ amount, RechargeNow }) => {
  const loadRazorpay = (order) => {
    // debugger

    const options = {
      key: "rzp_live_9ReCEaeNnt8BQK",
      key_secret: "bzBBgiN1g3hU8yzuaAgHmDtx",
      amount: order?.amount,
      currency: order?.currency,
      name: "AI",
      description: "AI",
      image: logo,
      // order_id: "order_R8LcgUVRTlqdyU",
      order_id: order?.id,
      notes: {
        payload: "",
      },
      prefill: {
        name: "CRM",
        email: "devendra.singh@itdoseinfo.com",
        contact: "+919999999999",
      },
      theme: {
        color: "#7470ba",
      },
      handler: async function (response) {
        // razorpay_order_id: "order_R8LhvpThJcQPsh"
        // razorpay_payment_id: "pay_R8Li5BnyjkHH9r"
        // razorpay_signature: "090f35587914abf9e262e9a92f038999c9d1062e0cc335df8888cd404e612b5c"

        RechargeNow(response);
        // console.log("asdasd", response)
        // const datas = {
        //   ...payload,
        //   receipt: payload?.receipt,
        //   key_secret: payload?.key_secret,
        //   KeyID: data.message.id,
        //   razorpay_payment_id: response.razorpay_payment_id,
        //   razorpay_order_id: response.razorpay_order_id,
        //   razorpay_signature: response.razorpay_signature,
        // };

        // axios
        //   .post("/api/v1/RazorPay/paymentVerification", datas)
        //   .then((res) => {
        //     // console.log(res);
        //     IsOpen &&
        //       AnotherPageCommonFunction({
        //         ...datas,
        //         ...res,
        //       });
        //     notify("Payment Successful!", "error")

        //     !IsOpen && window.location.reload();
        //   })
        //   .catch((err) => {
        //     IsOpen && setIsRazorPayOpen(false);
        //     notify("Payment Verification Failed!", "error")

        //   });
      },
      modal: {
        ondismiss: function () {
          // setIsRazorPayOpen(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    try {
      const apiResp = await RazorPayOrder({
        amount: String(amount),
        tnxType: "",
        receipt: "",
      });
      if (apiResp?.success) {
        loadRazorpay(apiResp?.data);
      } else {
        toast.error(apiResp?.message, "error");
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  return (
    <button
      className="credits-recharge-btn"
      type="button"
      onClick={handlePayment}
    >
      {" "}
      Pay with Razorpay{" "}
    </button>
  );
};

export default RazorpayButton;
