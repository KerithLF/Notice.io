from datetime import datetime, timedelta
from typing import List, Dict, Optional

class NoticeWarningValidator:
    
    @staticmethod
    def validate_cheque_bounce_warnings(request_data: dict) -> List[Dict]:
        """Validate cheque bounce specific warnings"""
        warnings = []
        
        # Extract relevant dates
        issue_date = request_data.get('issue_date')
        incidents = request_data.get('incidents', [])
        
        # Find cheque-related incident
        cheque_incident = None
        for incident in incidents:
            if 'cheque' in incident.get('description', '').lower():
                cheque_incident = incident
                break
        
        if not cheque_incident:
            return warnings
            
        # Warning 1: Delay in encashing
        if NoticeWarningValidator._check_encashing_delay(cheque_incident, issue_date):
            warnings.append({
                'type': 'encashing_delay',
                'title': 'Delay in Encashing Warning',
                'message': f"Dear {request_data.get('sender_name', '[Client Name]')}, from the information provided, there is a delay in encashing the cheque. Legal action can only be initiated when the cheque is encashed within 3 months from issue date or validity period, whichever is lesser.",
                'severity': 'high'
            })
        
        # Warning 2: Delay in communicating dishonor
        if NoticeWarningValidator._check_dishonor_delay(incidents, issue_date):
            warnings.append({
                'type': 'dishonor_delay',
                'title': 'Dishonor Communication Delay',
                'message': f"Dear {request_data.get('sender_name', '[Client Name]')}, there is a delay in informing the drawer about cheque dishonor. Notice must be issued within 30 days. Contact your lawyer for guidance.",
                'severity': 'high'
            })
        
        # Warning 3: Early legal notice
        if NoticeWarningValidator._check_early_notice(incidents, issue_date):
            warnings.append({
                'type': 'early_notice',
                'title': 'Premature Legal Action Warning',
                'message': f"Dear {request_data.get('sender_name', '[Client Name]')}, you cannot initiate legal proceedings before the 15-day notice period expires. Wait for the mandatory period before taking action.",
                'severity': 'medium'
            })
            
        return warnings
    
    @staticmethod
    def _check_encashing_delay(cheque_incident: dict, issue_date: str) -> bool:
        """Check if there's delay in encashing cheque"""
        try:
            cheque_date_str = cheque_incident.get('date', '')
            if not cheque_date_str:
                return False
                
            cheque_date = datetime.strptime(cheque_date_str, '%Y-%m-%d')
            current_date = datetime.now()
            
            # Check if more than 3 months have passed
            three_months_later = cheque_date + timedelta(days=90)
            return current_date > three_months_later
            
        except ValueError:
            return False
    
    @staticmethod
    def _check_dishonor_delay(incidents: list, issue_date: str) -> bool:
        """Check if dishonor communication is delayed"""
        try:
            dishonor_date = None
            for incident in incidents:
                if 'dishonor' in incident.get('description', '').lower():
                    dishonor_date = datetime.strptime(incident.get('date', ''), '%Y-%m-%d')
                    break
            
            if not dishonor_date:
                return False
                
            current_date = datetime.now()
            thirty_days_later = dishonor_date + timedelta(days=30)
            return current_date > thirty_days_later
            
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def _check_early_notice(incidents: list, issue_date: str) -> bool:
        """Check if legal notice is being issued too early"""
        try:
            notice_date = None
            for incident in incidents:
                if 'notice' in incident.get('description', '').lower():
                    notice_date = datetime.strptime(incident.get('date', ''), '%Y-%m-%d')
                    break
            
            if not notice_date:
                return False
                
            current_date = datetime.now()
            fifteen_days_later = notice_date + timedelta(days=15)
            return current_date < fifteen_days_later
            
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def check_duplicate_case(sender_name: str, recipient_name: str) -> bool:
        """Check for duplicate cases - implement with your database"""
        # This would connect to your database to check existing cases
        # For now, returning False as placeholder
        return False
    
    @staticmethod
    def validate_party_standing(sender_details: dict) -> bool:
        """Validate if sender has legal standing"""
        # Implement logic to check if sender is authorized party
        # This might involve checking role, authorization documents, etc.
        return True  # Placeholder
