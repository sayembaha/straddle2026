import requests
from bs4 import BeautifulSoup
import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
from datetime import datetime

# Your configuration - EDIT THESE VALUES
CONFIG = {
    "target_sites": [
        "https://www.euronews.com/tag/mergers-and-acquisitions",  
        "https://www.ft.com/mergers-acquisitions",
    ],
    "keywords": [
        "M&A", "merger", "acquisition", "board resignation", 
        "law firm hiring", "strategic review", "takeover",
        "bid", "acquires", "expansion"
    ],
    "check_interval_days": 1,  # How often to check (in days)
    "email_settings": {
        "sender_email": "sayembaha@gmail.com",  # Your Gmail
        "sender_password": "zaq200900275",  # Google App Password (see instructions)
        "receiver_emails": ["sayembaha@gmail.com", "sayembaha99@gmail.com"]  # Who to send to
    }
}

def scrape_site(url, keywords):
    """Scrape a website for deal-related keywords"""
    try:
        print(f"Checking {url}...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        text = ' '.join(line for line in lines if line)
        
        findings = []
        for keyword in keywords:
            if keyword.lower() in text.lower():
                # Find the context around the keyword
                start_index = max(0, text.lower().find(keyword.lower()) - 100)
                end_index = min(len(text), start_index + 300)
                snippet = text[start_index:end_index]
                
                findings.append({
                    "site": url,
                    "keyword": keyword,
                    "snippet": snippet,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                
        return findings
        
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return []

def send_email(subject, body, config):
    """Send email with findings"""
    try:
        msg = MIMEMultipart()
        msg['From'] = config['email_settings']['sender_email']
        msg['To'] = ", ".join(config['email_settings']['receiver_emails'])
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(config['email_settings']['sender_email'], 
                     config['email_settings']['sender_password'])
        text = msg.as_string()
        server.sendmail(config['email_settings']['sender_email'], 
                        config['email_settings']['receiver_emails'], text)
        server.quit()
        
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

def main():
    """Main function to run the scraper"""
    print("Starting deal rumor scraper...")
    
    all_findings = []
    for site in CONFIG['target_sites']:
        findings = scrape_site(site, CONFIG['keywords'])
        all_findings.extend(findings)
        time.sleep(2)  # Be polite to websites
    
    if all_findings:
        print(f"Found {len(all_findings)} potential deal signals!")
        
        # Create HTML email content
        email_subject = "Deal Rumor Digest - " + datetime.now().strftime("%Y-%m-%d")
        email_body = "<h2>Deal Rumor Digest</h2>"
        email_body += f"<p>Date: {datetime.now().strftime('%Y-%m-%d')}</p>"
        email_body += f"<p>Found {len(all_findings)} potential deal signals:</p>"
        
        for finding in all_findings:
            email_body += f"""
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <h3>Site: {finding['site']}</h3>
                <p><strong>Keyword:</strong> {finding['keyword']}</p>
                <p><strong>Snippet:</strong> {finding['snippet']}...</p>
                <p><em>Found at: {finding['timestamp']}</em></p>
            </div>
            """
        
        # Send email
        send_email(email_subject, email_body, CONFIG)
        
        # Save to CSV for records
        df = pd.DataFrame(all_findings)
        df.to_csv('deal_rumors.csv', index=False)
        print("Results saved to deal_rumors.csv")
    else:
        print("No deal signals found today.")

if __name__ == "__main__":
    main()
