function calculator(dohod, zaem, srok) {
    let loanAmount = zaem 
    let interestRate   
    let numberOfPayments = srok;
    let income = dohod * 12;


    if (income < 20000) {
        interestRate = 10;
    } else if (income > 20000 && income < 50000) {
        interestRate = 8;
    } else if (income > 50000) {
        interestRate = 6;
    }
    let monthlyInterestRate = (interestRate / 100) / 12;
    let compoundInterestFactor = 1;
    for (let i = 0; i < numberOfPayments; i++) {
        compoundInterestFactor *= (1 + monthlyInterestRate);
    }
    let monthlyInstallment = (loanAmount * monthlyInterestRate * compoundInterestFactor) / (compoundInterestFactor - 1);
    monthlyInstallment = monthlyInstallment.toFixed(2)
    return {
        interestRate: interestRate,
        monthlyInstallment: monthlyInstallment

    }

}


 

  