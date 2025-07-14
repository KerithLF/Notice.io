TEMPLATES = {
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
    "recipient title": "recipient_title",
    "recipient company": "recipient_company",
    "problem date": "problem_date",
    "notice period": "notice_period"
}
