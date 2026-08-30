
Compare the image size of the single-stage approach vs the multi-stage approach. Run:

docker build --target builder -t jobportal-single . && docker images jobportal-single
docker build -t jobportal-multi . && docker images jobportal-multi
Record both sizes. Write down why the smaller image matters in production (startup time, registry bandwidth, attack surface).

jobportal-single	1.85GB	Full build (source + dev deps)
jobportal-multi	763MB	Production-ready (only dist + prod deps)

The smaller image matters because its faster to load, process, better bandwidth, and the attack surface is smaller as we dont have development files or source code in that image.

---

The migrate service runs SQL files in alphabetical order. What would happen if a developer named a new migration 009_add_column.sql but a file 010_something.sql already exists that depends on the new column? Write down the failure mode and explain how the naming convention prevents it.

This can result in failure as 009 could be creating the same table as the 010 but with different settings or could be editing tables from 010 before they are even created, the naming convention is a prefix with numbers and the .sql files are executed in order. So if we are to create a new .sql migration file its number should be greater then the prev ones.