const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLogged in', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test('next to be called when isLogged in is true', () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test('res status 404 with "Login required need to be called when is Logged in is False', () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith('Login required');
  });
});


describe('is Not Logged in', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test('next to be called once when not logged in', () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test('res.status called with 404, res.redirect called with error when not logged in', () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    };
    const message = encodeURIComponent('로그인한 상태입니다.');
    isNotLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
});