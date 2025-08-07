TEMPLATES = {
<<<<<<< HEAD

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

=======
    "Eviction": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Eviction Notice

Dear {recipient_name},

This legal notice is issued by {sender_name}, residing at {sender_address}, regarding eviction due to a problem arising on {problem_date}.

{summarized_body}

You are hereby instructed to vacate the premises within {notice_period} from the date of this notice. Non-compliance will result in legal proceedings.

Sincerely,

{signature}
{title}
{company}
{sender_address}
""",

    "Payment Recovery": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Payment Recovery Notice

Dear {recipient_name},

This legal notice is issued by {sender_name}, located at {sender_address}, with respect to a payment dispute that arose on {problem_date}.

{summarized_body}

You are requested to make the payment within {notice_period}. Failure to do so may lead to legal action.

Sincerely,

{signature}
{title}
{company}
{sender_address}
""",

    "Employment Termination": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Termination of Employment

Dear {recipient_name},

This notice is being served by {sender_name}, on behalf of {company}, concerning an issue that occurred on {problem_date}.

{summarized_body}

You are hereby notified that your employment is terminated effective immediately. You are required to return all company property and complete exit formalities within {notice_period}.

Sincerely,

{signature}
{title}
{company}
""",

    "Contract Breach": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Breach of Contract Notice

Dear {recipient_name},

This legal notice is issued by {sender_name} regarding a breach of contract identified on {problem_date}.

{summarized_body}

You are hereby directed to remedy the breach within {notice_period}, failing which legal action may be initiated.

Sincerely,

{signature}
{title}
{company}
""",

    "Loan Default": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Loan Default Notice

Dear {recipient_name},

This notice concerns the default in loan repayment which became evident on {problem_date}.

{summarized_body}

You are hereby required to clear the dues within {notice_period}. If ignored, the lender reserves the right to take legal recourse.

Sincerely,

{signature}
{title}
{company}
""",

    "Cheque Bounce": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Cheque Bounce / Dishonour of Cheque Notice

Dear {recipient_name},

This legal notice is issued by {sender_name} with reference to a dishonoured cheque dated {problem_date}.

{summarized_body}

You are hereby demanded to make good the payment within {notice_period}, failing which legal proceedings under applicable law will be initiated.

Sincerely,

{signature}
{title}
{company}
""",

    "Consumer Complaint": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Consumer Complaint Notice

Dear {recipient_name},

This legal notice is issued by {sender_name}, residing at {sender_address}, in regard to a complaint related to {problem_date}.

{summarized_body}

You are hereby called upon to resolve the issue or provide compensation within {notice_period}, failing which I shall be constrained to approach the Consumer Forum.

Sincerely,

{signature}
{title}
{company}
{sender_address}
""",

    "Defamation or Harassment": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Defamation / Harassment Notice

Dear {recipient_name},

This legal notice is issued by {sender_name} concerning incidents that occurred on {problem_date} which have caused harm and distress.

{summarized_body}

You are hereby instructed to cease and desist such actions and provide a written apology within {notice_period}. Non-compliance will result in legal proceedings.

Sincerely,

{signature}
{title}
{company}
{sender_address}
""",

    "Lease Termination": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Lease Termination Notice

Dear {recipient_name},

This legal notice is issued by {sender_name}, residing at {sender_address}, to inform you of the termination of lease agreement dated {problem_date}.

{summarized_body}

You are required to vacate and hand over possession within {notice_period}, failing which legal steps will be taken.

Sincerely,

{signature}
{title}
{company}
{sender_address}
""",

    "Legal Demand": """
Date: {issue_date}

To,
{recipient_name}
{recipient_address}

Subject: Legal Demand Notice

Dear {recipient_name},

This legal notice is issued by {sender_name}, located at {sender_address}, concerning a legal demand arising on {problem_date}.

{summarized_body}

You are hereby instructed to comply with the demand within {notice_period}, failing which I shall initiate legal action at your cost and risk.

Sincerely,

{signature}
{title}
{company}
{sender_address}
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
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
<<<<<<< HEAD
=======
    "recipient title": "recipient_title",
    "recipient company": "recipient_company",
    "problem date": "problem_date",
    "notice period": "notice_period"
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
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
<<<<<<< HEAD
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
=======
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
    ]
}
