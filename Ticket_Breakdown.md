# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

<br />
<br />

------

<br />
<br />


## Ticket 1: Create a new table to assocaite agents with facilities

Acceptance Criteria:

- We need to be able to pull `custom_agent_id` values by Facility from a new table.
- Facilities need to be able to customize the `custom_agent_id` field and store that data on this table.
- We need a primary key, `internal_agent_id`, `facility_id`, and `custom_agent_id` field.

Time/effort estimate: 2 hours

Implementation details:
- Create a new FacilityAgentIds table
- Add `internal_agent_id`, `facility_id`, and `custom_agent_id` columns

<br />
<br />

## Ticket 2: Update the report generation function to use custom agent ids

Acceptance Criteria:

- When generating a report, use the `custom_agent_id` field from the Shift table and join the Agents table to get the rest of the agent metadata
- If a `custom_agent_id` is not set for an Agent, fall back to using the internal database id.

Time/effort estimate: 1-3 hours

Implementation details:

- Update the report generation function to use the `custom_agent_id` field from the Shifts table to identify Agents.
- Modify the query in `getShiftsByFacility` to associate agent metadata pulled using the internal agent id with the new `custom_agent_id`.

<br />
<br />

## Ticket 3: Update the Agent `create` and `update` endpoints to allow custom ids to be set

Acceptance Criteria:

- Add a `custom_agent_id` field to the Agent creation and update endpoints.
- If a `custom_agent_id` is provided, validate that it's unique within this Facilities.
- Add appropriate error messages if the `custom_agent_id` is not unique within this Facility or is otherwise invalid.

Time/effort estimate: 2-4 hours

Implementation details:

- Update any Agent create and update endpoints to include the `custom_agent_id` field.
- Modify the validation logic - `custom_agent_id` only needs to be unique within a Facility.
