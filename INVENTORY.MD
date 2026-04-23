Core Concept: Templates vs Snapshots

Your system has two different types of data:

1️⃣ Templates (Admin Inventory)

These are reusable definitions:

Room: “Bedroom”

Item: “Queen Bed”

Item volume: 45 cu ft

Special handling: false

These live in:

rooms

items

They are editable at any time by admin.

2️⃣ Snapshots (Per Request)

A request represents a real customer quote.

If admin later changes:

Queen Bed volume from 45 → 60

Marks it special_handling = true

Deletes the item

You DO NOT want old quotes to change.

That would:

Break historical data

Change price after customer signed

Corrupt invoices

Create legal problems

So you copy the data at the time of quoting.

That’s why we have:

request_rooms

request_items

They are frozen snapshots.

🏗 Why Not Just Reference items Directly?

If request_items only had:

t.references :item

And volume was calculated from:

item.volume \* quantity

Then:

Admin edits volume → ALL old quotes change.

Admin deletes item → historical requests break.

Admin renames item → past move paperwork changes.

That’s unacceptable in a business CRM.
