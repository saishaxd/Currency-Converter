const fromSelect= document.getElementById("from-currency");
const toSelect= document.getElementById("to-currency");

const fromFlag= document.getElementById("from-flag");
const toFlag= document.getElementById("to-flag");

const fromAmount= document.getElementById("from-amount");
const toAmount= document.getElementById("to-amount");

const finalText= document.getElementById("final-text");
const swapBtn= document.querySelector("i");

fromAmount.addEventListener("input", convertCurrency);

//dropdowns
for (let code in countryList){
    let option1= document.createElement("option");
    option1.value= code;
    option1.innerText= code;
    fromSelect.appendChild(option1);

    let option2= document.createElement("option");
    option2.value= code;
    option2.innerText= code;
    toSelect.appendChild(option2);
}

//default
fromSelect.value= "INR";
toSelect.value= "USD";

//update flag
function updateFlag(selectElement, imgElement){
    let currencyCode= selectElement.value;
    let countryCode= countryList[currencyCode];

    imgElement.src= `https://flagsapi.com/${countryCode}/flat/64.png`;
}

//conversion
async function convertCurrency(){

    let amount = Number(fromAmount.value);

    const fromCurr= fromSelect.value;
    const toCurr= toSelect.value;

    try{
        const URL= `https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${fromCurr}&symbols=${toCurr}`;

        let response= await fetch(URL);

        if(!response.ok){
            throw new Error("Conversion Failed.");
        }

        let data= await response.json();

        let converted= data.rates[toCurr];

        // fromAmount.value= amount.toFixed(2);
        toAmount.innerText= converted;

        let rateURL= `https://api.frankfurter.dev/v1/latest?base=${fromCurr}&symbols=${toCurr}`;

        let rateResponse= await fetch(rateURL);

        let rateData= await rateResponse.json();

        finalText.innerText= `1 ${fromCurr} = ${rateData.rates[toCurr]} ${toCurr}`;

    }catch(error){
        finalText.innerText= "Error fetching rates.";
        console.log(error);
    }
}

//dropdown change
fromSelect.addEventListener("change", () => {
    updateFlag(fromSelect, fromFlag);
    convertCurrency();
});

toSelect.addEventListener("change", () => {
    updateFlag(toSelect, toFlag);
    convertCurrency();
});

//swap
swapBtn.addEventListener("click", () => {
    let temp= fromSelect.value;
    fromSelect.value= toSelect.value;
    toSelect.value= temp;

    updateFlag(fromSelect, fromFlag);
    updateFlag(toSelect, toFlag);

    convertCurrency();
});
