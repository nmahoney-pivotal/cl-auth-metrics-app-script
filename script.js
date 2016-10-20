function createTeamMemberSheets(spreadsheetApp) {
  var clAuthMetricsSpreadsheet = spreadsheetApp.getActiveSpreadsheet();
  var teamMembers = getTeamMembers(spreadsheetApp);
  
  for (var i = 0; i < teamMembers.length; i++) {
    var teamMember = teamMembers[i];
    var oldSheet = clAuthMetricsSpreadsheet.getSheetByName(teamMember.name);
    if (oldSheet != null) {
      // Skip team members with existing sheets
      continue;
      
      // OR
      
      // Overwrite existing sheets
      // clAuthMetricsSpreadsheet.deleteSheet(oldSheet);
    }
    var newSheet;
    switch (teamMember.role.toLowerCase()) {
      case "pm":
        var pmTemplateSheet = getNonNullSheetByName(clAuthMetricsSpreadsheet, "PM Template");
        newSheet = pmTemplateSheet.copyTo(clAuthMetricsSpreadsheet);
        break;
      case "dev":
        var devTemplateSheet = getNonNullSheetByName(clAuthMetricsSpreadsheet, "Dev Template");
        newSheet = devTemplateSheet.copyTo(clAuthMetricsSpreadsheet);
        break;
      default:
        Logger.log("Role must be either 'pm' or 'dev'. Found '" + teamMember.role + "'. No sheet will be created for '" + teamMember.name + "'.");
        continue;
    }
    newSheet.setName(teamMember.name)
  }
}

function createRollupSheet(teamMembers) {
  var clAuthMetricsSpreadsheet = spreadsheetApp.getActiveSpreadsheet();
  var rollupTemplateSheet = getNonNullSheetByName(clAuthMetricsSpreadsheet, "Rollup Template");
  
  for (var teamMember in teamMembers) {
    
  }
}

function getTeamMembers(spreadsheetApp) {
  var clAuthMetricsSpreadsheet = spreadsheetApp.getActiveSpreadsheet();
  var teamMembersSheet = getNonNullSheetByName(clAuthMetricsSpreadsheet, "Team Members");
  var teamMembers = [];
  
  var lastRow = teamMembersSheet.getLastRow();
  for (var teamMemberRow = 1; teamMemberRow <= lastRow; teamMemberRow++) {
    var memberName = teamMembersSheet.getRange(teamMemberRow, 1).getDisplayValue();
    var memberRole = teamMembersSheet.getRange(teamMemberRow, 2).getDisplayValue();
    if (memberName == null || memberName === "") {
      Logger.log("The first column of row " + teamMemberRow + " is empty. It should contain the team member's name. Skipping this row.");
      continue;
    }
    if (memberRole == null || memberRole === "") {
      Logger.log("The second column of row " + teamMemberRow + " is empty. It should contain the team member's role. Skipping this row.");
      continue;
    }
    teamMembers.push({ name: memberName, role: memberRole });
  }
  return teamMembers;
}

function getNonNullSheetByName(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (sheet == null) {
    throw "Could not find necessary sheet: " + name + ". Aborting...";
  }
  return sheet;
}

