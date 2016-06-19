import jwtDecode from 'jwtDecode';
import HttpTransport from 'lokkaTransportHttp';

// if the token expires within the next N ms
// it will be refreshed immediately.
const MIN_REFRESH_TIMEOUT = 1000 * 60;

// if the token is not available, the job will
// wait for this number of milliseconds
const MAX_JOB_WAIT_TIME = 1000 * 10;
const ERR_JOB_TIMEOUT = new Error('job timeout');


export default class Transport {
  constructor(endpoint, arg2, arg3) {
    if (endpoint) {
      this.Endpoint = endpoint;
    } else {
      throw new Error('endpoint is required');
    }

    // the options argument is optional
    if (typeof arg3 === 'function') {
      this.Options = arg2;
      this.RefreshFn = arg3;
    } else {
      this.Options = {};
      this.RefreshFn = arg2;
    }

    if (!this.RefreshFn) {
      throw new Error('refresh function is required');
    }

    // the "Authorization" header will be used to store the JWT token
    // make sure the user is not using it for anything else.
    if (this.Options.headers && this.Options.headers.Authorization) {
      throw new Error('the "Authorization" header should not exist');
    }

    // The HTTP transport will be (re-)created with every token refresh.
    // This is done because we need to change headers with each refresh.
    this.Transport = null;

    // queue requests here when this.token is null.
    // after refreshing the token, process the queue.
    this.Waitlist = [];

    // true if the transport is manually closed

    // no further communication will be possible
    this.Closed = false;
    if(this.Options.accessToken) {
      this.SetAccessToken(this.Options.accessToken);
    } else {
    // refresh immediately
      this.ScheduleRefresh(0);
    }
  }

  send(query, variables, opname) {
    if (this.Closed) {
      throw new Error('transport is closed');
    }

    if (this.Transport) {
      return this.Transport.send(query, variables, opname);
    }

    return new Promise((resolve, reject) => {
      const job = {query, variables, opname, resolve, reject, done: false};
      this.Waitlist.push(job);

      setTimeout(() => {
        if (!job.done) {
          job.done = true;
          reject(ERR_JOB_TIMEOUT);
        }
      }, MAX_JOB_WAIT_TIME);
    });
  }

  close() {
    this.Transport = null;
    this.Closed = true;
  }

  ProcessWaitlist() {
    const jobs = this.Waitlist;
    this.Waitlist = [];

    jobs.forEach(job => {
      const {query, variables, opname, resolve, reject, done} = job;
      if (!done) {
        job.done = true;
        this.send(query, variables, opname).then(resolve, reject);
      }
    });
  }

  async SetAccessToken(token) {
    try {
      if (!token) {
        throw new Error('invalid token');
      }

      const options = Object.assign({headers: {}}, this.Options);
      options.headers.Authorization = `Bearer ${token}`;

      this.Transport = new HttpTransport(this.Endpoint, options);
      this.ProcessWaitlist();

      // assuming the token has an expiration time
      // TODO handle tokens without expiration times
      const payload = jwtDecode(token, null, true);
      if (!payload || !payload.exp) {
        throw new Error('invalid token');
      }

      // schedule next token refresh
      const expires = payload.exp * 1000;
      this.ScheduleRefresh(expires);
    } catch (e) {
      console.log(e);
      this.Transport = null;
      this.ScheduleRefresh(0);
    }
  }

  async RefreshToken() {
    if (this.Closed) {
      return;
    }
    const token = await this.RefreshFn();
    await this.SetAccessToken(token);
  }

  ScheduleRefresh(expires) {
    const now = Date.now();
    const timeLeft = expires - now;

    if (timeLeft <= MIN_REFRESH_TIMEOUT) {
      this.RefreshToken();
      return;
    }

    // add some slack time to avoid queuing
    const timeout = timeLeft - MIN_REFRESH_TIMEOUT;
    setTimeout(() => this.RefreshToken(), timeout);
  }
}
