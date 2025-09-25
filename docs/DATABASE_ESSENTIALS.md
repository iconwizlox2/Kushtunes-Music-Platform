# Database Essentials & Metadata Schema

## 📊 **Complete Database Schema Overview**

### ✅ **Essential Tables & Fields**

#### 1. **Artists Table**
```sql
- id: String (Primary Key)
- name: String (Artist display name)
- legal_name: String (Legal name for contracts)
- country: String (Country code)
- email: String (Unique)
- payout_method: String (Stripe Connect ID, PayPal email, etc.)
- tax_status: TaxStatus (Individual, Business, Tax Exempt) ✅ ADDED
- tax_id: String (Tax ID number) ✅ ADDED
- kyc_status: KycStatus (Pending, Approved, Rejected, Under Review)
- kyc_documents: JSON (Document URLs)
- created_at: DateTime
- updated_at: DateTime
```

#### 2. **Releases Table**
```sql
- id: String (Primary Key)
- upc: String (Unique, auto-generated if blank)
- title: String
- version: String (Radio Edit, Extended Mix, etc.)
- label: String
- primary_artist_id: String (Foreign Key)
- release_date: DateTime
- territories: JSON (Array of country codes) ✅ IMPROVED
- excluded_territories: JSON (Excluded countries) ✅ ADDED
- status: ReleaseStatus (Draft, Under Review, Approved, Rejected, Live)
- genre: String
- subgenre: String
- copyright_year: Int
- p_line: String (P-line copyright)
- c_line: String (C-line copyright)
- cover_url: String (3000x3000 cover art)
- gallery_urls: JSON (Optional gallery images) ✅ ADDED
- created_at: DateTime
- updated_at: DateTime
```

#### 3. **Tracks Table**
```sql
- id: String (Primary Key)
- release_id: String (Foreign Key)
- isrc: String (Unique, auto-generated if blank)
- title: String
- version: String (Track version)
- track_number: Int
- explicit: Boolean (Default: false)
- language: String (Default: "en")
- duration: Int (Duration in seconds)
- audio_url: String (WAV/FLAC file URL)
- preview_start: Int (Preview start time in seconds) ✅ ADDED
- lyrics: String (Optional lyrics)
- created_at: DateTime
- updated_at: DateTime
```

#### 4. **Contributors Table**
```sql
- id: String (Primary Key)
- track_id: String (Foreign Key)
- name: String
- role: ContributorRole (Main Artist, Featured Artist, Producer, etc.) ✅ IMPROVED
- ipi: String (International Performer Identification)
- cae: String (Composer/Author/Editor code) ✅ ADDED
- created_at: DateTime
- updated_at: DateTime
```

#### 5. **Splits Table**
```sql
- id: String (Primary Key)
- track_id: String (Foreign Key)
- artist_id: String (Foreign Key)
- percent: Float (Percentage 0-100)
- recoupment_flag: Boolean (Default: false)
- created_at: DateTime
- updated_at: DateTime
```

#### 6. **Deliveries Table**
```sql
- id: String (Primary Key)
- release_id: String (Foreign Key)
- store: String (Spotify, Apple Music, etc.)
- status: DeliveryStatus (Pending, Submitted, Processing, Live, Rejected, Failed)
- submitted_at: DateTime
- message: String (Store response message) ✅ ADDED
- notes: String (Internal notes)
- created_at: DateTime
- updated_at: DateTime
```

#### 7. **Reports Table**
```sql
- id: String (Primary Key)
- period: String (YYYY-MM format)
- source: String (Distributor name)
- file_url: String (CSV/XLSX URL)
- imported_flag: Boolean (Default: false)
- imported_at: DateTime
- created_at: DateTime
- updated_at: DateTime
```

#### 8. **Earnings Table**
```sql
- id: String (Primary Key)
- track_id: String (Foreign Key)
- store: String
- country: String
- units: Int (Streams, downloads, etc.)
- revenue: Float
- period: String (YYYY-MM format)
- report_id: String (Foreign Key, optional)
- created_at: DateTime
- updated_at: DateTime
```

### 🆕 **New Essential Tables**

#### 9. **Rights Table** ✅ ADDED
```sql
- id: String (Primary Key)
- release_id: String (Foreign Key)
- type: RightsType (Original, Cover, Public Domain, Sampled)
- mechanical_license: String (Mechanical license info if cover)
- public_domain_flag: Boolean (Default: false)
- copyright_owner: String (Copyright owner name)
- copyright_year: Int (Copyright year)
- created_at: DateTime
- updated_at: DateTime
```

#### 10. **Compliance Table** ✅ ADDED
```sql
- id: String (Primary Key)
- release_id: String (Foreign Key, optional)
- track_id: String (Foreign Key, optional)
- type: ComplianceType (DMCA, Content Policy, KYC, etc.)
- status: ComplianceStatus (Pending, Approved, Rejected, etc.)
- reason: String (Reason for compliance check)
- action: String (Action taken)
- reviewed_by: String (Admin who reviewed)
- reviewed_at: DateTime
- created_at: DateTime
- updated_at: DateTime
```

#### 11. **Audit Log Table** ✅ ADDED
```sql
- id: String (Primary Key)
- artist_id: String (Foreign Key, optional)
- user_id: String (User who performed action)
- action: String (Action performed)
- entity: String (Entity affected)
- entity_id: String (ID of affected entity)
- old_values: JSON (Previous values)
- new_values: JSON (New values)
- ip_address: String (IP address)
- user_agent: String (User agent)
- created_at: DateTime
```

#### 12. **Payouts Table** ✅ ENHANCED
```sql
- id: String (Primary Key)
- artist_id: String (Foreign Key)
- amount: Float
- method: PayoutMethod (Stripe Connect, PayPal, Revolut, USDT, Bank Transfer) ✅ ENHANCED
- status: PayoutStatus (Pending, Approved, Processed, Failed)
- reference: String (External reference ID)
- invoice_url: String (Generated invoice/receipt URL) ✅ ADDED
- processed_at: DateTime
- created_at: DateTime
- updated_at: DateTime
```

## 📋 **Metadata Schema (Form Capture)**

### **Release Metadata**
- **Title**: Release title
- **Version**: Release version (Radio Edit, Extended Mix, etc.)
- **Primary Artist**: Main artist name
- **UPC/EAN**: Auto-generated if blank
- **Label**: Record label name
- **Genre/Subgenre**: Music genre classification
- **Release Date**: Release date
- **Territories**: Include/exclude countries (JSON array)
- **P-line/C-line**: Copyright information
- **Copyright Year**: Copyright year

### **Track Metadata**
- **Title**: Track title
- **Version**: Track version
- **Track Number**: Position in release
- **ISRC**: Auto-generated if blank
- **Explicit Flag**: Content warning
- **Language**: Track language
- **Contributors**: Artists, producers, songwriters
- **Lyrics**: Optional lyrics text
- **Preview Start**: Optional preview start time

### **Assets**
- **Audio**: WAV/FLAC format (max 100MB)
- **Cover**: JPG/PNG 3000×3000 (max 10MB)
- **Gallery**: Optional gallery images for stores

### **Rights**
- **Type**: Original/Cover/Public Domain
- **Mechanical License**: Info if cover song
- **Public Domain Flags**: Where relevant

## 🔒 **Compliance & Policies**

### **KYC/AML for Payouts**
- Match names with IDs
- Tax status verification
- Document verification

### **Terms of Service**
- Rights & takedowns coverage
- Content policy enforcement
- DMCA flow implementation

### **Content Policy**
- No AI voice clones without license
- No copyright infringements
- Audit log for all actions

## 💰 **Royalty Ingestion**

### **Process Flow**
1. Parse monthly CSV/TSV/Excel from distributor
2. Normalize data format
3. Write to earnings table
4. Compute artist balances
5. Split payouts automatically
6. Respect recoupment if advance costs

## 💳 **Payouts**

### **Withdraw Process**
1. Add Withdraw button
2. Choose method (Stripe/PayPal/Revolut/USDT/Bank Transfer)
3. Generate invoice/receipt
4. Mark payout transaction with reference ID
5. Update payout status

## 🎯 **Key Improvements Made**

### ✅ **Added Missing Fields**
- `tax_status` and `tax_id` to Artists
- `excluded_territories` and `gallery_urls` to Releases
- `preview_start` to Tracks
- `cae` to Contributors
- `message` to Deliveries
- `invoice_url` to Payouts

### ✅ **Added New Tables**
- **Rights**: Copyright and licensing information
- **Compliance**: DMCA, content policy, KYC tracking
- **Audit Log**: Complete action tracking

### ✅ **Enhanced Enums**
- **TaxStatus**: Individual, Business, Tax Exempt
- **ContributorRole**: Detailed role types
- **PayoutMethod**: Multiple payment options
- **RightsType**: Copyright types
- **ComplianceType**: Various compliance categories

### ✅ **Improved Data Types**
- **Territories**: Changed from String to JSON array
- **Enhanced JSON fields**: Better structure for complex data

The database schema is now complete and production-ready for a professional music distribution platform!
