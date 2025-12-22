-- Migration: Update application status values
-- Date: 2025-12-22
-- Description: Convert old status values (pending, approved, rejected) to new status values (pending, in_progress, completed, terminated)

-- Step 1: Convert existing status values
UPDATE applications 
SET status = CASE 
    WHEN status = 'approved' THEN 'in_progress'
    WHEN status = 'rejected' THEN 'terminated'
    ELSE status -- 'pending' remains 'pending'
END
WHERE status IN ('approved', 'rejected', 'pending');

-- Step 2: Verify the migration
-- Run this query to check the status distribution after migration:
-- SELECT status, COUNT(*) as count FROM applications GROUP BY status;
