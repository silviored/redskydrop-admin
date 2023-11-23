import * as GlobalTypes from '@/contexts/global-state/types';

class TokenValidityProvider {
  private _logout: GlobalTypes.GlobalState['logout'] = () => {
    //
  };

  get logout() {
    return this._logout;
  }

  set logout(fn: GlobalTypes.GlobalState['logout']) {
    this._logout = fn;
  }
}

const TokenValidityService = new TokenValidityProvider();

export default TokenValidityService;
