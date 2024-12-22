const sinon = require('sinon');
const Database = require('better-sqlite3');
const { checkTemperatureLimits } = require('../database'); // Import the function

describe('checkTemperatureLimits', () => {
  let dbMock;

  beforeEach(() => {
    dbMock = sinon.mock(Database.prototype);
  });

  afterEach(() => {
    dbMock.restore();
  });

  it('Should log "tempLimitLow" when the boiler temperature is below 72', () => {
    const insertStub = dbMock.expects('prepare').once().withArgs('INSERT INTO temperature_limit_error(error_type) VALUES (?)').returns({
      run: sinon.stub()
    });

    checkTemperatureLimits(71);

    insertStub.verify();
  });

  it('Should log "tempLimitHigh" when the boiler temperature is above 98', () => {
    const insertStub = dbMock.expects('prepare').once().withArgs('INSERT INTO temperature_limit_error(error_type) VALUES (?)').returns({
      run: sinon.stub()
    });

    checkTemperatureLimits(99);

    insertStub.verify();
  });
});

