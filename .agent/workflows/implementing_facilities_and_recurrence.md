---
description: How to implement gym facilities and enhance class recurrence
---

# Gym Facilities & Recurrence Implementation Plan

This plan outlines the steps to add facility management for gyms and enhance the gym class creation process with recurrence and facility selection.

## 1. Backend: Facility Schema & Gym Updates

### Goal: Allow gyms to have multiple facilities (rooms, zones, etc.)

- [ ] Update `backend/src/modules/gym/gym.schema.ts`:
  - Add `facilities` property to `GymModel` (array of objects: `_id`, `name`, `capacity`, `description`).
- [ ] Update `packages/client/src/types/gym.ts`:
  - Define `Facility` interface.
  - Update `Gym` interface to include `facilities: Facility[]`.
- [ ] Update `backend/src/modules/gym/gym.service.ts`:
  - Add methods for adding, updating, and removing facilities.
- [ ] Update `backend/src/modules/gym/gym.controller.ts`:
  - Add endpoints for facility management (nested under gym or context-aware).

## 2. Backend: Gym Class Facility Support

### Goal: Link classes to specific facilities

- [ ] Update `backend/src/modules/gymClass/gymClass.schema.ts`:
  - Add `facilityId: string`.
- [ ] Update `packages/client/src/dto/gymClass.ts`:
  - Add `facilityId` to `CreateGymClassDto` and `UpdateGymClassDto`.
- [ ] Update `backend/src/modules/gymClass/gymClass.service.ts`:
  - Handle `facilityId` during creation and update.
  - (Optional) Add availability validation for facilities (like coach availability).

## 3. Frontend: Facilities Management UI

### Goal: Allow managers to manage facilities in settings

- [ ] Create `FacilitiesTab.tsx` in `web/src/app/pages/main/gym/manager/settings/components/`.
- [ ] Register the new tab in `SettingsPage.tsx`.
- [ ] Implement CRUD UI for facilities.

## 4. Frontend: Gym Class Modal Enhancements

### Goal: Improve class creation with recurrence and facility selection

- [ ] Update `web/src/app/pages/main/gym/manager/classes/components/GymClassModal.tsx`:
  - Add `recurrence` fields (Type: Daily, Weekly, Custom; End Date; Days of Week).
  - Add "Facility" selector (fetch facilities from the current gym).
- [ ] Update hooks and state in the modal to handle these new fields.

## 5. Summary & Testing

- [ ] Verify facility creation.
- [ ] Verify class creation with a specific facility.
- [ ] Verify recurring classes are created correctly.
- [ ] Ensure the calendar/schedule views display the facility name.
