<!--
  This is a TEMPLATE for the /dpa generator. Tokens in {{double braces}} are
  merge fields filled from the form:
    {{companyName}}     — Controller's legal company name
    {{companyAddress}}  — Controller's registered address
    {{signerEmail}}     — Controller's signer email
    {{effectiveDate}}   — Date the DPA is generated / to be signed

  Roles: the CUSTOMER is the Controller; SANTiHANS GmbH (scrt.link) is the Processor.
  Compliance target: GDPR Art. 28 + Swiss revFADP (nFADP) Art. 9, dual-compliant.
-->

# Data Processing Agreement

**scrt.link — operated by SANTiHANS GmbH**

This Data Processing Agreement ("**Agreement**" or "**DPA**") forms part of, and is subject to, the Terms of Service and any other agreement for the provision of the scrt.link services (the "**Principal Agreement**") between:

- **{{companyName}}**, {{companyAddress}} (the "**Company**" or "**Controller**"); and
- **SANTiHANS GmbH**, CH-4056 Basel, Switzerland, UID CHE-244.875.499, operating under the brand **scrt.link** (the "**Processor**"),

each a "**Party**" and together the "**Parties**".

**Effective date:** {{effectiveDate}}

In the event of a conflict between this Agreement and the Principal Agreement in respect of the processing of Personal Data, the terms of this Agreement shall prevail.

## Background

(A) The Company acts as a Controller of the Personal Data it, or its own users, submit to the scrt.link service.

(B) The Company uses the scrt.link service, which may involve the processing of Personal Data by the Processor on behalf of the Company.

(C) The Parties wish to implement a data processing agreement that complies with applicable Data Protection Laws, in particular the EU General Data Protection Regulation (Regulation (EU) 2016/679, "**GDPR**") and the Swiss Federal Act on Data Protection of 25 September 2020 ("**revFADP**" / nFADP) together with its Ordinance.

(D) This Agreement sets out the terms and conditions on which the Processor processes Personal Data on behalf of the Company.

**IT IS AGREED AS FOLLOWS:**

## 1. Definitions and Interpretation

1.1 Unless otherwise defined herein, capitalised terms have the following meaning:

- "**Data Protection Laws**" means all laws and regulations applicable to the processing of Personal Data under this Agreement, including the GDPR and the revFADP.
- "**Controller**", "**Processor**", "**Data Subject**", "**Personal Data**", "**Personal Data Breach**", "**Processing**" and "**Supervisory Authority**" have the meanings given in the GDPR; equivalent terms under the revFADP (e.g. the Federal Data Protection and Information Commissioner, "**FDPIC**") shall be read into these terms where Swiss law applies.
- "**Sub-processor**" means any third party engaged by the Processor to process Personal Data on behalf of the Company.
- "**Services**" means the scrt.link services provided under the Principal Agreement.
- "**Encrypted Content**" means secret payloads (text and files) that are encrypted on the Data Subject's or Company's device before transmission and to which the Processor has no access in unencrypted form (see clause 3).

  1.2 The Annexes form an integral part of this Agreement.

## 2. Processing of Personal Data

2.1 **Roles.** The Company is the Controller and the Processor is the processor with respect to the Personal Data processed under the Principal Agreement. Where the Company is itself a processor acting on behalf of a third-party controller, the Processor acts as a sub-processor and the Company warrants that it has the necessary authority to engage the Processor on those terms.

2.2 **Instructions.** The Processor shall process Personal Data only on documented instructions from the Company, including with regard to international transfers, unless required to do so by Swiss or EU law to which the Processor is subject; in such a case, the Processor shall inform the Company of that legal requirement before processing, unless the law prohibits such information on important grounds of public interest. The Principal Agreement, this Agreement (including its Annexes) and the Company's use and configuration of the Services constitute the Company's complete and final documented instructions.

2.3 **Lawfulness.** The Company is responsible for ensuring that it has a lawful basis for the processing and that its instructions comply with Data Protection Laws. The Processor shall inform the Company if, in its opinion, an instruction infringes Data Protection Laws.

2.4 **Scope.** The subject matter, duration, nature and purpose of the processing, the categories of Personal Data and Data Subjects are described in **Annex 1**.

## 3. Zero-Knowledge Encryption of Secret Content

3.1 The Services are designed on a zero-knowledge, end-to-end encryption model. Encrypted Content is encrypted on the client side before it reaches the Processor's systems, and the Processor does not hold, and cannot derive, the keys required to decrypt Encrypted Content.

3.2 Accordingly, the Processor processes Encrypted Content solely as opaque ciphertext for the purposes of transmission, temporary storage and one-time retrieval, and has no ability to access the underlying Personal Data (if any) contained within it. The Company remains solely responsible for the content it and its Data Subjects choose to encrypt and share through the Services.

3.3 The Personal Data to which the Processor has access in a readable form is limited to account and operational data (such as the Company's account email address, optional name, organisation and billing metadata), as further described in **Annex 1**.

## 4. Confidentiality

4.1 The Processor shall ensure that persons authorised to process the Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality, and that access is limited to those personnel who need it to provide the Services.

## 5. Security

5.1 Taking into account the state of the art, the costs of implementation, and the nature, scope, context and purposes of processing, the Processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, as described in **Annex 2**, consistent with Article 32 GDPR and Article 8 revFADP together with Articles 1–6 of the Data Protection Ordinance.

5.2 The Company acknowledges that the security measures are subject to technical progress and that the Processor may update them from time to time, provided the updates do not materially decrease the overall level of security.

## 6. Sub-processing

6.1 The Company grants the Processor general written authorisation to engage the Sub-processors listed in **Annex 3** for the processing of Personal Data.

6.2 The Processor shall impose on each Sub-processor, by way of a contract, data protection obligations no less protective than those set out in this Agreement, and remains fully liable to the Company for the performance of each Sub-processor's obligations.

6.3 The Processor shall inform the Company of any intended addition or replacement of a Sub-processor, giving the Company a reasonable opportunity to object on reasonable data-protection grounds. The current list of Sub-processors is available at scrt.link and in **Annex 3**.

## 7. Assistance with Data Subject Rights

7.1 Taking into account the nature of the processing, the Processor shall assist the Company by appropriate technical and organisational measures, insofar as this is possible, in fulfilling the Company's obligation to respond to requests from Data Subjects exercising their rights under Data Protection Laws.

7.2 If the Processor receives a request from a Data Subject in relation to Personal Data processed on behalf of the Company, it shall, unless legally prohibited, redirect the Data Subject to the Company and not respond to the request itself except on the Company's documented instructions.

## 8. Personal Data Breach

8.1 The Processor shall notify the Company without undue delay after becoming aware of a Personal Data Breach affecting the Personal Data processed under this Agreement, and shall provide the Company with sufficient information to allow the Company to meet its obligations to report or notify the breach under Data Protection Laws (Articles 33 and 34 GDPR; Article 24 revFADP).

8.2 Such notification shall not be construed as an acknowledgement by the Processor of any fault or liability.

## 9. Data Protection Impact Assessments

9.1 The Processor shall provide reasonable assistance to the Company with any data protection impact assessments and prior consultations with Supervisory Authorities that the Company reasonably considers to be required under Data Protection Laws, in each case solely in relation to the processing of Personal Data by the Processor and taking into account the nature of the processing and the information available to the Processor.

## 10. International Transfers

10.1 The Processor may transfer Personal Data to, or process it in, countries outside Switzerland and the European Economic Area only where an adequate level of protection is ensured, including by means of an adequacy decision, the Standard Contractual Clauses (as adopted by the European Commission and as recognised/adapted by the FDPIC for Switzerland), or another lawful transfer mechanism.

10.2 The storage locations and transfer safeguards for each Sub-processor are described in **Annex 3**.

## 11. Deletion or Return of Personal Data

11.1 Upon termination of the Services, and at the choice of the Company, the Processor shall delete or return all Personal Data processed on behalf of the Company and delete existing copies, unless Swiss or EU law requires storage of the Personal Data.

11.2 Encrypted Content is, by design, retained only until it is retrieved once or until its configured expiry, after which it is deleted. Residual copies in encrypted backups are purged within thirty (30) days.

## 12. Audit

12.1 The Processor shall make available to the Company all information reasonably necessary to demonstrate compliance with this Agreement and shall allow for and contribute to audits, including inspections, conducted by the Company or an auditor mandated by the Company.

12.2 The Company shall give reasonable prior notice, audits shall take place during normal business hours, no more than once per year (save where required by a Supervisory Authority or following a Personal Data Breach), and shall be conducted so as to minimise disruption to the Processor's business. The Processor may satisfy an audit request by providing up-to-date certifications or third-party audit reports where available.

## 13. Swiss Law Specifics (revFADP)

13.1 Where the revFADP applies, references in this Agreement to the GDPR shall be read to include the equivalent provisions of the revFADP and its Ordinance, and references to the "Supervisory Authority" shall include the FDPIC.

13.2 The Processor shall process Personal Data only in a manner that the Company itself would be permitted to process it, and shall not be subject to any statutory or contractual duty of confidentiality that would prohibit the processing, in accordance with Article 9 revFADP.

## 14. Additional U.S. Privacy Laws

14.1 To the extent applicable, the Processor shall comply with contractual processor obligations under applicable U.S. state privacy laws, including the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), and substantially similar state privacy laws.

## 15. General

15.1 **Liability.** Each Party's liability under this Agreement is subject to the limitations and exclusions of liability set out in the Principal Agreement.

15.2 **Term.** This Agreement takes effect on the Effective Date and continues for as long as the Processor processes Personal Data on behalf of the Company under the Principal Agreement.

15.3 **Governing law and jurisdiction.** This Agreement is governed by the substantive laws of Switzerland. The courts of Basel, Switzerland, shall have exclusive jurisdiction, without prejudice to any mandatory jurisdiction under Data Protection Laws.

15.4 **Severability.** If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

## Signatures

By signing below, the Parties agree to be bound by this Data Processing Agreement.

|           | **Controller**  | **Processor**              |
| --------- | --------------- | -------------------------- |
| Company   | {{companyName}} | SANTiHANS GmbH (scrt.link) |
| Name      |                 |                            |
| Title     |                 |                            |
| Signature |                 |                            |
| Date      |                 |                            |

_Signer contact: {{signerEmail}}_

---

## Annex 1 — Details of the Processing

**Subject matter:** Provision of the scrt.link secure secret-sharing service under the Principal Agreement.

**Duration:** For the term of the Principal Agreement, plus the retention/deletion periods described in clause 11.

**Nature and purpose of processing:** Hosting, transmission, temporary storage and one-time retrieval of Encrypted Content; account creation and authentication; organisation and membership management; billing and payment; transactional and security communications; abuse prevention and rate limiting.

**Categories of Data Subjects:**

- The Company's authorised users and account holders;
- Recipients of secret links created by the Company's users;
- Any Data Subjects whose Personal Data is contained within Encrypted Content (unknown to and inaccessible by the Processor — see clause 3).

**Categories of Personal Data processed in readable form by the Processor:**

- Account email address;
- Name (optional);
- Organisation name (optional);
- Billing metadata (handled by Stripe; card data is never stored on the Processor's systems);
- Technical/operational data such as timestamps and usage metadata necessary to provide the Services. IP addresses are not stored persistently; they may be processed transiently for security and rate limiting and may appear briefly in hosting provider logs.

**Encrypted Content:** Any Personal Data within Encrypted Content is processed only as opaque ciphertext and is inaccessible to the Processor (clause 3).

**Special categories of Personal Data:** None are intentionally collected by the Processor. The Company must not instruct the Processor to process special-category data in readable form; any such data may only be transmitted as Encrypted Content, for which the Company remains solely responsible.

---

## Annex 2 — Technical and Organisational Measures

The Processor maintains, at a minimum, the following measures (subject to update under clause 5.2):

**Encryption**

- End-to-end, zero-knowledge encryption of secret content: payloads are encrypted client-side (AES-GCM) before transmission; the Processor cannot decrypt them.
- Passwords are never stored; a password-derived key (PBKDF2, 600,000 iterations) wraps a per-user master key. The master key is held in browser memory only and never transmitted in plaintext.
- Encryption of data in transit (TLS) between clients and the Services.

**Access control and authentication**

- Session tokens are stored hashed (SHA-256); sessions expire after 30 days.
- Access to production systems is restricted to authorised personnel on a need-to-know basis.
- Support for single sign-on via Google as an optional identity provider.

**Data minimisation and retention**

- Collection limited to account email and optional name/organisation.
- IP addresses are not persistently stored.
- Secrets are deleted after one-time retrieval or expiry; backup residuals purged within 30 days.

**Resilience and availability**

- Hosting on managed, reputable cloud infrastructure with encrypted backups.

**Organisational measures**

- Confidentiality obligations for personnel.
- Sub-processor due diligence and contractual data-protection flow-down.
- Breach detection and notification procedures.

---

## Annex 3 — Approved Sub-processors

| Sub-processor                  | Purpose                                                                   | Data processed                                                                   | Location / transfer safeguard              |
| ------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| **Vercel Inc.**                | Application hosting and infrastructure                                    | Operational/account data, transient IP in logs                                   | US; Standard Contractual Clauses           |
| **Neon Inc.**                  | Production database (PostgreSQL)                                          | Account data, encrypted content metadata                                         | US/EU; Standard Contractual Clauses        |
| **Flow Swiss AG** (flow.swiss) | Encrypted file storage for secret payloads (S3-compatible object storage) | Encrypted Content (opaque ciphertext)                                            | Switzerland; no third-country transfer     |
| **Stripe**                     | Payment processing                                                        | Email, optional name, optional organisation; card data never stored by Processor | US/EU; Standard Contractual Clauses        |
| **Brevo**                      | Transactional/authentication emails and marketing contact list            | Email, name (if available)                                                       | EU (data stored within the European Union) |
| **Google**                     | Authentication (only if the user signs in with Google)                    | Email, name                                                                      | US; Standard Contractual Clauses           |

The Processor will maintain and publish an up-to-date list of Sub-processors and notify the Company of changes in accordance with clause 6.3.
