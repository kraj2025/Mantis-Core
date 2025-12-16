import React, { useState } from 'react';
import "./addCreditmodal.css"

import { toast } from 'react-toastify';
import Input from '../../../../components/formComponent/Input';
import RazorpayButton from '../../RazorpayButtton';

const AddCreditsModal = ({ clientCode, PerCreditTokenCost, setModalData }) => {
    const [amount, setAmount] = useState(100);
    const initialValue = { Amount: 100, payment: "Credit/Debit Card", creditToken: Math.round(100 / (PerCreditTokenCost ? PerCreditTokenCost : 1)) }
    const [values, setValues] = useState(initialValue)
    const handleChange = (e) => {
        const { value, name } = e.target
        if (name === "Amount") {
            setValues((val) => ({ ...val, [name]: value, creditToken: Math.round(value / (PerCreditTokenCost ? PerCreditTokenCost : 1)) }))
        } else {
            setValues((val) => ({ ...val, [name]: e.target.checked }))
        }
    }

    const RechargeNow = async (response) => {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response
        // debugger
        const payload = {
            "clientCode": clientCode,
            "transactionType": "Recharge",
            "creditToken": values?.creditToken,
            "amount": values?.Amount,
            "currency": "INR",
            "currencyFactor": 1,
            "specificAmount": values?.Amount,
            "perCreditTokenCost": PerCreditTokenCost,
            RazorPayOrderId: `OrderID:${razorpay_order_id}#PaymentID:${razorpay_payment_id}#Signature:${razorpay_signature}`
        }
        const apiResp = await AIClientRechargeTnxDetailsInsert(payload)
        // debugger
        if (apiResp?.success) {
            toast.success(apiResp?.message)
            setValues(initialValue)
            setModalData()
        } else {
            toast.error(apiResp?.message, "error")
        }

    }

    return (
        <div className='p-2'>
            <div className="add-credits-container">
                <div className="add-credits-card">


                    <p className="credits-subtitle">
                        Recharge your account to continue using AI services.
                    </p>
                    <p className="credits-highlight">Using AI services: {PerCreditTokenCost ? PerCreditTokenCost : 0} Rs = 1 Credits </p>

                    <Input
                        type="text"
                        className="form-control"
                        lable={"Amount"}
                        placeholder=""
                        name="Amount"
                        value={values?.Amount ? values?.Amount : ""}
                        respclass="col-12 pl-0"
                        onChange={handleChange}
                    />
                    <p className="credits-small-text">You will get {values?.creditToken} credits.</p>

                    {/* Payment Method */}
                    {/* <label className="label">Select Payment Method</label>
                    <div className="radio-group">
                        <label>
                            <input type="radio" name="payment" value={"Credit/Debit Card"} checked={values?.payment} onChange={handleChange} /> Credit/Debit Card
                        </label>
                    </div>
                    <div className="radio-group">
                        <label>
                            <input type="radio" name="payment" value={"UPI"} checked={values?.payment} onChange={handleChange} /> UPI
                        </label>
                    </div> */}

                    {/* Button */}
                    {/* <button className="recharge-btn" type='button' onClick={RechargeNow}> Recharge Now</button> */}
                    <RazorpayButton amount={values?.Amount} RechargeNow={RechargeNow} />

                    {/* Footer */}
                    <p className="credits-footer-text">
                        GST and convenience fee will not be included in these amount.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddCreditsModal;
