import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

let profileTrend = new Trend("profile_request_duration");

const NUM_PRECREATED_USERS = 100; // only 100 precreated users
let tokens = [];

export const options = {
  stages: [
    { duration: "1m", target: 2000 }, // ramp up to 2k
    { duration: "2m", target: 2000 }, // ramp to 5k
    { duration: "1m", target: 5000 }, // ramp up to 2k
    { duration: "2m", target: 5000 }, // ramp to 5k
    { duration: "1m", target: 10000 }, // ramp up to 2k
    { duration: "2m", target: 10000 }, // peak 10k users
    { duration: "1m", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% requests under 1s
  },
  setupTimeout: "180s",
};

// Setup runs once before all virtual users start
export function setup() {
  const baseUrl = "http://localhost:8000";
  const headers = { headers: { "Content-Type": "application/json" } };
  let tokens = [];

  for (let i = 0; i < NUM_PRECREATED_USERS; i++) {
    const username = `stressuser_${i}`;
    const password = "password123";

    // Try register (ignore duplicate users)
    let res = http.post(
      `${baseUrl}/auth/register`,
      JSON.stringify({
        username,
        password,
        email: `${username}@example.com`,
        full_name: `Stress User ${i}`,
        role: "user",
      }),
      headers
    );

    // Always try login to get token
    res = http.post(
      `${baseUrl}/auth/login`,
      JSON.stringify({ username, password }),
      headers
    );

    if (res.status === 200 && res.json().token) {
      tokens.push(res.json().token);
    }
  }

  return tokens;
}

export default function (data) {
  // Randomly select token from 100 precreated accounts
  const token = data[Math.floor(Math.random() * data.length)];

  const res = http.get("http://localhost:8000/auth/profile", {
    headers: { Cookie: `SESSION_TOKEN=${token}` },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  profileTrend.add(res.timings.duration);

  // Short think time to keep pressure high
  sleep(0.3);
}
