# 📜 Datacendia Software Licensing Framework

**Your IP. Your Terms. Your Protection.**

Complete licensing documentation for Datacendia as a commercial SaaS product.

---

## What You Need

| Document | Purpose | When Used |
|----------|---------|-----------|
| **Master SaaS Agreement (MSA)** | Main contract governing the relationship | All customers |
| **Terms of Service (ToS)** | Online/clickwrap agreement | Self-serve signups |
| **End User License Agreement (EULA)** | Software usage rights | All users |
| **Data Processing Agreement (DPA)** | GDPR/privacy compliance | All customers |
| **Service Level Agreement (SLA)** | Uptime/support commitments | Pro/Enterprise |
| **Acceptable Use Policy (AUP)** | What users can/can't do | All users |
| **Order Form** | Specific deal terms | Sales-led deals |

---

# Document 1: Master SaaS Agreement (MSA)

```
═══════════════════════════════════════════════════════════════════════════
                    DATACENDIA MASTER SAAS AGREEMENT
═══════════════════════════════════════════════════════════════════════════

This Master SaaS Agreement ("Agreement") is entered into as of the date 
of the last signature below ("Effective Date") by and between:

DATACENDIA, INC., a Delaware corporation ("Datacendia" or "Provider")
and
The entity identified on the Order Form ("Customer")

═══════════════════════════════════════════════════════════════════════════
                         1. DEFINITIONS
═══════════════════════════════════════════════════════════════════════════

1.1 "Authorized Users" means Customer's employees, contractors, and agents 
    who are authorized by Customer to access and use the Services.

1.2 "Council" means Datacendia's AI-powered decision intelligence system 
    comprising multiple AI agents that provide analysis and recommendations.

1.3 "Customer Data" means all data, information, and content that Customer 
    or Authorized Users input, upload, or submit to the Services.

1.4 "Deliberation" means a single instance of engaging the Council for 
    decision analysis and recommendations.

1.5 "Documentation" means the user guides, online help, and other 
    documentation provided by Datacendia for the Services.

1.6 "Order Form" means the ordering document specifying the Services, 
    fees, subscription term, and other details.

1.7 "Services" means the Datacendia decision intelligence platform and 
    related services as specified in the Order Form.

1.8 "Subscription Term" means the period during which Customer has paid 
    access to the Services as specified in the Order Form.

═══════════════════════════════════════════════════════════════════════════
                    2. SERVICES AND LICENSE GRANT
═══════════════════════════════════════════════════════════════════════════

2.1 LICENSE GRANT
Subject to the terms of this Agreement and payment of applicable fees, 
Datacendia grants Customer a limited, non-exclusive, non-transferable, 
non-sublicensable license during the Subscription Term to:

    (a) Access and use the Services for Customer's internal business 
        purposes;
    (b) Allow Authorized Users to access and use the Services;
    (c) Use the Documentation in connection with the Services.

2.2 LICENSE RESTRICTIONS
Customer shall not, and shall not permit any third party to:

    (a) Copy, modify, or create derivative works of the Services;
    (b) Reverse engineer, disassemble, or decompile the Services;
    (c) Sell, resell, license, sublicense, or distribute the Services;
    (d) Use the Services to build a competitive product or service;
    (e) Use the Services to train AI/ML models for commercial purposes;
    (f) Remove or alter any proprietary notices on the Services;
    (g) Access the Services through automated means (bots, scrapers);
    (h) Circumvent any access controls or usage limits;
    (i) Use the Services in violation of applicable laws;
    (j) Share login credentials or exceed Authorized User limits.

2.3 USAGE LIMITS
Customer's use of the Services is subject to the usage limits specified 
in the Order Form (e.g., number of users, deliberations, storage). If 
Customer exceeds usage limits, Datacendia may:

    (a) Charge overage fees as specified in the Order Form;
    (b) Require Customer to upgrade to a higher tier;
    (c) Throttle or suspend access until usage is reduced.

2.4 SERVICE MODIFICATIONS
Datacendia may modify the Services from time to time. Datacendia will 
provide reasonable notice of material changes. If a modification 
materially degrades the Services, Customer may terminate the affected 
Order Form within 30 days of the change.

2.5 DEPLOYMENT MODELS
The Services may be deployed in the following configurations as 
specified in the Order Form:

    (a) Cloud-Hosted (SaaS): Datacendia hosts and manages the Services 
        in the region specified in the Order Form;
    (b) Self-Hosted (On-Premise): Customer deploys the Services on 
        Customer-controlled infrastructure using Datacendia-provided 
        container images and Helm charts;
    (c) Sovereign (Air-Gapped): Customer deploys the Services in a 
        network-isolated environment with no outbound connectivity to 
        Datacendia or third-party cloud services.

2.6 OFFLINE LICENSING
For Self-Hosted and Sovereign deployments, licensing is enforced via 
cryptographically signed license files (".dcl" format):

    (a) Datacendia generates a license file signed with Ed25519 
        digital signatures and delivers it to Customer via secure 
        channel;
    (b) The license file encodes: organization, tier, enabled pillars, 
        seat count, expiration date, and optional hardware fingerprint;
    (c) Customer installs the license file on the deployed system; 
        the Services verify the signature locally using the embedded 
        public key — no network connectivity to Datacendia is required;
    (d) Hardware-bound licenses, when specified in the Order Form, 
        restrict the license to a specific machine fingerprint;
    (e) License renewal requires delivery of a new .dcl file before 
        expiration; Datacendia will provide renewal files at least 
        30 days before expiration upon receipt of applicable fees.

═══════════════════════════════════════════════════════════════════════════
                      3. CUSTOMER OBLIGATIONS
═══════════════════════════════════════════════════════════════════════════

3.1 ACCOUNT SECURITY
Customer is responsible for:
    (a) Maintaining the security of login credentials;
    (b) All activities under Customer's account;
    (c) Promptly notifying Datacendia of any unauthorized access;
    (d) Ensuring Authorized Users comply with this Agreement.

3.2 CUSTOMER DATA
Customer is solely responsible for:
    (a) The accuracy, quality, and legality of Customer Data;
    (b) Obtaining necessary consents for Customer Data;
    (c) Ensuring Customer Data does not violate third-party rights;
    (d) Maintaining backups of Customer Data.

3.3 COMPLIANCE
Customer shall:
    (a) Comply with all applicable laws and regulations;
    (b) Not use the Services for illegal purposes;
    (c) Comply with the Acceptable Use Policy;
    (d) Cooperate with Datacendia's reasonable security measures.

═══════════════════════════════════════════════════════════════════════════
                    4. FEES AND PAYMENT
═══════════════════════════════════════════════════════════════════════════

4.1 FEES
Customer shall pay the fees specified in the Order Form. All fees are:
    (a) Due in advance for the Subscription Term;
    (b) Non-refundable except as expressly stated;
    (c) Exclusive of taxes (Customer pays all applicable taxes).

4.2 PAYMENT TERMS
    (a) Payment is due within 30 days of invoice date;
    (b) Late payments accrue interest at 1.5% per month;
    (c) Customer pays reasonable collection costs for late payments.

4.3 PRICE CHANGES
Datacendia may increase fees upon renewal by providing 60 days' notice. 
Price increases are effective at the start of the next Subscription Term.

4.4 SUSPENSION FOR NON-PAYMENT
Datacendia may suspend access if payment is more than 30 days overdue, 
after providing 10 days' written notice. Suspension does not relieve 
Customer of payment obligations.

═══════════════════════════════════════════════════════════════════════════
                    5. INTELLECTUAL PROPERTY
═══════════════════════════════════════════════════════════════════════════

5.1 DATACENDIA IP
Datacendia and its licensors own all rights in the Services, including:
    (a) The Council AI system and all AI agents;
    (b) All algorithms, models, and methodologies;
    (c) The platform, interface, and functionality;
    (d) All Documentation and materials;
    (e) All improvements and derivatives thereof.

Customer receives only the limited license granted herein. No other 
rights are granted by implication, estoppel, or otherwise.

5.2 CUSTOMER DATA
Customer retains all rights in Customer Data. Customer grants Datacendia 
a limited license to use Customer Data solely to:
    (a) Provide the Services;
    (b) Improve the Services (in aggregated, anonymized form);
    (c) Comply with legal obligations.

5.3 FEEDBACK
If Customer provides feedback, suggestions, or ideas ("Feedback"), 
Datacendia may use such Feedback without restriction or compensation. 
Customer assigns all rights in Feedback to Datacendia.

5.4 USAGE DATA
Datacendia may collect and use aggregated, anonymized usage data to:
    (a) Improve the Services;
    (b) Create benchmarks and analytics;
    (c) Develop new features and products.

═══════════════════════════════════════════════════════════════════════════
                    6. CONFIDENTIALITY
═══════════════════════════════════════════════════════════════════════════

6.1 DEFINITION
"Confidential Information" means non-public information disclosed by 
either party, including:
    (a) Business plans, strategies, and financial information;
    (b) Customer Data;
    (c) Technical information about the Services;
    (d) Pricing and contract terms.

6.2 OBLIGATIONS
The receiving party shall:
    (a) Protect Confidential Information with reasonable care;
    (b) Use Confidential Information only for purposes of this Agreement;
    (c) Not disclose Confidential Information except to those with need 
        to know who are bound by confidentiality obligations.

6.3 EXCEPTIONS
Confidential Information excludes information that:
    (a) Is or becomes publicly available without breach;
    (b) Was known to the receiving party before disclosure;
    (c) Is independently developed by the receiving party;
    (d) Is received from a third party without restriction.

6.4 REQUIRED DISCLOSURE
A party may disclose Confidential Information if required by law, 
provided it gives reasonable notice (if permitted) and cooperates 
with efforts to limit disclosure.

═══════════════════════════════════════════════════════════════════════════
                    7. DATA PROTECTION
═══════════════════════════════════════════════════════════════════════════

7.1 DATA PROCESSING
Datacendia will process Customer Data in accordance with:
    (a) This Agreement;
    (b) The Data Processing Agreement (DPA);
    (c) Datacendia's Privacy Policy;
    (d) Applicable data protection laws.

7.2 SECURITY
Datacendia maintains administrative, technical, and physical safeguards 
designed to protect Customer Data, including:
    (a) Encryption in transit and at rest;
    (b) Access controls and authentication;
    (c) Regular security assessments;
    (d) Incident response procedures.

7.3 DATA LOCATION
    (a) Cloud-Hosted: Customer Data is stored in the region specified 
        in the Order Form. Datacendia will not transfer Customer Data 
        to other regions without Customer consent, except as required 
        for Service operation.
    (b) Self-Hosted: Customer Data resides entirely on Customer-
        controlled infrastructure. Datacendia does not access, store, 
        or process Customer Data except as necessary for support 
        requests explicitly initiated by Customer.
    (c) Sovereign (Air-Gapped): Customer Data never leaves Customer's 
        network. Datacendia has zero access to Customer Data. All AI 
        processing occurs locally via Customer-provisioned models.

7.4 SUBPROCESSORS
Datacendia may use subprocessors to provide the Cloud-Hosted Services. 
For Self-Hosted and Sovereign deployments, no subprocessors are used 
unless Customer explicitly enables third-party integrations.

A list of subprocessors is available at datacendia.com/subprocessors. 
Datacendia will provide 30 days' notice of new subprocessors.

7.5 ENTERPRISE CONNECTORS
The Services may integrate with third-party enterprise systems via 
built-in connectors (Salesforce, ServiceNow, Jira, Slack, Microsoft 
Teams, SAP, Oracle, Workday, HubSpot, GitHub). When Customer enables 
a connector:
    (a) Customer authorizes data flow between the Services and the 
        third-party system using Customer-provided credentials;
    (b) Datacendia acts as a data processor for data transiting 
        through connectors in Cloud-Hosted mode;
    (c) In Self-Hosted and Sovereign modes, connector traffic remains 
        entirely within Customer's network;
    (d) Customer is responsible for compliance with the third-party 
        system's terms of service.

═══════════════════════════════════════════════════════════════════════════
                    8. WARRANTIES AND DISCLAIMERS
═══════════════════════════════════════════════════════════════════════════

8.1 MUTUAL WARRANTIES
Each party warrants that:
    (a) It has authority to enter into this Agreement;
    (b) It will comply with applicable laws;
    (c) Its performance will not violate any third-party rights.

8.2 DATACENDIA WARRANTIES
Datacendia warrants that:
    (a) The Services will substantially conform to the Documentation;
    (b) The Services will be provided with reasonable skill and care;
    (c) Datacendia has rights to grant the licenses herein.

8.3 DISCLAIMER
EXCEPT AS EXPRESSLY SET FORTH HEREIN, THE SERVICES ARE PROVIDED "AS IS." 
DATACENDIA DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
NON-INFRINGEMENT.

8.4 AI DISCLAIMER
THE COUNCIL PROVIDES RECOMMENDATIONS BASED ON AI ANALYSIS. DATACENDIA 
DOES NOT WARRANT THAT RECOMMENDATIONS WILL BE ACCURATE, COMPLETE, OR 
SUITABLE FOR ANY PURPOSE. CUSTOMER IS SOLELY RESPONSIBLE FOR ALL 
DECISIONS MADE USING THE SERVICES. THE SERVICES DO NOT CONSTITUTE 
PROFESSIONAL, LEGAL, FINANCIAL, OR MEDICAL ADVICE.

═══════════════════════════════════════════════════════════════════════════
                    9. LIMITATION OF LIABILITY
═══════════════════════════════════════════════════════════════════════════

9.1 EXCLUSION OF DAMAGES
NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, 
DATA, OR BUSINESS OPPORTUNITIES, REGARDLESS OF THE THEORY OF LIABILITY.

9.2 LIABILITY CAP
EXCEPT FOR EXCLUDED CLAIMS, EACH PARTY'S TOTAL LIABILITY SHALL NOT 
EXCEED THE FEES PAID OR PAYABLE BY CUSTOMER IN THE 12 MONTHS PRECEDING 
THE CLAIM.

9.3 EXCLUDED CLAIMS
The limitations in this Section do not apply to:
    (a) Breach of license restrictions (Section 2.2);
    (b) Breach of confidentiality (Section 6);
    (c) Customer's payment obligations;
    (d) Either party's indemnification obligations;
    (e) Liability that cannot be limited by law.

═══════════════════════════════════════════════════════════════════════════
                    10. INDEMNIFICATION
═══════════════════════════════════════════════════════════════════════════

10.1 DATACENDIA INDEMNIFICATION
Datacendia will defend, indemnify, and hold harmless Customer from 
third-party claims alleging that the Services infringe intellectual 
property rights, provided Customer:
    (a) Promptly notifies Datacendia of the claim;
    (b) Gives Datacendia sole control of defense and settlement;
    (c) Provides reasonable cooperation.

10.2 INFRINGEMENT REMEDIES
If the Services are found infringing or Datacendia believes they may be, 
Datacendia may, at its option:
    (a) Obtain the right to continue providing the Services;
    (b) Modify the Services to be non-infringing;
    (c) Replace the Services with a non-infringing alternative;
    (d) Terminate the affected Services and refund prepaid fees.

10.3 EXCLUSIONS
Datacendia has no obligation for claims arising from:
    (a) Modifications made by Customer;
    (b) Combination with non-Datacendia products;
    (c) Customer's failure to use updated versions;
    (d) Customer Data or Customer's use of the Services.

10.4 CUSTOMER INDEMNIFICATION
Customer will defend, indemnify, and hold harmless Datacendia from 
third-party claims arising from:
    (a) Customer Data;
    (b) Customer's breach of this Agreement;
    (c) Customer's violation of applicable laws;
    (d) Customer's use of the Services.

═══════════════════════════════════════════════════════════════════════════
                    11. TERM AND TERMINATION
═══════════════════════════════════════════════════════════════════════════

11.1 TERM
This Agreement begins on the Effective Date and continues until all 
Order Forms have expired or been terminated.

11.2 SUBSCRIPTION TERM
Each Order Form has the Subscription Term specified therein. Subscription 
Terms automatically renew for successive periods equal to the initial 
term, unless either party gives 60 days' written notice of non-renewal.

11.3 TERMINATION FOR CAUSE
Either party may terminate this Agreement or an Order Form if the other 
party:
    (a) Materially breaches and fails to cure within 30 days of notice;
    (b) Becomes insolvent or files for bankruptcy;
    (c) Ceases business operations.

11.4 TERMINATION FOR CONVENIENCE
Customer may terminate for convenience upon 30 days' written notice, 
but no refund will be provided for the remaining Subscription Term.

11.5 EFFECT OF TERMINATION
Upon termination:
    (a) All licenses immediately terminate;
    (b) Customer must cease using the Services;
    (c) Each party must return Confidential Information;
    (d) Customer may request data export for 30 days;
    (e) Outstanding fees become immediately due.

11.6 SURVIVAL
Sections 4 (Fees), 5 (IP), 6 (Confidentiality), 8.3-8.4 (Disclaimers), 
9 (Liability), 10 (Indemnification), and 12 (General) survive termination.

═══════════════════════════════════════════════════════════════════════════
                    12. GENERAL PROVISIONS
═══════════════════════════════════════════════════════════════════════════

12.1 GOVERNING LAW
This Agreement is governed by the laws of the State of Delaware, without 
regard to conflict of law principles.

12.2 DISPUTE RESOLUTION
Disputes shall be resolved by binding arbitration under AAA Commercial 
Arbitration Rules in Wilmington, Delaware. The arbitrator may award 
injunctive relief. Each party may seek injunctive relief in court.

12.3 NOTICES
Notices must be in writing and sent to the addresses in the Order Form. 
Notices are effective upon receipt.

12.4 ASSIGNMENT
Neither party may assign this Agreement without consent, except to an 
affiliate or in connection with a merger, acquisition, or sale of 
substantially all assets.

12.5 FORCE MAJEURE
Neither party is liable for delays caused by events beyond reasonable 
control, including natural disasters, war, terrorism, strikes, or 
government actions.

12.6 ENTIRE AGREEMENT
This Agreement, including all Order Forms and referenced policies, 
constitutes the entire agreement and supersedes all prior agreements.

12.7 AMENDMENTS
Amendments must be in writing signed by both parties, except that 
Datacendia may update policies upon 30 days' notice.

12.8 SEVERABILITY
If any provision is found unenforceable, the remaining provisions 
continue in full force.

12.9 WAIVER
Failure to enforce any right is not a waiver of that right.

12.10 INDEPENDENT CONTRACTORS
The parties are independent contractors. Nothing creates an employment, 
partnership, or agency relationship.

═══════════════════════════════════════════════════════════════════════════

AGREED AND ACCEPTED:

DATACENDIA, INC.                    CUSTOMER

Signature: _________________        Signature: _________________

Name: ______________________        Name: ______________________

Title: _____________________        Title: _____________________

Date: ______________________        Date: ______________________

═══════════════════════════════════════════════════════════════════════════
```

---

# Document 2: Terms of Service (Online/Clickwrap)

```
═══════════════════════════════════════════════════════════════════════════
                    DATACENDIA TERMS OF SERVICE
═══════════════════════════════════════════════════════════════════════════

Last Updated: [DATE]

By accessing or using Datacendia's services, you agree to these Terms 
of Service. If you do not agree, do not use the Services.

───────────────────────────────────────────────────────────────────────────
1. ACCEPTANCE OF TERMS
───────────────────────────────────────────────────────────────────────────

By clicking "I Accept," creating an account, or using the Services, you 
agree to be bound by:

• These Terms of Service
• Our Privacy Policy (datacendia.com/privacy)
• Our Acceptable Use Policy (datacendia.com/aup)
• Any additional terms for specific features

If you are using the Services on behalf of an organization, you represent 
that you have authority to bind that organization to these Terms.

───────────────────────────────────────────────────────────────────────────
2. THE SERVICES
───────────────────────────────────────────────────────────────────────────

2.1 What We Provide
Datacendia provides an AI-powered decision intelligence platform that 
helps organizations make better decisions through:

• The Council: AI agents providing multiple perspectives
• Decision tracking and analytics
• Collaboration tools
• Integrations with third-party services

2.2 Service Tiers
We offer different subscription tiers with varying features and limits. 
Your access is determined by your subscription as shown at 
datacendia.com/pricing.

2.3 Changes to Services
We may modify the Services at any time. We'll notify you of material 
changes. If you don't agree with changes, you may cancel your subscription.

───────────────────────────────────────────────────────────────────────────
3. YOUR ACCOUNT
───────────────────────────────────────────────────────────────────────────

3.1 Account Creation
You must provide accurate information when creating an account. You are 
responsible for maintaining the security of your account credentials.

3.2 Account Responsibility
You are responsible for all activities under your account. Notify us 
immediately of any unauthorized access at security@datacendia.com.

3.3 Age Requirement
You must be at least 18 years old to use the Services.

───────────────────────────────────────────────────────────────────────────
4. YOUR DATA
───────────────────────────────────────────────────────────────────────────

4.1 Your Ownership
You retain all rights to data you input into the Services ("Your Data"). 
We do not claim ownership of Your Data.

4.2 License to Us
You grant us a license to use Your Data solely to provide the Services. 
We may also use aggregated, anonymized data to improve our Services.

4.3 Your Responsibility
You are responsible for:
• The accuracy and legality of Your Data
• Having necessary rights to Your Data
• Backing up Your Data
• Complying with data protection laws

4.4 Data Security
We implement reasonable security measures. However, no system is 100% 
secure. See our Security Practices at datacendia.com/security.

───────────────────────────────────────────────────────────────────────────
5. FEES AND PAYMENT
───────────────────────────────────────────────────────────────────────────

5.1 Pricing
Current pricing is at datacendia.com/pricing. Prices may change with 
60 days' notice.

5.2 Payment
• Subscriptions are billed in advance
• All fees are non-refundable except as required by law
• You are responsible for applicable taxes

5.3 Free Trials
Free trials convert to paid subscriptions unless cancelled before the 
trial ends. We'll remind you before conversion.

5.4 Cancellation
You may cancel anytime from your account settings. Cancellation is 
effective at the end of your current billing period.

───────────────────────────────────────────────────────────────────────────
6. ACCEPTABLE USE
───────────────────────────────────────────────────────────────────────────

You agree not to:

• Violate any laws or regulations
• Infringe intellectual property rights
• Upload malicious code or content
• Attempt to access other users' accounts
• Interfere with the Services' operation
• Use the Services to train competing AI models
• Resell or redistribute the Services
• Circumvent usage limits or access controls
• Use the Services for illegal decisions

See our full Acceptable Use Policy at datacendia.com/aup.

───────────────────────────────────────────────────────────────────────────
7. INTELLECTUAL PROPERTY
───────────────────────────────────────────────────────────────────────────

7.1 Our IP
The Services, including all software, algorithms, AI models, designs, 
and content, are owned by Datacendia or our licensors. You receive only 
the limited rights expressly granted here.

7.2 Restrictions
You may not:
• Copy, modify, or create derivative works
• Reverse engineer or decompile
• Remove proprietary notices
• Use our trademarks without permission

7.3 Feedback
If you provide suggestions or feedback, we may use it without restriction 
or compensation.

───────────────────────────────────────────────────────────────────────────
8. AI DISCLAIMER
───────────────────────────────────────────────────────────────────────────

IMPORTANT: THE COUNCIL PROVIDES AI-GENERATED RECOMMENDATIONS, NOT 
PROFESSIONAL ADVICE.

• Recommendations may be inaccurate or incomplete
• You are solely responsible for your decisions
• The Services do not replace professional judgment
• Do not rely on the Services for legal, financial, medical, or other 
  professional advice
• Always consult qualified professionals for important decisions

───────────────────────────────────────────────────────────────────────────
9. DISCLAIMERS
───────────────────────────────────────────────────────────────────────────

THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.

We disclaim all warranties, including:
• Merchantability
• Fitness for a particular purpose
• Non-infringement
• Accuracy or completeness
• Uninterrupted or error-free operation

───────────────────────────────────────────────────────────────────────────
10. LIMITATION OF LIABILITY
───────────────────────────────────────────────────────────────────────────

TO THE MAXIMUM EXTENT PERMITTED BY LAW:

• We are not liable for indirect, incidental, special, consequential, 
  or punitive damages
• Our total liability is limited to the fees you paid us in the 12 
  months before the claim
• We are not liable for decisions you make using the Services

Some jurisdictions don't allow these limitations, so they may not apply 
to you.

───────────────────────────────────────────────────────────────────────────
11. INDEMNIFICATION
───────────────────────────────────────────────────────────────────────────

You agree to indemnify and hold us harmless from claims arising from:
• Your use of the Services
• Your Data
• Your violation of these Terms
• Your violation of third-party rights

───────────────────────────────────────────────────────────────────────────
12. TERMINATION
───────────────────────────────────────────────────────────────────────────

12.1 By You
You may terminate by cancelling your subscription and deleting your 
account.

12.2 By Us
We may suspend or terminate your access if you:
• Violate these Terms
• Fail to pay fees
• Pose a security risk
• Are required by law

12.3 Effect
Upon termination:
• Your access ends immediately
• You may export Your Data for 30 days
• We may delete Your Data after 30 days
• Surviving provisions continue

───────────────────────────────────────────────────────────────────────────
13. GENERAL
───────────────────────────────────────────────────────────────────────────

13.1 Governing Law
These Terms are governed by Delaware law.

13.2 Disputes
Disputes will be resolved by binding arbitration, except you may bring 
claims in small claims court.

13.3 Changes to Terms
We may update these Terms. We'll notify you of material changes. 
Continued use after changes means you accept them.

13.4 Contact
Questions? Contact us at legal@datacendia.com.

───────────────────────────────────────────────────────────────────────────

By using Datacendia, you acknowledge that you have read, understood, 
and agree to be bound by these Terms of Service.

═══════════════════════════════════════════════════════════════════════════
```

---

# Document 3: Service Level Agreement (SLA)

```
═══════════════════════════════════════════════════════════════════════════
                    DATACENDIA SERVICE LEVEL AGREEMENT
═══════════════════════════════════════════════════════════════════════════

This Service Level Agreement ("SLA") applies to Professional and 
Enterprise subscription tiers.

───────────────────────────────────────────────────────────────────────────
1. SERVICE AVAILABILITY
───────────────────────────────────────────────────────────────────────────

1.1 Uptime Commitment

┌────────────────────┬────────────────────┬─────────────────────────────┐
│ Tier               │ Uptime Commitment  │ Maximum Downtime/Month      │
├────────────────────┼────────────────────┼─────────────────────────────┤
│ Starter            │ No SLA             │ N/A                         │
│ Professional       │ 99.5%              │ 3 hours 39 minutes          │
│ Enterprise         │ 99.9%              │ 43 minutes                  │
└────────────────────┴────────────────────┴─────────────────────────────┘

1.2 Uptime Calculation
Uptime = (Total Minutes - Downtime Minutes) / Total Minutes × 100%

1.3 Exclusions
The following are excluded from uptime calculations:
• Scheduled maintenance (with 72 hours notice)
• Emergency maintenance (for security or stability)
• Customer-caused issues
• Third-party service outages
• Force majeure events
• Features in beta or preview

───────────────────────────────────────────────────────────────────────────
2. SERVICE CREDITS
───────────────────────────────────────────────────────────────────────────

2.1 Credit Schedule

If we fail to meet the uptime commitment, you may request credits:

┌────────────────────────────────┬────────────────────────────────────────┐
│ Monthly Uptime                 │ Service Credit (% of monthly fee)      │
├────────────────────────────────┼────────────────────────────────────────┤
│ 99.0% - 99.5% (Pro)            │ 10%                                    │
│ 99.5% - 99.9% (Enterprise)     │ 10%                                    │
│ 95.0% - 99.0%                  │ 25%                                    │
│ 90.0% - 95.0%                  │ 50%                                    │
│ Below 90.0%                    │ 100%                                   │
└────────────────────────────────┴────────────────────────────────────────┘

2.2 Credit Request Process
• Submit request within 30 days of the incident
• Include dates, times, and description
• Submit to support@datacendia.com
• Credits applied to next invoice (no cash refunds)

2.3 Maximum Credits
Maximum credits per month: 100% of that month's fees
Credits are your sole remedy for uptime failures

───────────────────────────────────────────────────────────────────────────
3. SUPPORT RESPONSE TIMES
───────────────────────────────────────────────────────────────────────────

3.1 Support Channels

┌────────────────────┬───────────────┬───────────────┬───────────────────┐
│ Channel            │ Starter       │ Professional  │ Enterprise        │
├────────────────────┼───────────────┼───────────────┼───────────────────┤
│ Email              │ ✓             │ ✓             │ ✓                 │
│ Chat               │ -             │ ✓             │ ✓                 │
│ Phone              │ -             │ -             │ ✓                 │
│ Dedicated CSM      │ -             │ -             │ ✓                 │
│ Slack Channel      │ -             │ -             │ ✓                 │
└────────────────────┴───────────────┴───────────────┴───────────────────┘

3.2 Response Time Targets

┌────────────────────┬───────────────┬───────────────┬───────────────────┐
│ Severity           │ Starter       │ Professional  │ Enterprise        │
├────────────────────┼───────────────┼───────────────┼───────────────────┤
│ Critical           │ 24 hours      │ 4 hours       │ 1 hour            │
│ (Service down)     │               │               │                   │
├────────────────────┼───────────────┼───────────────┼───────────────────┤
│ High               │ 48 hours      │ 8 hours       │ 4 hours           │
│ (Major feature     │               │               │                   │
│ impaired)          │               │               │                   │
├────────────────────┼───────────────┼───────────────┼───────────────────┤
│ Medium             │ 72 hours      │ 24 hours      │ 8 hours           │
│ (Feature impaired) │               │               │                   │
├────────────────────┼───────────────┼───────────────┼───────────────────┤
│ Low                │ 5 days        │ 48 hours      │ 24 hours          │
│ (General inquiry)  │               │               │                   │
└────────────────────┴───────────────┴───────────────┴───────────────────┘

3.3 Support Hours
• Starter: Business hours (9am-6pm ET, Mon-Fri)
• Professional: Extended hours (7am-10pm ET, Mon-Fri)
• Enterprise: 24/7/365

───────────────────────────────────────────────────────────────────────────
4. MAINTENANCE WINDOWS
───────────────────────────────────────────────────────────────────────────

4.1 Scheduled Maintenance
• Standard window: Sundays 2am-6am ET
• Notice: 72 hours minimum
• Notification: Email and status page

4.2 Emergency Maintenance
• For critical security or stability issues
• Notice: As soon as reasonably possible
• We'll minimize duration and impact

4.3 Status Page
Real-time status at app.datacendia.com/status
Subscribe for automatic notifications

───────────────────────────────────────────────────────────────────────────
5. DATA PROTECTION
───────────────────────────────────────────────────────────────────────────

5.1 Backup Schedule
• Database: Continuous replication
• Point-in-time recovery: 30 days
• Geographic redundancy: Yes

5.2 Recovery Objectives

┌────────────────────────────────┬────────────────────────────────────────┐
│ Metric                         │ Target                                 │
├────────────────────────────────┼────────────────────────────────────────┤
│ Recovery Point Objective (RPO) │ 1 hour                                 │
│ Recovery Time Objective (RTO)  │ 4 hours                                │
└────────────────────────────────┴────────────────────────────────────────┘

5.3 Data Export
You can export your data at any time from Settings > Data Export

───────────────────────────────────────────────────────────────────────────
6. SECURITY
───────────────────────────────────────────────────────────────────────────

6.1 Compliance Architecture
• SOC 2 Type II — architecture aligned (formal audit planned)
• ISO 27001 — architecture aligned (Enterprise tier, certification on contract)
• GDPR — design-compliant (DPA available)

6.2 Security Measures
• Encryption: TLS 1.3 in transit, AES-256 at rest
• Access controls: Role-based, MFA available
• Penetration testing: Annual third-party
• Vulnerability scanning: Continuous

6.3 Incident Response
• Detection: Automated monitoring
• Response: Within 1 hour
• Notification: Within 24 hours of confirmed breach
• Post-mortem: Within 5 business days

───────────────────────────────────────────────────────────────────────────
7. REPORTING
───────────────────────────────────────────────────────────────────────────

7.1 Availability Reports
• Professional: Monthly summary
• Enterprise: Weekly detailed report

7.2 Incident Reports
Available upon request for any incident affecting your account

───────────────────────────────────────────────────────────────────────────

This SLA is incorporated into and subject to the Master SaaS Agreement.

═══════════════════════════════════════════════════════════════════════════
```

---

# Document 4: Acceptable Use Policy (AUP)

```
═══════════════════════════════════════════════════════════════════════════
                    DATACENDIA ACCEPTABLE USE POLICY
═══════════════════════════════════════════════════════════════════════════

Last Updated: [DATE]

This Acceptable Use Policy ("AUP") governs your use of Datacendia's 
services. Violation may result in suspension or termination.

───────────────────────────────────────────────────────────────────────────
1. PERMITTED USE
───────────────────────────────────────────────────────────────────────────

You MAY use Datacendia to:

✓ Analyze business decisions using the Council
✓ Track and document organizational decisions
✓ Collaborate with team members on decisions
✓ Generate reports and analytics
✓ Integrate with authorized third-party services
✓ Export your own data
✓ Use API within documented rate limits

───────────────────────────────────────────────────────────────────────────
2. PROHIBITED USES
───────────────────────────────────────────────────────────────────────────

You may NOT use Datacendia to:

ILLEGAL ACTIVITIES
✗ Violate any laws or regulations
✗ Facilitate fraud, money laundering, or financial crimes
✗ Support illegal discrimination
✗ Plan or coordinate illegal activities

HARMFUL CONTENT
✗ Upload malware, viruses, or malicious code
✗ Distribute hate speech or harassment
✗ Share illegal content
✗ Distribute spam or phishing

SYSTEM ABUSE
✗ Attempt to gain unauthorized access
✗ Interfere with other users' access
✗ Overload or disrupt the Services
✗ Circumvent security measures or usage limits
✗ Use automated bots or scrapers (except authorized APIs)
✗ Reverse engineer or decompile the Services

COMPETITIVE MISUSE
✗ Use the Services to build a competing product
✗ Train AI/ML models using our outputs
✗ Resell, redistribute, or sublicense access
✗ Benchmark for publication without consent

ACCOUNT MISUSE
✗ Share login credentials
✗ Create fake or misleading accounts
✗ Exceed your licensed user count
✗ Access another user's account

INTELLECTUAL PROPERTY
✗ Infringe copyrights, trademarks, or patents
✗ Remove or alter proprietary notices
✗ Misrepresent ownership of content

───────────────────────────────────────────────────────────────────────────
3. CONTENT STANDARDS
───────────────────────────────────────────────────────────────────────────

Content you upload or create must NOT include:

• Illegal content
• Personally identifiable information without proper consent
• Protected health information without proper safeguards
• Content that infringes third-party rights
• Malicious or deceptive content
• Content promoting violence or harm

───────────────────────────────────────────────────────────────────────────
4. USAGE LIMITS
───────────────────────────────────────────────────────────────────────────

Your subscription includes specific limits on:

• Number of users
• Number of deliberations
• API calls
• Storage
• Integrations

Exceeding limits may result in:
• Overage charges
• Throttling
• Required upgrade
• Suspension

Check your current usage in Settings > Usage.

───────────────────────────────────────────────────────────────────────────
5. API USE
───────────────────────────────────────────────────────────────────────────

If you use our API:

• Respect rate limits
• Use authentication properly
• Don't share API keys
• Cache appropriately
• Handle errors gracefully
• Follow API documentation

Rate limits by tier:
• Starter: 100 requests/minute
• Professional: 500 requests/minute
• Enterprise: Custom limits

───────────────────────────────────────────────────────────────────────────
6. REPORTING VIOLATIONS
───────────────────────────────────────────────────────────────────────────

Report violations to: abuse@datacendia.com

Include:
• Description of the violation
• Evidence if available
• Your contact information

We investigate all reports and take appropriate action.

───────────────────────────────────────────────────────────────────────────
7. ENFORCEMENT
───────────────────────────────────────────────────────────────────────────

7.1 Actions We May Take

For violations, we may:
• Issue a warning
• Temporarily suspend access
• Permanently terminate access
• Remove violating content
• Report to law enforcement
• Pursue legal remedies

7.2 No Refunds

If we terminate for AUP violation, no refund is provided.

7.3 Appeals

To appeal an enforcement action:
• Email appeals@datacendia.com within 10 days
• Include your account info and explanation
• We'll review and respond within 5 business days

───────────────────────────────────────────────────────────────────────────
8. CHANGES
───────────────────────────────────────────────────────────────────────────

We may update this AUP. Material changes will be notified via email 
and posted here. Continued use after changes means acceptance.

───────────────────────────────────────────────────────────────────────────

Questions? Contact legal@datacendia.com

═══════════════════════════════════════════════════════════════════════════
```

---

# Document 5: Order Form Template

```
═══════════════════════════════════════════════════════════════════════════
                         DATACENDIA ORDER FORM
═══════════════════════════════════════════════════════════════════════════

Order Form #: DF-[YEAR]-[NUMBER]
Order Date: [DATE]

This Order Form is subject to the Datacendia Master SaaS Agreement 
between the parties dated [MSA DATE] (the "Agreement").

───────────────────────────────────────────────────────────────────────────
                         CUSTOMER INFORMATION
───────────────────────────────────────────────────────────────────────────

Company Name:     ________________________________________________

Address:          ________________________________________________
                  ________________________________________________

Billing Contact:  ________________________________________________

Email:            ________________________________________________

Phone:            ________________________________________________

───────────────────────────────────────────────────────────────────────────
                         SUBSCRIPTION DETAILS
───────────────────────────────────────────────────────────────────────────

┌────────────────────────────────────────────────────────────────────────┐
│ SUBSCRIPTION TIER                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ [ ] Foundation     [ ] Intelligence     [ ] Governance    [ ] Sovereign│
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ DEPLOYMENT MODEL                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [ ] Cloud-Hosted (SaaS)                                                 │
│ [ ] Self-Hosted (On-Premise) — container images + Helm chart            │
│ [ ] Sovereign (Air-Gapped) — offline .dcl license, no outbound network  │
│                                                                         │
│ Hardware-Bound License: [ ] Yes  [ ] No                                 │
│ Machine Fingerprint:    ________________________________________        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBSCRIPTION TERM                                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Start Date:        ____________________                                 │
│ End Date:          ____________________                                 │
│ Term Length:       [ ] 1 Year    [ ] 2 Years    [ ] 3 Years            │
│ Auto-Renewal:      [ ] Yes       [ ] No                                 │
└────────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────
                         LICENSED CAPACITY
───────────────────────────────────────────────────────────────────────────

┌─────────────────────────────┬────────────┬────────────┬────────────────┐
│ Item                        │ Quantity   │ Unit Price │ Extended       │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ User Licenses               │            │            │                │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ Additional Deliberations    │            │            │                │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ Additional Storage (GB)     │            │            │                │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ Premium Integrations        │            │            │                │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ Custom Agent Development    │            │            │                │
├─────────────────────────────┼────────────┼────────────┼────────────────┤
│ Professional Services       │            │            │                │
├─────────────────────────────┴────────────┴────────────┼────────────────┤
│                                          SUBTOTAL:    │                │
├───────────────────────────────────────────────────────┼────────────────┤
│                                          DISCOUNT:    │                │
├───────────────────────────────────────────────────────┼────────────────┤
│                               TOTAL ANNUAL VALUE:     │                │
└───────────────────────────────────────────────────────┴────────────────┘

───────────────────────────────────────────────────────────────────────────
                         PAYMENT TERMS
───────────────────────────────────────────────────────────────────────────

Payment Frequency:    [ ] Annual    [ ] Quarterly    [ ] Monthly

Payment Method:       [ ] Credit Card    [ ] ACH    [ ] Wire    [ ] Invoice

Payment Terms:        Net ____ days

First Payment Due:    ____________________

───────────────────────────────────────────────────────────────────────────
                         SPECIAL TERMS
───────────────────────────────────────────────────────────────────────────

Data Region:          [ ] US    [ ] EU    [ ] APAC

SLA Level:            [ ] Standard    [ ] Enhanced (Enterprise only)

Support Level:        [ ] Standard    [ ] Premium

Additional Terms:
________________________________________________________________
________________________________________________________________
________________________________________________________________

───────────────────────────────────────────────────────────────────────────
                         SIGNATURES
───────────────────────────────────────────────────────────────────────────

By signing below, each party agrees to the terms of this Order Form 
and the referenced Agreement.

DATACENDIA, INC.

Signature:    _________________________    Date: _______________

Name:         _________________________

Title:        _________________________


CUSTOMER

Signature:    _________________________    Date: _______________

Name:         _________________________

Title:        _________________________

═══════════════════════════════════════════════════════════════════════════
```

---

# License System — Implemented

Two licensing mechanisms are implemented and enforced at runtime:

## Online Licensing (Cloud-Hosted)

The `requireLicense` middleware enforces tier-based access with a 
three-tier fallback: Redis cache → Prisma database → default pilot tier.

License tiers: `pilot`, `foundation`, `enterprise`, `strategic`, `custom`.
License types: `named`, `concurrent`, `site`.

## Offline Licensing (Self-Hosted / Sovereign)

Implemented in `backend/src/services/sovereign/OfflineLicenseService.ts`.
CLI tool: `backend/scripts/generate-offline-license.ts`.

```
Architecture:

  Datacendia HQ                          Customer Site
  ─────────────                          ─────────────
  1. Generate Ed25519 keypair            
     tsx scripts/generate-offline-license.ts --generate-keys
                                         
  2. Sign license JWT with private key   
     tsx scripts/generate-offline-license.ts \
       --sign --org "Acme Corp" --tier enterprise \
       --pillars helm,guard,predict --seats 50 \
       --days 365 --hardware-id <fingerprint>
                                         
  3. Deliver .dcl file via secure channel
     ──────────────────────────────────► 4. Place at /etc/datacendia/license.dcl
                                            or set DATACENDIA_LICENSE_FILE env var
                                         
                                         5. At startup, OfflineLicenseService
                                            verifies Ed25519 signature using
                                            embedded public key — zero network
                                         
                                         6. SovereignModeService validates
                                            license as step 6 of startup
```

License file format: `.dcl` = raw Ed25519-signed JWT (via `jose` library)
Private key storage: `.keys/` directory (gitignored, never leaves HQ)
Public key delivery: embedded in builds via `DATACENDIA_LICENSE_PUBLIC_KEY` env var

JWT claims: `org`, `tier`, `pillars`, `seats`, `exp`, `iss`, optional `hwid`

---

## Implementation Checklist

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LICENSE IMPLEMENTATION CHECKLIST                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LEGAL DOCUMENTS                                                        │
│  [ ] Have attorney review all documents                                 │
│  [ ] Localize for key markets (EU, UK, etc.)                           │
│  [x] Set up document version control (this file, git-tracked)          │
│  [x] Create customer-facing legal page (/terms, /privacy, /security)   │
│                                                                         │
│  TECHNICAL IMPLEMENTATION                                               │
│  [x] Implement license key generation (online: Prisma + Redis)         │
│  [x] Implement license validation (requireLicense middleware)           │
│  [x] Implement offline license (.dcl Ed25519 signed JWTs)              │
│  [x] Implement hardware-bound licensing (optional fingerprint)         │
│  [ ] Build license management dashboard (admin UI)                     │
│  [x] Set up usage tracking (API metrics, request logging)              │
│  [x] Implement feature flags based on license (FeatureControlService)  │
│  [ ] Build renewal/upgrade flows                                        │
│                                                                         │
│  OPERATIONS                                                             │
│  [ ] Train sales team on licensing terms                               │
│  [ ] Create customer-facing FAQ                                         │
│  [ ] Set up contract management system                                  │
│  [x] Implement license expiry notifications (sovereign startup check)  │
│  [x] Build reporting for compliance (audit logging, Prometheus metrics)│
│                                                                         │
│  INFRASTRUCTURE                                                         │
│  [x] Public status page (app.datacendia.com/status)                    │
│  [x] Kubernetes health probes (liveness, readiness)                    │
│  [x] Helm chart for self-hosted deployment                             │
│  [x] Sovereign mode service (air-gapped startup validation)            │
│  [x] 10 enterprise connectors built and wired                          │
│                                                                         │
│  COMPLIANCE                                                             │
│  [ ] Register copyrights/trademarks                                    │
│  [ ] Set up DMCA agent (if US)                                         │
│  [x] GDPR design-compliant (DPA available, data location controls)     │
│  [ ] SOC 2 Type II — architecture aligned, formal audit pending        │
│  [ ] Third-party penetration test — requires hiring a firm             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**⚠️ IMPORTANT DISCLAIMER:**
These documents are templates and should be reviewed by a qualified 
attorney before use. Laws vary by jurisdiction, and your specific 
situation may require different terms.

---

**Document Version:** 2.0  
**Last Updated:** March 2026  
**Owner:** Legal / Product
