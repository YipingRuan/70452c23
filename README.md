## Description

A quick demo project for zuju fixture listing API.

## Setup & Run

Deployed at https://zuju-dev.yipingruan.com/api-docs

To run locally, drop the `.env.development` file under the root folder, next to `.env`.

```bash
$ npm install
$ npm run start

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Design

### Assumptions

Observations based on short usage of mobile app `Kickoff by Zuju`:
- To serve users with different cultures (language and timezone)
- There are fewer than 100 matches per day, for all tournaments (seems 50 on average)
- For match information, there are far more reads than writes

### Data store

`redis` is choosen over `mysql` to support match fixture load. With 100 matches daily setup:
- 1 month match summary only uses 4MB redis memory
- Daily matches json reaches client within 30ms (around 15kb, free redis plan)

Thus it is a ultra-fast and cost-effective choice.

### Discussion on API

#### List daily matches

Return matches within 24 hours range.

```
/matchFixture/listDailyMatches?date=2023-12-05&timezoneOffset=3
{
    "date": "2023-12-05",
    "timezoneOffset": 8,
    "localDay": [
        "2023-12-04T16:00:00.000Z",
        "2023-12-05T15:59:59.999Z"
    ],
    "matches": [
        {
            "id": 301,
            "time": 20231204182000,
            "tournamentId": 7,
            "homeTeamId": 480,
            "awayTeamId": 107,
            "score": "8:3",
            "isEnded": true,
            "isLive": true
        },
        // More matches
    ]
}
```

- Client should send `date` and `timezoneOffset` (based on user preference). This allows calculation of day start/end time in UTC
- A redis key scan operation quickly fetches all the mathces with the time range
- Only the id of tournament and team are returned. The client should hydrate the content
- The client can easily group/filter/sort by tournament, in user local language

#### List monthly match mask

Return a mask number indicating the month daily match existence

```
/matchFixture/listMonthlyMatchMask?year=2023&month=12
{
    "year": 2023,
    "month": 12,
    "mask": 450912258
}
```

We only need a single 32-bit integer to represent the information (max 31 days in a month!). From left to right with index starts at 0, a value 1 means there is at least 1 match on day `(index + 1)`. In the above example:
```
bin(450912258)
11010111000000110000000000010
```
This means `2023-12-01` has no match while `2023-12-02` has.

Design can be further refined to consider timzone like the `listDailyMatches` above.

### Discussion on error handling
A `CodedError` class is designed such that it will bubble up the `try-cache` chain:

- For user:
  - Error code and data allows frontend to interpolate/translate with an template in local language
  - User friendly (e.g,  "Update failed"[✓],  "Database fail"[X]) error code and http status code respects developer intention. 
- For developer:
  - **Original error stack** is preserved, not swallowed, which greatly improve the debugging experience
  - Works naturally with nestjs exception filter
  - Pass error cross microservice with no effort

### Discussion about the App
- Currently the match list rendering is a bit slow, consider only render list item when it enters user view
- Avoid backend API call each time when user selecting competition filter

## Stay in touch

- Author - [Yiping](https://www.linkedin.com/in/yiping-r-8a782a80/)