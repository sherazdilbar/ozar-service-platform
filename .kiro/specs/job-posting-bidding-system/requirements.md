# Requirements Document: Job Posting & Bidding System

## Introduction

The Job Posting & Bidding System is a reverse marketplace feature for the Ozar platform that enables customers to post job requests and allows professionals to submit competitive bids. This complements the existing direct-booking system by providing an alternative workflow where customers describe their needs and professionals compete to win the work.

## Glossary

- **Customer**: A user who posts job requests and accepts bids from professionals
- **Professional**: A service provider who browses jobs and submits bids
- **Job_Post**: A customer's request for service including description, budget, and requirements
- **Bid**: A professional's proposal to complete a job including price and timeline
- **Job_System**: The complete bidding and job posting system
- **Booking_System**: The existing direct booking system that handles accepted jobs
- **Notification_System**: The existing notification infrastructure
- **Chat_System**: The existing messaging system between users
- **Service_Area**: The geographic region where a professional offers services
- **Category**: A service classification (e.g., plumbing, electrical, cleaning)

## Requirements

### Requirement 1: Job Post Creation

**User Story:** As a customer, I want to create detailed job posts, so that professionals can understand my needs and submit relevant bids.

#### Acceptance Criteria

1. WHEN a customer creates a job post, THE Job_System SHALL require title, description, category, and location
2. WHEN a customer creates a job post, THE Job_System SHALL accept optional budget range, photos, and urgency level
3. WHEN a job post is created with valid data, THE Job_System SHALL save it with status OPEN
4. WHEN a job post is created, THE Job_System SHALL validate that the category exists in the system
5. WHEN a job post is created, THE Job_System SHALL validate that the location is within supported service areas
6. WHEN a job post is saved, THE Job_System SHALL return the complete job post with generated ID and timestamp

### Requirement 2: Job Post Management

**User Story:** As a customer, I want to manage my job posts, so that I can keep them current and close them when no longer needed.

#### Acceptance Criteria

1. WHEN a customer views their job posts, THE Job_System SHALL display all posts with current status and bid counts
2. WHEN a customer edits an OPEN job post, THE Job_System SHALL update the job details and preserve existing bids
3. WHEN a customer closes a job post, THE Job_System SHALL change status to CLOSED and notify all bidding professionals
4. WHEN a customer deletes a job post with no accepted bids, THE Job_System SHALL remove it and notify bidding professionals
5. IF a customer attempts to delete a job post with an accepted bid, THEN THE Job_System SHALL prevent deletion and return an error
6. WHEN a job post status changes, THE Job_System SHALL update the timestamp for last modification

### Requirement 3: Job Discovery

**User Story:** As a professional, I want to browse relevant job posts, so that I can find opportunities matching my skills and service area.

#### Acceptance Criteria

1. WHEN a professional browses jobs, THE Job_System SHALL display only OPEN jobs matching their service categories
2. WHEN a professional browses jobs, THE Job_System SHALL display only jobs within their service area
3. WHEN displaying job posts, THE Job_System SHALL show title, description, budget range, location, urgency, and bid count
4. WHEN a professional filters jobs by category, THE Job_System SHALL return only jobs in the selected category
5. WHEN a professional filters jobs by budget range, THE Job_System SHALL return only jobs within the specified range
6. WHEN a professional sorts jobs, THE Job_System SHALL support sorting by date posted, urgency, and budget

### Requirement 4: Bid Submission

**User Story:** As a professional, I want to submit competitive bids on jobs, so that I can win work from customers.

#### Acceptance Criteria

1. WHEN a professional submits a bid, THE Job_System SHALL require proposed price, estimated timeline, and message
2. WHEN a bid is submitted for an OPEN job, THE Job_System SHALL save it with status PENDING
3. WHEN a bid is submitted, THE Job_System SHALL validate that the professional's categories match the job category
4. WHEN a bid is submitted, THE Job_System SHALL validate that the professional's service area includes the job location
5. IF a job already has 10 bids, THEN THE Job_System SHALL reject new bids and return an error
6. IF a professional has already bid on a job, THEN THE Job_System SHALL reject duplicate bids and return an error
7. WHEN a bid is saved, THE Job_System SHALL notify the customer immediately

### Requirement 5: Bid Management

**User Story:** As a professional, I want to manage my submitted bids, so that I can update pricing or withdraw from jobs I can no longer accept.

#### Acceptance Criteria

1. WHEN a professional views their bids, THE Job_System SHALL display all bids with job details and current status
2. WHEN a professional edits a PENDING bid, THE Job_System SHALL update the bid details and notify the customer
3. WHEN a professional withdraws a PENDING bid, THE Job_System SHALL change status to WITHDRAWN and notify the customer
4. IF a professional attempts to edit an ACCEPTED bid, THEN THE Job_System SHALL prevent modification and return an error
5. IF a professional attempts to withdraw an ACCEPTED bid, THEN THE Job_System SHALL prevent withdrawal and return an error

### Requirement 6: Bid Review and Acceptance

**User Story:** As a customer, I want to review and compare bids, so that I can select the best professional for my job.

#### Acceptance Criteria

1. WHEN a customer views bids for their job, THE Job_System SHALL display all PENDING bids with professional profiles
2. WHEN displaying bids, THE Job_System SHALL show proposed price, timeline, message, professional rating, and review count
3. WHEN a customer accepts a bid, THE Job_System SHALL change bid status to ACCEPTED and job status to ACCEPTED
4. WHEN a bid is accepted, THE Job_System SHALL change all other PENDING bids to REJECTED
5. WHEN a bid is accepted, THE Job_System SHALL notify the winning professional immediately
6. WHEN a bid is accepted, THE Job_System SHALL notify all rejected professionals
7. WHEN a bid is accepted, THE Job_System SHALL create a booking in the Booking_System with job and bid details

### Requirement 7: Job Lifecycle Management

**User Story:** As the system, I want to manage job post lifecycle states, so that jobs progress through proper stages from posting to completion.

#### Acceptance Criteria

1. WHEN a job post is created, THE Job_System SHALL set initial status to OPEN
2. WHEN a bid is accepted, THE Job_System SHALL change job status from OPEN to ACCEPTED
3. WHEN work begins on an accepted job, THE Job_System SHALL change status from ACCEPTED to IN_PROGRESS
4. WHEN work is completed, THE Job_System SHALL change status from IN_PROGRESS to COMPLETED
5. WHEN a completed job is reviewed, THE Job_System SHALL change status from COMPLETED to REVIEWED
6. IF a job is closed before acceptance, THEN THE Job_System SHALL change status from OPEN to CLOSED
7. WHEN job status changes, THE Job_System SHALL validate the transition is allowed and reject invalid transitions

### Requirement 8: Real-Time Notifications

**User Story:** As a user, I want to receive immediate notifications about job and bid activities, so that I can respond quickly to opportunities and updates.

#### Acceptance Criteria

1. WHEN a new job is posted, THE Job_System SHALL notify all professionals with matching category and service area
2. WHEN a professional submits a bid, THE Job_System SHALL notify the job post owner immediately
3. WHEN a customer accepts a bid, THE Job_System SHALL notify the winning professional immediately
4. WHEN a customer accepts a bid, THE Job_System SHALL notify all rejected bidders
5. WHEN a professional edits their bid, THE Job_System SHALL notify the customer
6. WHEN a professional withdraws a bid, THE Job_System SHALL notify the customer
7. WHEN a customer closes a job post, THE Job_System SHALL notify all bidding professionals

### Requirement 9: Chat Integration

**User Story:** As a user, I want to communicate with potential partners about jobs, so that I can clarify requirements and negotiate terms.

#### Acceptance Criteria

1. WHEN a professional bids on a job, THE Job_System SHALL enable chat between the professional and customer
2. WHEN a customer views a bid, THE Job_System SHALL provide access to chat with that professional
3. WHEN initiating chat from a job context, THE Chat_System SHALL include job post details in the conversation
4. WHEN initiating chat from a bid context, THE Chat_System SHALL include bid details in the conversation

### Requirement 10: Data Integrity and Validation

**User Story:** As the system, I want to enforce data integrity rules, so that the job posting and bidding process remains reliable and consistent.

#### Acceptance Criteria

1. WHEN any job or bid operation occurs, THE Job_System SHALL validate user authentication and authorization
2. WHEN a customer accesses a job post, THE Job_System SHALL verify they own the post or return an error
3. WHEN a professional accesses a bid, THE Job_System SHALL verify they own the bid or return an error
4. WHEN a job post is deleted, THE Job_System SHALL cascade delete all associated PENDING bids
5. WHEN a professional account is deactivated, THE Job_System SHALL withdraw all their PENDING bids
6. WHEN a customer account is deactivated, THE Job_System SHALL close all their OPEN job posts

### Requirement 11: Search and Filtering

**User Story:** As a professional, I want to search and filter jobs efficiently, so that I can quickly find the most relevant opportunities.

#### Acceptance Criteria

1. WHEN a professional searches jobs by keyword, THE Job_System SHALL search title and description fields
2. WHEN a professional filters by multiple categories, THE Job_System SHALL return jobs matching any selected category
3. WHEN a professional filters by budget range, THE Job_System SHALL return jobs where the budget overlaps the filter range
4. WHEN a professional filters by urgency, THE Job_System SHALL return jobs matching the selected urgency level
5. WHEN a professional filters by location radius, THE Job_System SHALL return jobs within the specified distance
6. WHEN multiple filters are applied, THE Job_System SHALL return jobs matching all filter criteria

### Requirement 12: Budget and Pricing

**User Story:** As a user, I want to work with flexible budget and pricing options, so that I can negotiate fair rates for services.

#### Acceptance Criteria

1. WHEN a customer creates a job post, THE Job_System SHALL accept budget as a range with minimum and maximum values
2. WHERE a customer provides a budget range, THE Job_System SHALL display it to professionals viewing the job
3. WHEN a professional submits a bid, THE Job_System SHALL accept any positive price value regardless of budget range
4. WHEN displaying bids, THE Job_System SHALL indicate whether the bid price falls within the posted budget range
5. WHERE no budget range is provided, THE Job_System SHALL display "Budget not specified" to professionals

### Requirement 13: Photo and Media Management

**User Story:** As a customer, I want to attach photos to my job posts, so that professionals can better understand the work required.

#### Acceptance Criteria

1. WHEN a customer creates a job post, THE Job_System SHALL accept up to 10 photos
2. WHEN photos are uploaded, THE Job_System SHALL validate file types are images (JPEG, PNG, WebP)
3. WHEN photos are uploaded, THE Job_System SHALL validate each file is under 10MB
4. WHEN a job post is saved with photos, THE Job_System SHALL store photo URLs with the job post
5. WHEN a job post is deleted, THE Job_System SHALL delete all associated photos from storage
6. WHEN displaying a job post, THE Job_System SHALL return photo URLs in the order they were uploaded

### Requirement 14: Analytics and Metrics

**User Story:** As a user, I want to see relevant metrics about my jobs and bids, so that I can make informed decisions.

#### Acceptance Criteria

1. WHEN a customer views a job post, THE Job_System SHALL display the number of bids received
2. WHEN a customer views a job post, THE Job_System SHALL display the average bid price
3. WHEN a customer views a job post, THE Job_System SHALL display time since posting
4. WHEN a professional views their bid history, THE Job_System SHALL display acceptance rate
5. WHEN a professional views their bid history, THE Job_System SHALL display average time to acceptance
6. WHEN a professional views a job post, THE Job_System SHALL display the number of existing bids
