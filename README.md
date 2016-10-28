#Google Apps Script for CLAuthMetricsSpreadsheet

###Setup
1. Clone the repo and `cd` into it.
2. Run `npm install`.
3. Run the Jasmine tests with `npm test`.

###Running the script
1. Open the spreadsheet.
2. Open the script editor by selecting `Tools > Script editor...`.
3. Run `./generate_script.sh` from the project's root directory.
4. Run `cat script.gs | pbcopy` and paste it into the script editor.
5. Select the play button or `Run > createClAuthMetricsSheets`.

###What the script does
Currently, the script will read team members from a sheet called "Team Members" with one row per team member. The first column should contain the team member's name, and the second column should contain their role (either `pm` or `dev`). For each member, the script will copy the appropriate template sheet (`pm`: "PM Template", `dev`: "Dev Template") and give it the team member's name.

###Further work
The next step is probably to generate/update the "Rollup" sheet. Talk to me (Nick Mahoney) or email me at nmahoney@pivotal.io if you want my thoughts on ways to do that.
