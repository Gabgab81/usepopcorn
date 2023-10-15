// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function ChallengeCurrencyConv() {
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("USD");
  const [amount, setAmount] = useState("");
  const [convAmount, setConvAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const host = `api.frankfurter.app`;

  const handleChangeAmount = (value) => {
    if(!isNaN(value)) {
      value === 0 ? setAmount("") : setAmount(value);
    };
  }

  const handleCurr1 = (curr) => {
    setFromCur(curr);
  }
  const handleCurr2 = (curr) => {
    setToCur(curr);
  }

  useEffect(() => {
    
    const getCurrency = async () => {
      setIsLoading(true)
      console.log(amount, fromCur, toCur)
      const res = await fetch(`https://${host}/latest?amount=${amount}&from=${fromCur}&to=${toCur}`);
      const data = await res.json();
      console.log(data.rates[toCur])
      console.log(data.rates)
      setConvAmount(data.rates[toCur])
      setIsLoading(false)
    }
    if(amount === "" || fromCur === toCur) return setConvAmount(amount)
    getCurrency()
   
  }, [amount, fromCur, toCur])

  return (
    <div>
      <input 
        value={amount} 
        type="text" 
        placeholder="Enter your amount" 
        onChange={(e) => handleChangeAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <SelectCurrency curr={fromCur} onCurr={handleCurr1} disable={isLoading}/>
      <SelectCurrency curr={toCur} onCurr={handleCurr2} disable={isLoading}/>
      <p>{convAmount} {convAmount === "" ? "" : toCur}</p>
    </div>
  );
}

const SelectCurrency = ({curr, onCurr, disable=false}) => {
  return (
    <select 
      value={curr} 
      onChange={(e) => onCurr(e.target.value)}
      disabled={disable}
    >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
  )
}