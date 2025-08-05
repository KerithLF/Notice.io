TEMPLATES = {

    "Cheque Bounce": """
From :
Sri.{sender_name},
S/o.{sender_father_name},
Address: {sender_address}

To :
Sri.{recipient_name},
S/o.{recipient_father_name},
Address: {recipient_address}

Dear Sir/Ma’am,

{council_contributor_line}

{incidents}

{para3_num}. That you had issued the said cheque despite your knowledge that you had no funds in your account. You have cheated the said firm and it seems that you do not want to pay the amount of Rs.{amount} to the payee. 

{para4_num}. Through this notice you are called upon to pay the aforesaid payee an amount of Rs.{amount} Within 15 days of the receipt of this notice failing which the aforementioned party shall be compelled to initiate recovery proceedings against you in the court of law and shall also initiate proceedings under Section 138 of the Negotiable instruments Act, (1881) and then you shall also be liable for the cost of the proceedings. 


Date : {issue_date}
Place : {sender_address}

{right_faithfully}

"""
}


PLACEHOLDER_ALIASES = {
    "your name": "sender_name",
    "your title": "title",
    "company name": "company",
    "insert date": "issue_date",
    "insert name": "sender_name",
    "insert address": "sender_address",
    "insert signature": "signature",
}





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
    ],
    "Cheque Bounce": [
        {"name": "drawer_name", "label": "Drawer Name"},
        {"name": "cheque_number", "label": "Cheque Number"},
        {"name": "cheque_date", "label": "Cheque Date"},
        {"name": "bank_name", "label": "Bank Name"},
        {"name": "amount", "label": "Cheque Amount"},
    ],
    "Consumer Complaint": [
        {"name": "consumer_name", "label": "Consumer Name"},
        {"name": "product_or_service", "label": "Product/Service"},
        {"name": "purchase_date", "label": "Purchase Date"},
        {"name": "complaint_details", "label": "Complaint Details"},
    ],
    "Defamation": [
        {"name": "accused_name", "label": "Accused Person/Entity"},
        {"name": "incident_date", "label": "Incident Date"},
        {"name": "defamatory_statement", "label": "Defamatory Statement"},
        {"name": "damages_claimed", "label": "Damages Claimed"},
    ],
    "Lease Termination": [
        {"name": "landlord_name", "label": "Landlord Name"},
        {"name": "tenant_name", "label": "Tenant Name"},
        {"name": "lease_start_date", "label": "Lease Start Date"},
        {"name": "termination_reason", "label": "Reason for Termination"},
    ],
    "Intellectual Property Infringement": [
        {"name": "ip_type", "label": "Type of IP (Patent/Trademark/Copyright)"},
        {"name": "registration_number", "label": "IP Registration Number"},
        {"name": "infringement_details", "label": "Details of Infringement"},
        {"name": "estimated_damages", "label": "Estimated Damages"},
    ],
    "Construction Delay": [
        {"name": "project_name", "label": "Project Name"},
        {"name": "original_deadline", "label": "Original Completion Deadline"},
        {"name": "current_status", "label": "Current Project Status"},
        {"name": "delay_impact", "label": "Impact of Delay"},
    ],
    "Property Damage": [
        {"name": "property_type", "label": "Type of Property"},
        {"name": "damage_description", "label": "Description of Damage"},
        {"name": "damage_date", "label": "Date of Damage"},
        {"name": "repair_estimate", "label": "Estimated Repair Cost"},
    ],
    "Workplace Harassment": [
        {"name": "complainant_name", "label": "Complainant Name"},
        {"name": "incident_details", "label": "Incident Details"},
        {"name": "witnesses", "label": "Witness Names (if any)"},
        {"name": "previous_complaints", "label": "Previous Complaints Filed"},
    ],
    "Environmental Violation": [
        {"name": "violation_type", "label": "Type of Environmental Violation"},
        {"name": "affected_area", "label": "Affected Area/Location"},
        {"name": "impact_assessment", "label": "Environmental Impact Assessment"},
        {"name": "regulatory_body", "label": "Relevant Regulatory Body"},
    ]
}
