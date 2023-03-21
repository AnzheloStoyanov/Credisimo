const MONTH_IN_SECONDS = 30;
const LOAN_STATUS_PENDING = "Изчакване";
const LOAN_STATUS_APPROVED = "Одобрен";
const LOAN_STATUS_REJECTED = "Отказан";

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36);
  }

class LoanApplication {
  constructor(amount, term) {
    this.id = generateId();
    this.amount = amount;
    this.term = term;
    this.status = LOAN_STATUS_PENDING;
  }
}


class Loan {
  constructor(monthlyPayment, amount, term, interestRate) {
    this.monthlyPayment = monthlyPayment
    this.amount = amount;
    this.term = term;
    this.interestRate = interestRate;
    this.status = LOAN_STATUS_APPROVED;
    this.totalOwnedAmount = monthlyPayment*term
    
    
  }
}


