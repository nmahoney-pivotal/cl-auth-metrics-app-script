describe("The CLAuth Metrics Google Apps Script", function() {
  describe("with Google services mocked out", function() {
    var SpreadsheetApp = jasmine.createSpyObj('SpreadsheetApp', ['getActiveSpreadsheet']);
    var clAuthMetricsSpreadsheet = jasmine.createSpyObj('clAuthMetricsSpreadsheet', ['getSheetByName']);
    var teamMembersSheet = jasmine.createSpyObj('teamMemberSheet', ['getLastRow', 'getRange']);

    var teamMembers = [
      { name: "the pm", role: "pm" },
      { name: "first developer", role: "dev" },
      { name: "second developer", role: "dev" },
      { name: "designer (not supported)", role: "des" },
      { name: "no role (not supported)", role: "" },
      { name: "", role: "dev" }
    ]

    SpreadsheetApp.getActiveSpreadsheet.and.returnValue(clAuthMetricsSpreadsheet);
    clAuthMetricsSpreadsheet.getSheetByName.and.callFake(
      function(name) {
        switch (name) {
          case 'Team Members':
            return teamMembersSheet;
          default:
            throw "Spreadsheet.getSheetByName was called with an unexpected sheet name";
        }
      }
    );
    teamMembersSheet.getLastRow.and.returnValue(teamMembers.length);
    teamMembersSheet.getRange.and.callFake(
      function(row, column) {
        switch (column) {
          case 1:
            return teamMembers[row].name;
          case 2:
            return teamMembers[row].role;
          default:
            throw "teamMembersSheet.getRange received an unexpected column index: " + column;
        }
      }
    );

    it("runs without throwing an exception", function() {
      expect(function() {
        createTeamMemberSheets(SpreadsheetApp)
      }).not.toThrow();
    });
  });
});
