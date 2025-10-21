import requests
import sys
import json
import base64
from datetime import datetime
import os

class FormSubmissionAPITester:
    def __init__(self, base_url="https://questbot-creator.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_get_submissions_empty(self):
        """Test getting submissions when database is empty"""
        try:
            response = requests.get(f"{self.base_url}/submissions")
            success = response.status_code == 200
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            self.log_test("Get Submissions (Empty)", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("Get Submissions (Empty)", False, str(e))
            return False, []

    def create_test_form_data(self):
        """Create test form data"""
        return {
            "contact_info": {
                "name": "Test User",
                "email": "test@example.com"
            },
            "company_identity": {
                "legal_name": "Test Company Ltd",
                "website": "https://testcompany.com",
                "chatbot_display_name": "TestBot",
                "chatbot_persona": "Friendly and helpful",
                "primary_brand_color": "#FF5733",
                "secondary_brand_color": "#33FF57",
                "accent_color": "#5733FF",
                "background_color": "default",
                "chatbot_size": "default"
            },
            "chatbot_functionality": {
                "business_hours": "Mon-Fri, 9:00 AM - 5:00 PM EST",
                "out_of_hours_response": "We're currently closed. Please leave a message.",
                "conversation_starters": ["How can I help you?", "What services do you need?"]
            },
            "knowledge_base": {
                "knowledge_base_description": "Company FAQ and product information",
                "csv_format_confirmed": True,
                "core_directive": "Option A",
                "fallback_message": None,
                "other_ai_directives": "Be professional and helpful",
                "support_contact": "support@testcompany.com"
            },
            "technical_deployment": {
                "website_platform": "WordPress",
                "website_management": "Internal team",
                "technical_contact_name": "Tech Lead",
                "technical_contact_email": "tech@testcompany.com",
                "deployment_preference": "Self-deployment preferred"
            }
        }

    def create_test_files(self):
        """Create test files for upload"""
        # Create a simple test logo (base64 encoded small image)
        logo_content = b"fake_logo_content_for_testing"
        
        # Create a simple test document
        doc_content = b"fake_document_content_for_testing"
        
        return {
            "logo": ("test_logo.png", logo_content, "image/png"),
            "documents": [
                ("test_doc1.pdf", doc_content, "application/pdf"),
                ("test_doc2.csv", b"question,answer\nWhat is this?,A test", "text/csv")
            ]
        }

    def test_form_submission_without_files(self):
        """Test form submission without file uploads"""
        try:
            form_data = self.create_test_form_data()
            
            # Prepare multipart form data
            data = {
                'contact_info': json.dumps(form_data['contact_info']),
                'company_identity': json.dumps(form_data['company_identity']),
                'chatbot_functionality': json.dumps(form_data['chatbot_functionality']),
                'knowledge_base': json.dumps(form_data['knowledge_base']),
                'technical_deployment': json.dumps(form_data['technical_deployment'])
            }
            
            response = requests.post(f"{self.base_url}/submissions", data=data)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                details = f"Status: {response.status_code}, ID: {response_data.get('id', 'N/A')}"
                return success, response_data.get('id')
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                return False, None
                
            self.log_test("Form Submission (No Files)", success, details)
            
        except Exception as e:
            self.log_test("Form Submission (No Files)", False, str(e))
            return False, None

    def test_form_submission_with_files(self):
        """Test form submission with file uploads"""
        try:
            form_data = self.create_test_form_data()
            test_files = self.create_test_files()
            
            # Prepare multipart form data
            data = {
                'contact_info': json.dumps(form_data['contact_info']),
                'company_identity': json.dumps(form_data['company_identity']),
                'chatbot_functionality': json.dumps(form_data['chatbot_functionality']),
                'knowledge_base': json.dumps(form_data['knowledge_base']),
                'technical_deployment': json.dumps(form_data['technical_deployment'])
            }
            
            files = {
                'logo': test_files['logo'],
                'documents': test_files['documents']
            }
            
            response = requests.post(f"{self.base_url}/submissions", data=data, files=files)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                details = f"Status: {response.status_code}, ID: {response_data.get('id', 'N/A')}"
                submission_id = response_data.get('id')
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                submission_id = None
                
            self.log_test("Form Submission (With Files)", success, details)
            return success, submission_id
            
        except Exception as e:
            self.log_test("Form Submission (With Files)", False, str(e))
            return False, None

    def test_get_specific_submission(self, submission_id):
        """Test getting a specific submission by ID"""
        if not submission_id:
            self.log_test("Get Specific Submission", False, "No submission ID provided")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/submissions/{submission_id}")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Name: {data.get('contact_info', {}).get('name', 'N/A')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                
            self.log_test("Get Specific Submission", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Specific Submission", False, str(e))
            return False

    def test_get_all_submissions(self):
        """Test getting all submissions"""
        try:
            response = requests.get(f"{self.base_url}/submissions")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
                
            self.log_test("Get All Submissions", success, details)
            return success, data if success else []
            
        except Exception as e:
            self.log_test("Get All Submissions", False, str(e))
            return False, []

    def test_invalid_form_submission(self):
        """Test form submission with invalid data"""
        try:
            # Missing required fields
            invalid_data = {
                'contact_info': json.dumps({"name": "Test"}),  # Missing email
                'company_identity': json.dumps({"legal_name": "Test"}),  # Missing required fields
            }
            
            response = requests.post(f"{self.base_url}/submissions", data=invalid_data)
            success = response.status_code == 400 or response.status_code == 422  # Should fail validation
            
            details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            self.log_test("Invalid Form Submission", success, details)
            return success
            
        except Exception as e:
            self.log_test("Invalid Form Submission", False, str(e))
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Backend API Tests...")
        print("=" * 50)
        
        # Test 1: API Root
        self.test_api_root()
        
        # Test 2: Get submissions (should be empty initially)
        self.test_get_submissions_empty()
        
        # Test 3: Form submission without files
        success, submission_id_1 = self.test_form_submission_without_files()
        
        # Test 4: Form submission with files
        success, submission_id_2 = self.test_form_submission_with_files()
        
        # Test 5: Get specific submission
        if submission_id_1:
            self.test_get_specific_submission(submission_id_1)
        
        # Test 6: Get all submissions (should have data now)
        self.test_get_all_submissions()
        
        # Test 7: Invalid form submission
        self.test_invalid_form_submission()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print("⚠️  Some backend tests failed. Check the details above.")
            return False

def main():
    """Main test runner"""
    tester = FormSubmissionAPITester()
    success = tester.run_all_tests()
    
    # Save test results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_tests': tester.tests_run,
            'passed_tests': tester.tests_passed,
            'success_rate': tester.tests_passed / tester.tests_run if tester.tests_run > 0 else 0,
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())