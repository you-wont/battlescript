"use strict";

describe('battlescript.services Auth', function () {

  beforeEach(module('battlescript'));

  var Auth;

  beforeEach(inject(function (_Auth_) {
    Auth = _Auth_;
  }));

  it('should have a signin function', function() {
    expect(Auth.signin).toBeDefined();
  });

  it('should have a signup function', function() {
    expect(Auth.signup).toBeDefined();
  });

  it('should have a isAuth function', function() {
    expect(Auth.isAuth).toBeDefined();
  });

  it('should have a signout function', function() {
    expect(Auth.signout).toBeDefined();
  });

});

describe('battlescript.services Users', function () {

  beforeEach(module('battlescript'));

  var Users;

  beforeEach(inject(function (_Users_) {
    Users = _Users_;
  }));

  it('should have a getAuthUser function', function() {
    expect(Users.getAuthUser).toBeDefined();
  });

  it('should have a getStats function', function() {
    expect(Users.getStats).toBeDefined();
  });

  it('should have a statChange function', function() {
    expect(Users.statChange).toBeDefined();
  });

  it('should have a getLeaderboard function', function() {
    expect(Users.getLeaderboard).toBeDefined();
  });

});

describe('battlescript.services Socket', function () {

  beforeEach(module('battlescript'));

  var Socket;

  beforeEach(inject(function (_Socket_) {
    Socket = _Socket_;
  }));

  it('should have a createSocket function', function() {
    expect(Socket.createSocket).toBeDefined();
  });

});

describe('battlescript.services Notifications', function () {

  beforeEach(module('battlescript'));

  var Notifications;

  beforeEach(inject(function (_Notifications_) {
    Notifications = _Notifications_;
  }));

  it('should be an object', function() {
    expect(typeof Notifications).toBe('object');
  });

});

describe('battlescript.services Battle', function () {

  beforeEach(module('battlescript'));

  var Battle;

  beforeEach(inject(function (_Battle_) {
    Battle = _Battle_;
  }));

  it('should have a isValidBattleRoom function', function() {
    expect(Battle.isValidBattleRoom).toBeDefined();
  });

  it('should have a getBattle function', function() {
    expect(Battle.getBattle).toBeDefined();
  });

  it('should have a attemptBattle function', function() {
    expect(Battle.attemptBattle).toBeDefined();
  });

});

describe('battlescript.services Editor', function () {

  beforeEach(module('battlescript'));

  var Editor;

  beforeEach(inject(function (_Editor_) {
    Editor = _Editor_;
  }));

  it('should have a isValidEditorRoom function', function() {
    expect(Editor.makeEditor).toBeDefined();
  });

});
