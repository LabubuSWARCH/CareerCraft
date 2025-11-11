import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

let profileTrend = new Trend("profile_request_duration");

const NUM_PRECREATED_USERS = 50; // pre-create 50 users for normal load
let tokens = [];

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // ramp up
    { duration: "1m", target: 200 }, // sustain moderate load
    { duration: "1m", target: 500 }, // peak normal load
    { duration: "30s", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% requests < 500ms
  },
};

// setup: register + login users before test
export function setup() {
  tokens = [];
  for (let i = 0; i < NUM_PRECREATED_USERS; i++) {
    const username = `loaduser_${Date.now()}_${i}`;
    const password = "password123";

    // register
    let res = http.post(
      "http://localhost:8000/auth/register",
      JSON.stringify({
        username,
        password,
        email: `${username}@example.com`,
        full_name: `Load User ${i}`,
        role: "user",
      }),
      { headers: { "Content-Type": "application/json" } }
    );

    check(res, { "register status 201": (r) => r.status === 201 });

    // login
    res = http.post(
      "http://localhost:8000/auth/login",
      JSON.stringify({
        username,
        password,
      }),
      { headers: { "Content-Type": "application/json" } }
    );

    check(res, { "login status 200": (r) => r.status === 200 });

    tokens.push(res.json().token);
  }
  return tokens;
}

export default function (data) {
  // pick random token
  const token = data[Math.floor(Math.random() * data.length)];

  // hit profile endpoint (can replace with dashboard/resume preview)
  const res = http.get("http://localhost:8000/auth/profile", {
    headers: { Cookie: `SESSION_TOKEN=${token}` },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response has username": (r) => JSON.parse(r.body).username !== undefined,
  });

  profileTrend.add(res.timings.duration);

  sleep(1); // simulate user think time
}
