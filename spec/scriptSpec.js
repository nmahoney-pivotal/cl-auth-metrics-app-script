describe('functions', function() {
  beforeEach(function() {
    this.clAuthMetricsSpreadsheet = jasmine.createSpyObj('clAuthMetricsSpreadsheet', ['getSheetByName', 'copy']);
    this.logger = jasmine.createSpyObj('logger', ['log']);
    this.teamMembers = [
      { name: 'product manager', role: 'pm' },
      { name: 'developer one', role: 'dev' },
      { name: 'developer two', role: 'dev' },
    ];
  });

  describe('.getTeamMembers', function() {
    beforeEach(function() {
      this.teamMembersSheet = jasmine.createSpyObj('teamMemberSheet', ['getRange', 'getLastRow']);
      this.pmNameRange = jasmine.createSpyObj('pmNameRange', ['getDisplayValue']);
      this.devOneNameRange = jasmine.createSpyObj('devOneNameRange', ['getDisplayValue']);
      this.devTwoNameRange = jasmine.createSpyObj('devTwoNameRange', ['getDisplayValue']);
      this.designerNameRange = jasmine.createSpyObj('designerNameRange', ['getDisplayValue']);
      this.noRoleNameRange = jasmine.createSpyObj('noRoleNameRange', ['getDisplayValue']);
      this.noNameDevNameRange = jasmine.createSpyObj('noNameDevNameRange', ['getDisplayValue']);
      this.noNameOrRoleNameRange = jasmine.createSpyObj('noNameOrRoleNameRange', ['getDisplayValue']);
      this.pmRoleRange = jasmine.createSpyObj('pmRoleRange', ['getDisplayValue']);
      this.devOneRoleRange = jasmine.createSpyObj('devOneRoleRange', ['getDisplayValue']);
      this.devTwoRoleRange = jasmine.createSpyObj('devTwoRoleRange', ['getDisplayValue']);
      this.designerRoleRange = jasmine.createSpyObj('designerRoleRange', ['getDisplayValue']);
      this.noRoleRoleRange = jasmine.createSpyObj('noRoleRoleRange', ['getDisplayValue']);
      this.noNameDevRoleRange = jasmine.createSpyObj('noNameDevRoleRange', ['getDisplayValue']);
      this.noNameOrRoleRoleRange = jasmine.createSpyObj('noNameOrRoleRoleRange', ['getDisplayValue']);

      this.clAuthMetricsSpreadsheet.getSheetByName.and.returnValue(this.teamMembersSheet);
      var teamMemberSheetData = [
        { nameRange: this.pmNameRange, roleRange: this.pmRoleRange },
        { nameRange: this.devOneNameRange, roleRange: this.devOneRoleRange },
        { nameRange: this.devTwoNameRange, roleRange: this.devTwoRoleRange },
        { nameRange: this.designerNameRange, roleRange: this.designerRoleRange },
        { nameRange: this.noRoleNameRange, roleRange: this.noRoleRoleRange },
        { nameRange: this.noNameDevNameRange, roleRange: this.noNameDevRoleRange },
        { nameRange: this.noNameOrRoleNameRange, roleRange: this.noNameOrRoleRoleRange },
      ];
      this.teamMembersSheet.getLastRow.and.returnValue(teamMemberSheetData.length);
      this.teamMembersSheet.getRange.and.callFake(function(row, column) {
        switch (column) {
          case 1:
            return teamMemberSheetData[row-1].nameRange;
          case 2:
            return teamMemberSheetData[row-1].roleRange;
          default:
            throw 'teamMemberSheet.getRange called with unexpected arguments:\nrow: ' + row + '\ncolumn: ' + column;
        }
      })
      this.pmNameRange.getDisplayValue.and.returnValue('product manager');
      this.devOneNameRange.getDisplayValue.and.returnValue('developer one');
      this.devTwoNameRange.getDisplayValue.and.returnValue('developer two');
      this.designerNameRange.getDisplayValue.and.returnValue('designer (not supported)');
      this.noRoleNameRange.getDisplayValue.and.returnValue('no role');
      this.noNameDevNameRange.getDisplayValue.and.returnValue('');
      this.noNameOrRoleNameRange.getDisplayValue.and.returnValue('');
      this.pmRoleRange.getDisplayValue.and.returnValue('pm');
      this.devOneRoleRange.getDisplayValue.and.returnValue('dev');
      this.devTwoRoleRange.getDisplayValue.and.returnValue('dev');
      this.designerRoleRange.getDisplayValue.and.returnValue('des');
      this.noRoleRoleRange.getDisplayValue.and.returnValue('');
      this.noNameDevRoleRange.getDisplayValue.and.returnValue('dev');
      this.noNameOrRoleRoleRange.getDisplayValue.and.returnValue('');
    });

    it('gets the "Team Members" Sheet', function() {
      functions.getTeamMembers(this.clAuthMetricsSpreadsheet, this.logger);
      expect(this.clAuthMetricsSpreadsheet.getSheetByName).toHaveBeenCalledWith('Team Members');
    });

    it('returns the team members from the "Team Members" Sheet', function() {
      expect(functions.getTeamMembers(this.clAuthMetricsSpreadsheet, this.logger)).toEqual(this.teamMembers);
    });

    it('logs invalid "Team Member" Sheet data', function() {
      functions.getTeamMembers(this.clAuthMetricsSpreadsheet, this.logger);
      expect(this.logger.log).toHaveBeenCalledTimes(4);
      expect(this.logger.log).toHaveBeenCalledWith('Invalid role found in the second column of row 4 (name: "designer (not supported)"). Skipping...');
      expect(this.logger.log).toHaveBeenCalledWith('No role found in the second column of row 5 (name: "no role"). Skipping...');
      expect(this.logger.log).toHaveBeenCalledWith('No name found in the first column of row 6. Skipping...');
      expect(this.logger.log).toHaveBeenCalledWith('No name found in the first column of row 7. Skipping...');
    });
  });

  describe('.createTeamMemberSheets', function() {
    it('copies the appropriate template for each team member', function() {
      spyOn(functions, 'getTeamMembers').and.returnValue(this.teamMembers);
      this.pmSheet = jasmine.createSpyObj('pmSheet', ['setName']);
      this.devOneSheet = jasmine.createSpyObj('devOneSheet', ['setName']);
      this.devTwoSheet = jasmine.createSpyObj('devTwoSheet', ['setName']);
      this.clAuthMetricsSpreadsheet.copy.and.returnValues(this.pmSheet, this.devOneSheet, this.devTwoSheet);
      functions.createTeamMemberSheets(this.clAuthMetricsSpreadsheet, this.logger);
      expect(functions.getTeamMembers).toHaveBeenCalledWith(this.clAuthMetricsSpreadsheet, this.logger);
      expect(this.clAuthMetricsSpreadsheet.copy.calls.argsFor(0)).toEqual(['PM Template']);
      expect(this.clAuthMetricsSpreadsheet.copy.calls.argsFor(1)).toEqual(['Dev Template']);
      expect(this.clAuthMetricsSpreadsheet.copy.calls.argsFor(2)).toEqual(['Dev Template']);
      expect(this.pmSheet.setName).toHaveBeenCalledWith(this.teamMembers[0].name);
      expect(this.devOneSheet.setName).toHaveBeenCalledWith(this.teamMembers[1].name);
      expect(this.devTwoSheet.setName).toHaveBeenCalledWith(this.teamMembers[2].name);
    });
  });
});

