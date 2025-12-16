import React, { useState, useMemo } from "react";
import "./AmcCalculator.css";

export default function AMCCalculator() {
  const [equipmentValue, setEquipmentValue] = useState(0);
  const [amcPercent, setAmcPercent] = useState(0);
  const [durationYears, setDurationYears] = useState(1);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [frequency, setFrequency] = useState("Annually");

  const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  const installmentsInYear = { Monthly: 12, Quarterly: 4, Annually: 1 };

  const results = useMemo(() => {
    const EV = toNum(equipmentValue);
    const AMCpct = toNum(amcPercent) / 100;
    const years = Math.max(1, Math.floor(toNum(durationYears)));
    const disc = toNum(discountPercent) / 100;
    const gst = toNum(gstPercent) / 100;
    const addFee = toNum(additionalFee);

    const baseYearly = EV * AMCpct;
    const baseTotal = baseYearly * years;

    const discountAmount = baseTotal * disc;
    const taxableAmount = baseTotal - discountAmount + addFee;
    const tax = taxableAmount * gst;
    const grandTotal = taxableAmount + tax;

    const installmentsPerYear = installmentsInYear[frequency] || 1;
    const totalInstallments = installmentsPerYear * years;
    const perInstallment =
      totalInstallments > 0 ? grandTotal / totalInstallments : grandTotal;

    return {
      baseYearly: round(baseYearly),
      baseTotal: round(baseTotal),
      discountAmount: round(discountAmount),
      taxableAmount: round(taxableAmount),
      tax: round(tax),
      grandTotal: round(grandTotal),
      totalInstallments,
      perInstallment: round(perInstallment),
    };
  }, [
    equipmentValue,
    amcPercent,
    durationYears,
    discountPercent,
    gstPercent,
    additionalFee,
    frequency,
  ]);

  function round(v) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }

  const presets = {
    Basic: { amcPercent: 0, gstPercent: 18 },
    Premium: { amcPercent: 5, gstPercent: 18 },
    Enterprise: { amcPercent: 10, gstPercent: 18 },
  };

  return (
    <div className="amc-container pastel-bg">
      <h1 className="amc-title">AMC Calculator</h1>

      <div className="amc-grid">
        <div className="amc-input-card">
          <div className="amc-input-section">
            <div className="amc-field-group">
              <label className="mr-3">Equipment Value (₹)</label>
              <input
                type="number"
                value={equipmentValue}
                onChange={(e) => setEquipmentValue(e.target.value)}
              />
            </div>
            <div className="amc-field-group">
              <label className="mr-3">AMC Amount (₹)</label>
              {/* <label className="mr-3">Additional Fee (₹)</label> */}
              <input
                type="number"
                value={additionalFee}
                onChange={(e) => setAdditionalFee(e.target.value)}
              />
            </div>

            <div className="amc-field-group">
              <label className="mr-3">AMC % per year</label>
              <input
                type="number"
                value={amcPercent}
                onChange={(e) => setAmcPercent(e.target.value)}
              />
            </div>

            <div className="amc-field-group">
              <label className="mr-3">Duration (years)</label>
              <input
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
              />
            </div>

            <div className="amc-field-group">
              <label className="mr-3">Discount %</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>

            <div className="amc-field-group">
              <label className="mr-3">GST %</label>
              <input
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
              />
            </div>

            <div className="amc-field-group">
              <label className="mr-3">Payment Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Annually</option>
                <option>Quarterly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="amc-presets">
              {Object.keys(presets).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setAmcPercent(presets[k].amcPercent);
                    setGstPercent(presets[k].gstPercent);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="amc-result-card">
          <h2>Quote Summary</h2>
          <ul>
            <li>AMC per year: ₹ {results.baseYearly.toLocaleString()}</li>
            <li>AMC Total: ₹ {results.baseTotal.toLocaleString()}</li>
            <li>Discount: ₹ {results.discountAmount.toLocaleString()}</li>
            <li>AMC Amount: ₹ {additionalFee.toLocaleString()}</li>
            <li>Taxable Amount: ₹ {results.taxableAmount.toLocaleString()}</li>
            <li>GST: ₹ {results.tax.toLocaleString()}</li>
            <li>
              <strong>
                Grand Total: ₹ {results.grandTotal.toLocaleString()}
              </strong>
            </li>
            <li>Total Installments: {results.totalInstallments}</li>
            <li>
              Per Installment: ₹ {results.perInstallment.toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
