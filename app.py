import pandas as pd

# Define a function to categorize issues based on keywords
def categorize_issue(issue_text):
    issue_text = str(issue_text).lower()  # Ensure text is lowercase

    # Critical issues (safety hazards, major failures)
    critical_keywords = ["fire", "explosion", "structural damage", "severe", "electrocution", "gas leak", "hazard", "no power", "collapse"]
    if any(word in issue_text for word in critical_keywords):
        return "Critical"
    
    # High issues (major functionality problems)
    high_keywords = ["power outage", "no water", "severe leak", "major fault", "frequent failure", "short circuit", "security breach", "flooding"]
    if any(word in issue_text for word in high_keywords):
        return "High"

    # Medium issues (moderate disruptions)
    medium_keywords = ["flickering", "intermittent", "slow", "minor leak", "temperature fluctuation", "unstable", "clogging", "low pressure"]
    if any(word in issue_text for word in medium_keywords):
        return "Medium"

    # Low issues (minor inconveniences, aesthetic issues)
    low_keywords = ["paint peeling", "small crack", "dirt", "stains", "needs cleaning", "minor fault", "adjustment needed"]
    if any(word in issue_text for word in low_keywords):
        return "Low"

    # Default to Medium if not explicitly categorized
    return "Medium"

# User input issue
user_issue = input("Enter an issue description: ")

# Get the predicted severity
predicted_severity = categorize_issue(user_issue)

# Display the result
print(f"Issue: {user_issue}")
print(f"Predicted Severity: {predicted_severity}")