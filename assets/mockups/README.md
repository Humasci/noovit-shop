# Bottle photo template

`bottle-photo.jpg` is Supliful's blank 60-capsule bottle product photo (from their catalog, provided for sellers' mockups),
resized to 1024×1024, with the two stock capsules in front edited out. Every brand on this bottle shows the same
capsules, so we leave them out of our images.

To rebuild it from the supplier photo (resized to 1024 px, capsules still in it):

    node scripts/remove-mockup-capsules.mjs supplier-bottle-1024.jpg assets/mockups/bottle-photo.jpg

The script rebuilds the bottle's lower-right corner from the bottle itself (each column's colour from just above the
capsules, shaded like the mirrored left side) and the floor from clean floor on the same row. Its coordinates are
for this photo only.

`lib/labels/photo.ts` wraps our label onto it. If the template changes, re-measure the bottle centre, radius and label
top/bottom in that file and bump `MOCKUP_VERSION` in `lib/labels/svg.ts`.
