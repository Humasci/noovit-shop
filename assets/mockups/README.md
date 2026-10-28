# Bottle photo template

`bottle-photo.jpg` is Supliful's blank 60-capsule bottle product photo (from their catalog, provided for sellers' mockups), resized to 1024×1024.
`bottle-photo-mask.png` is white on the bottle and black on the capsules in front, so the label never covers them.

`lib/labels/photo.ts` wraps our label onto it. If the template changes, re-measure the bottle centre, radius and label
top/bottom in that file and bump `MOCKUP_VERSION` in `lib/labels/svg.ts`.
