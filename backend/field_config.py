LITIGATION_FIELDS = {
    "Eviction": [
        {"name": "tenant_name", "label": "Tenant Name"},
        {"name": "property_address", "label": "Property Address"},
        {"name": "security_deposit", "label": "Security Deposit Amount"},
        {"name": "lease_end_date", "label": "Lease End Date"},
    ],
    "Payment Recovery": [
        {"name": "debtor_name", "label": "Debtor Name"},
        {"name": "invoice_number", "label": "Invoice Number"},
        {"name": "amount_due", "label": "Amount Due"},
        {"name": "due_date", "label": "Due Date"},
    ],
    "Employment Termination": [
        {"name": "employee_name", "label": "Employee Name"},
        {"name": "employee_position", "label": "Employee Position"},
        {"name": "termination_date", "label": "Termination Date"},
        {"name": "reason", "label": "Reason for Termination"},
    ],
    "Contract Breach": [
        {"name": "contract_number", "label": "Contract Number"},
        {"name": "party_involved", "label": "Party Involved"},
        {"name": "breach_details", "label": "Breach Details"},
        {"name": "damages_amount", "label": "Damages Amount"},
    ],
    "Loan Default": [
        {"name": "borrower_name", "label": "Borrower Name"},
        {"name": "loan_account_number", "label": "Loan Account Number"},
        {"name": "outstanding_amount", "label": "Outstanding Amount"},
        {"name": "default_date", "label": "Default Date"},
    ]
}
