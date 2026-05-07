# Security Spec: NutriAI Intelligence

## 1. Data Invariants
- A UserProfile can only be created by the authenticated user with a matching UID.
- A DailyLog or MealPlan must belong to a valid UserProfile.
- Users can only read/write their own data.

## 2. The "Dirty Dozen" Payloads (Attacks)
1. **Identity Spoofing**: Attempt to create a profile for `victim_uid` using `attacker_uid` token.
2. **Key Injection**: Attempt to add `isAdmin: true` to UserProfile.
3. **Orphaned Write**: Attempt to create a MealPlan for a non-existent userId.
4. **ID Poisoning**: Use a 2KB string as a `logId`.
5. **PII Leak**: Attempt to list all users as an authenticated but unrelated user.
6. **Cross-User Update**: Attempt to update another user's DailyLog.
7. **Type Mismatch**: Send `calories: "many"` (string) instead of a number.
8. **Shadow Field**: Send `secret_token: "xyz"` in UserProfile.
9. **Terminal Lock Bypass**: (If applicable) Update a log after a specific "locked" status.
10. **Array Explosion**: Send a `diseases` array with 1 million elements.
11. **Timestamp Spoofing**: Provide a `createdAt` in the past manually.
12. **Anonymous Access**: Attempt to write without being signed in.

## 3. Test Runner Concept
The `firestore.rules` will be designed to deny all of the above.
