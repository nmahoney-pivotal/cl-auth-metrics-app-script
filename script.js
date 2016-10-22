function getTeamMembers(spreadsheet, logger) {
  var teamMembersSheet = spreadsheet.getSheetByName('Team Members');
  var teamMembers = [];
  var lastRow = teamMembersSheet.getLastRow();
  for (var row = 1; row <= lastRow; row++) {
    var name = teamMembersSheet.getRange(row, 1).getDisplayValue();
    var role = teamMembersSheet.getRange(row, 2).getDisplayValue();
    if (name == null || name.length === 0) {
      logger.log('No name found in the first column of row ' + row + '. Skipping...');
      continue;
    }
    switch (role) {
      case null:
      case '':
        logger.log('No role found in the second column of row ' + row + ' (name: "' + name + '"). Skipping...');
        continue;
      case 'pm':
      case 'dev':
        break;
      default:
        logger.log('Invalid role found in the second column of row ' + row + ' (name: "' + name + '"). Skipping...');
        continue;
    }
    teamMembers.push({ name: name, role: role });
  }
  return teamMembers;
}

